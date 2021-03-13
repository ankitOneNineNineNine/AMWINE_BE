var nodemailer = require("nodemailer");

const sender = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",
  auth: {
    user: "4astores1010@gmail.com",
    pass: "",
  },
  debug: true,
  logger: true,
});

function prepareMail(data) {
  let mailbody = {
    from: 'AMWINE SHOP <noreply@amwineshop.com',
    to: data.email,
    subject: data.subject,
    html: data.html,
    attachments: data.attachments
  };
  return mailbody;
};

module.exports = {
    sender,
    prepareMail
}