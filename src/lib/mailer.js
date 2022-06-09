const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "1f40f7a3e2073d",
    pass: "9740701437c3f9",
  },
});
