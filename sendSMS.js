const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const serv = process.env.serv;
const client = require('twilio')(accountSid, authToken);

function notifyMe(pinCodeVaccine) {

const notificationOpts = {
    toBinding: JSON.stringify({
      binding_type: 'sms',
      address: process.env.personalNumber,
    }),
    body: `Vaccine available at ${pinCodeVaccine}`,
  };
  
  client.notify
    .services(serv)
    .notifications.create(notificationOpts)
    .then(notification => console.log(notification.sid))
    .catch(error => console.log(error));
}

module.exports = notifyMe