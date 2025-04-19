const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {

  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.SMTP_SLOT_MAIL,
      pass: process.env.SMTP_SLOT_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_SLOT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

// SMTP_MAIL=mindmatrix@clinf.com
// SMTP_PASSWORD=MindMatrix@234