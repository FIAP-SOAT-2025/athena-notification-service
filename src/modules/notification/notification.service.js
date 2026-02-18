const { transporter } = require("../../config/mail.config");
const { buildTemplate } = require("../../utils/buildTemplate");
const { loadTemplate } = require("../../utils/loadTemplate.util");

async function sendNotification({ to, subject, type, ...data }) {

  if (!["error", "success"].includes(type)) {
    throw new Error("Invalid notification type");
  }

  const template = loadTemplate(`email.template.html`);

  const html = buildTemplate({...data, type, emailTemplate:template})

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    html
  });
}

module.exports = { sendNotification };
