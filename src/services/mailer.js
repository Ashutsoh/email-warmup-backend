const nodemailer = require("nodemailer");

async function smtpTransporter(config) {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure ? true : false,
    auth: {
      user: config.user,
      pass: config.pass
    }
  });

  await transporter.verify();
  return transporter;
}

async function sendMail(transporter, emailConfig) {
  return transporter.sendMail(emailConfig);
}

module.exports = { smtpTransporter, sendMail };
