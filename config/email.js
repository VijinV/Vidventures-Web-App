const nodemailer = require('nodemailer');

// Create a transporter object with SMTP configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vfcvijin@gmail.com', // your Gmail address
    pass: 'nkmgensuqskzdgze' // your Gmail password
  }
});

// Create a message object
const message = {
  from: 'vfcvijin@gmail.com', // Sender address
  to: 'visakhvichu3093@gmail.com', // List of recipients
  subject: 'Test Email from Node.js', // Subject line
  text: 'Hello, this is a test email sent from Node.js using Nodemailer!', // Plain text body,
  html: '<p>Hello, this is a test email sent from Node.js using Nodemailer!</p><p>Here\'s a <a href="https://example.com">link</a> for you to check out.</p>' // HTML body with a link
};


// Send the message using the previously created transporter object
const sendMessage = transporter.sendMail(message, function(error, info) {
  if (error) {
    console.log('Error occurred while sending email: ', error.message);
    return process.exit(1);
  }
  console.log('Email sent successfully to: ', info.messageId);
});


module.exports ={
  transporter
}