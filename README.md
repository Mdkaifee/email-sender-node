# Email Sender Project (Node.js)

A simple Node.js project to send emails using the Gmail API.

## Setup
1. Clone repo & `cd` into folder.
2. Run `npm install`.
3. Put your `credentials.json` (from Google Cloud) in root.
4. Create `.env` and set `SENDER_EMAIL` and `RECEPENT_EMAIL`
5. Run `node main.js` (first time will prompt for Gmail auth).
6.Enter code get on visiting link on your console.
7.Email will be sent successfully.

## Files
- `main.js`: Start here, sends a sample email.
- `emailService.js`: Handles Gmail API & sending.
- `config.js`: Loads environment variables.
