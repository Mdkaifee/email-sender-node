const { sendEmail } = require('./emailService');
const { RECIPIENT_EMAIL } = require('./config');

const to = RECIPIENT_EMAIL;  // Now using the email from the .env file
const subject = "Test Subject";
const message = "This is a test email sent from Node.js using Gmail API!";

sendEmail(to, subject, message);
