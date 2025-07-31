require('dotenv').config();

module.exports = {
  SENDER_EMAIL: process.env.SENDER_EMAIL || "default@gmail.com",
  RECIPIENT_EMAIL: process.env.RECIPIENT_EMAIL || "default-recipient@example.com"
};
