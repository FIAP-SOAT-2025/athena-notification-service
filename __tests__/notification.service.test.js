const { sendNotification } = require("../src/modules/notification/notification.service");
const { transporter } = require("../src/config/mail.config");
const { buildTemplate } = require("../src/utils/buildTemplate");
const { loadTemplate } = require("../src/utils/loadTemplate.util");

jest.mock("../src/config/mail.config");
jest.mock("../src/utils/buildTemplate");
jest.mock("../src/utils/loadTemplate.util");

describe("Notification Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.MAIL_USER = "test@gmail.com";
  });

  test("deve enviar notificação com tipo 'success'", async () => {
    const mockTemplate = "<p>{{username}}</p>";
    const mockBuiltTemplate = "<p>John</p>";

    loadTemplate.mockReturnValue(mockTemplate);
    buildTemplate.mockReturnValue(mockBuiltTemplate);
    transporter.sendMail.mockResolvedValueOnce({ messageId: "123" });

    await sendNotification({
      to: "user@example.com",
      subject: "Video Processado",
      type: "success",
      username: "John",
      filename: "video.mp4"
    });

    expect(loadTemplate).toHaveBeenCalledWith("email.template.html");
    expect(buildTemplate).toHaveBeenCalledWith({
      username: "John",
      filename: "video.mp4",
      type: "success",
      emailTemplate: mockTemplate
    });
    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: "test@gmail.com",
      to: "user@example.com",
      subject: "Video Processado",
      html: mockBuiltTemplate
    });
  });

  test("deve enviar notificação com tipo 'error'", async () => {
    const mockTemplate = "<p>Error: {{filename}}</p>";
    const mockBuiltTemplate = "<p>Error: video.mp4</p>";

    loadTemplate.mockReturnValue(mockTemplate);
    buildTemplate.mockReturnValue(mockBuiltTemplate);
    transporter.sendMail.mockResolvedValueOnce({ messageId: "456" });

    await sendNotification({
      to: "user@example.com",
      subject: "Erro no Processamento",
      type: "error",
      filename: "video.mp4"
    });

    expect(buildTemplate).toHaveBeenCalledWith({
      filename: "video.mp4",
      type: "error",
      emailTemplate: mockTemplate
    });
    expect(transporter.sendMail).toHaveBeenCalled();
  });

  test("deve lançar erro para tipo de notificação inválido", async () => {
    loadTemplate.mockReturnValue("<p>Template</p>");

    await expect(
      sendNotification({
        to: "user@example.com",
        subject: "Test",
        type: "invalid_type"
      })
    ).rejects.toThrow("Invalid notification type");

    expect(transporter.sendMail).not.toHaveBeenCalled();
  });

  test("deve lançar erro quando SMTP falha", async () => {
    loadTemplate.mockReturnValue("<p>Template</p>");
    buildTemplate.mockReturnValue("<p>Built</p>");
    transporter.sendMail.mockRejectedValueOnce(new Error("SMTP connection error"));

    await expect(
      sendNotification({
        to: "user@example.com",
        subject: "Test",
        type: "success"
      })
    ).rejects.toThrow("SMTP connection error");
  });
});
