const accountSid = 'ACea127b36d8d84e595ae6350f5e30a5f2';
const authToken = 'fd728bc78f1b33d944201b9873053c14';
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'hai ',
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+918139097960'
    })
    .then(message => console.log(message.sid))
    // .done();

