const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { SENDER_EMAIL } = require('./config');

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

function loadCredentials() {
  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
}

function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
}

function getGmailService(callback) {
  const credentials = loadCredentials();
  const oAuth2Client = authorize(credentials);

  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    oAuth2Client.setCredentials(token);
    callback(oAuth2Client);
  } else {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question('Enter the code from that page here: ', (code) => {
      readline.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        callback(oAuth2Client);
      });
    });
  }
}

function sendEmail(to, subject, message) {
  getGmailService((auth) => {
    const gmail = google.gmail({ version: 'v1', auth });
    const emailLines = [
      `To: ${to}`,
      `From: ${SENDER_EMAIL}`,
      `Subject: ${subject}`,
      '',
      message
    ];
    const email = emailLines.join('\n');

    const encodedMessage = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    gmail.users.messages.send(
      {
        userId: 'me',
        resource: {
          raw: encodedMessage,
        },
      },
      (err, res) => {
        if (err) {
          return console.error('An error occurred while sending email:', err);
        }
        console.log('Email sent successfully. Message ID:', res.data.id);
      }
    );
  });
}

module.exports = { sendEmail };
