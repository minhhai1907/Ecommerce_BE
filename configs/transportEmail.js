const nodemailer = require("nodemailer");
const config = require("./config");


const transporter = nodemailer.createTransport(config.email.smtp);
transporter
  .verify()
  .then(() => console.log("Connected to email server"))
  .catch((err) =>
    console.log(err)
  );

module.exports = transporter;
