## loopback-connector-mailjet_v3.1

Loopback connector module which allow to send emails via Mailjet API v3.1. Based on [loopback-connector-mailjet](https://github.com/InteractiveObject/loopback-connector-mailjet).

## 1. Installation

````sh
npm i loopback-connector-mailjet_v3.1 --save
````

## 2. Configuration

datasources.json

    {
        "mailjet": {
            "connector": "loopback-connector-mailjet_v3.1",
            "apiKey": "${MAILJET_API_KEY}",
            "apiSecret":"${MAILJET_API_SECRET}",
            "options": {
                "url": "api.mailjet.com", 
                "version": "v3.1",
                "perform_api_call": false
            },
        }
    }

model-config.json

    {
        "Email": {
            "dataSource": "mailjet",
            "public": false
        }
    }

## 3. Use

Send funtion same as loopback email connector. Returns a Promise.

    Email.send({
        "Messages":[
            {
                "From": {
                    "Email": "pilot@mailjet.com",
                    "Name": "Mailjet Pilot"
                },
                "To": [
                    {
                        "Email": "passenger1@mailjet.com",
                        "Name": "passenger 1"
                    }
                ],
                "Subject": "Your email flight plan!",
                "TextPart": "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
                "HTMLPart": "<h3>Dear passenger 1, welcome to Mailjet!</h3><br />May the delivery force be with you!"
            }
        ]
    })
    .then(function(response){})
    .catch(function(err){});


## License
Licensed under the MIT license.
