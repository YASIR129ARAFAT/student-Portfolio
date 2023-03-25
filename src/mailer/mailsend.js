var nodemailer = require("nodemailer");

var transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "iit2021113@iiita.ac.in",
    pass: "parwez321@",
  },
});


module.exports = transport;
