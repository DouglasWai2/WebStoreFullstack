const nodemailer = require("nodemailer");
require('dotenv').config

const sendEmail = async (email, subject, text) => {

  try {
    const transporter = nodemailer.createTransport({
      send: true,
      name: "WebStore",
      service: process.env.SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: text,
    }, (error, info) => {
      if (error) {
        console.log(error);
      }
      console.log("Email sent: " + info.response)
    });
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;