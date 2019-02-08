const assert = require('assert');
const Q = require('q');

const Mailer = function Mailer() {};
const Mailjet = require('node-mailjet');

const log = require('debug')('loopback:connector:mailjet');

const MailjetConnector = function MailjetConnector(settings) {
  assert(typeof settings === 'object', 'cannot init connector without settings');
  assert(typeof settings.apiKey === 'string', 'cannot init connector without api key');
  assert(typeof settings.apiSecret === 'string', 'cannot init connector without api secret');

  if (settings.apiKey && settings.apiSecret) {
    // Connection options
    if (settings.options) {
      this.mailjet = Mailjet.connect(settings.apiKey, settings.apiSecret, { ...settings.options }); //eslint-disable-line
    }
    // No options given
    else {
      this.mailjet = Mailjet.connect(settings.apiKey, settings.apiSecret); //eslint-disable-line
    }
  }
};

MailjetConnector.initialize = (dataSource, callback) => {
  dataSource.connector = new MailjetConnector(dataSource.settings);
  callback();
};

MailjetConnector.prototype.DataAccessObject = Mailer;

Mailer.send = function (emailData, cb) { // eslint-disable-line
  const { connector } = this.dataSource;
  const deferred = Q.defer();

  const fn = (err, result) => {
    if (err) {
      deferred.reject(err);
    }
    else {
      deferred.resolve(result);
    }
    return cb && cb(err, result);
  };

  assert(connector, 'Cannot send mail without a connector!');

  if (connector.mailjet) {
    connector.mailjet.post('send').request(emailData)
      .then(result => {
        log(result.body);
        fn(null, result.body);
      })
      .catch(err => {
        log('send failed with statusCode', err.statusCode);
        fn(err);
      });
  }
  else {
    process.nextTick(function nextTick() { // eslint-disable-line
      fn(null, emailData);
    });
  }
  return deferred.promise;
};

Mailer.prototype.send = function protoSend(fn) {
  return this.constructor.send(this, fn);
};

module.exports = MailjetConnector;
