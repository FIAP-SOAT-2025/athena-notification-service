const { buildTemplate } = require("../src/utils/buildTemplate");
const { loadTemplate } = require("../src/utils/loadTemplate.util");
const { transporter } = require("../src/config/mail.config");
const { sendNotification } = require("../src/modules/notification/notification.service");

jest.mock("../src/utils/loadTemplate.util");
jest.mock("../src/config/mail.config");

describe("Integration Tests - Email Notification Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.MAIL_USER = "noreply@athena.com";
  });

  test("deve executar fluxo completo: sucesso", async () => {
    const htmlTemplate = `
      <h1>{{title}}</h1>
      <p>Olá {{username}},</p>
      {{statusBox}}
      <p>Arquivo processado: {{filename}}</p>
    `;

    loadTemplate.mockReturnValue(htmlTemplate);
    transporter.sendMail = jest.fn().mockResolvedValueOnce({ 
      messageId: "test-123",
      accepted: ["user@example.com"]
    });

    await sendNotification({
      to: "user@example.com",
      subject: "Seu vídeo foi processado",
      type: "success",
      username: "Alice",
      filename: "tutorial.mp4"
    });

    expect(transporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "noreply@athena.com",
        to: "user@example.com",
        subject: "Seu vídeo foi processado"
      })
    );

    const callArgs = transporter.sendMail.mock.calls[0][0];
    expect(callArgs.html).toContain("O processamento do seu vídeo");
    expect(callArgs.html).toContain("Alice");
    expect(callArgs.html).toContain("tutorial.mp4");
  });

  test("deve executar fluxo completo: erro", async () => {
    const htmlTemplate = `
      <h1>{{title}}</h1>
      <p>Olá {{username}},</p>
      {{statusBox}}
    `;

    loadTemplate.mockReturnValue(htmlTemplate);
    transporter.sendMail = jest.fn().mockResolvedValueOnce({ 
      messageId: "test-456"
    });

    await sendNotification({
      to: "admin@example.com",
      subject: "Erro no processamento",
      type: "error",
      username: "Bob",
      filename: "broken.mp4"
    });

    const callArgs = transporter.sendMail.mock.calls[0][0];
    expect(callArgs.html).toContain("Identificamos um problema");
    expect(callArgs.html).toContain("⚠ Erro de Processamento");
  });

  test("deve lidar com múltiplos envios consecutivos", async () => {
    loadTemplate.mockReturnValue("<p>{{username}}</p>");
    transporter.sendMail = jest.fn()
      .mockResolvedValueOnce({ messageId: "1" })
      .mockResolvedValueOnce({ messageId: "2" })
      .mockResolvedValueOnce({ messageId: "3" });

    const promises = [
      sendNotification({
        to: "user1@example.com",
        subject: "Test 1",
        type: "success",
        username: "User1"
      }),
      sendNotification({
        to: "user2@example.com",
        subject: "Test 2",
        type: "success",
        username: "User2"
      }),
      sendNotification({
        to: "user3@example.com",
        subject: "Test 3",
        type: "error",
        username: "User3"
      })
    ];

    await Promise.all(promises);

    expect(transporter.sendMail).toHaveBeenCalledTimes(3);
  });

  test("deve rejeitar parcialmente quando um envio falha", async () => {
    loadTemplate.mockReturnValue("<p>Test</p>");
    transporter.sendMail = jest.fn()
      .mockResolvedValueOnce({ messageId: "1" })
      .mockRejectedValueOnce(new Error("Network timeout"))
      .mockResolvedValueOnce({ messageId: "3" });

    const results = await Promise.allSettled([
      sendNotification({
        to: "user1@example.com",
        subject: "Test 1",
        type: "success"
      }),
      sendNotification({
        to: "user2@example.com",
        subject: "Test 2",
        type: "success"
      }),
      sendNotification({
        to: "user3@example.com",
        subject: "Test 3",
        type: "success"
      })
    ]);

    expect(results[0].status).toBe("fulfilled");
    expect(results[1].status).toBe("rejected");
    expect(results[2].status).toBe("fulfilled");
  });

  test("deve preservar a ordem dos parâmetros", async () => {
    loadTemplate.mockReturnValue("{{username}} - {{filename}}");
    transporter.sendMail = jest.fn().mockResolvedValueOnce({});

    await sendNotification({
      to: "test@example.com",
      subject: "Order Test",
      type: "success",
      username: "João",
      filename: "documento.pdf"
    });

    const html = transporter.sendMail.mock.calls[0][0].html;
    expect(html).toContain("João - documento.pdf");
  });

  test("deve lidar com caracteres especiais no template", async () => {
    const specialTemplate = `
      <p>Usuário: {{username}}</p>
      <p>Email: {{email}}</p>
      <p>Mensagem: {{message}}</p>
    `;

    loadTemplate.mockReturnValue(specialTemplate);
    transporter.sendMail = jest.fn().mockResolvedValueOnce({});

    await sendNotification({
      to: "test@example.com",
      subject: "Test",
      type: "success",
      username: "José & Maria",
      email: "test@example.com",
      message: "Processamento 100% completo!"
    });

    const html = transporter.sendMail.mock.calls[0][0].html;
    expect(html).toContain("José & Maria");
  });
});
