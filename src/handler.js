const { sendNotification } = require("./modules/notification/notification.service");

exports.handler = async (event) => {
  try {
    const { to, subject, type, username, filename } = event;

    if (!to || !subject || !type) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" })
      };
    }

    await sendNotification({
      to,
      subject,
      type,
      username,
      filename
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email enviado com sucesso" })
    };

  } catch (error) {
    console.error("Erro:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro interno" })
    };
  }
};
