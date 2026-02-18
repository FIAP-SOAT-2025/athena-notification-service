const { handler } = require("../src/handler");
const { sendNotification } = require("../src/modules/notification/notification.service");

jest.mock("../src/modules/notification/notification.service");

describe("Handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve retornar erro 400 quando faltar campos obrigatórios", async () => {
    const event = { to: "test@example.com" };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      message: "Missing required fields"
    });
    expect(sendNotification).not.toHaveBeenCalled();
  });

  test("deve retornar erro 400 quando 'to' estiver vazio", async () => {
    const event = { subject: "Test", type: "success" };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
  });

  test("deve retornar sucesso 200 quando enviar notificação com sucesso", async () => {
    sendNotification.mockResolvedValueOnce(undefined);
    
    const event = {
      to: "test@example.com",
      subject: "Test Subject",
      type: "success",
      username: "John",
      filename: "video.mp4"
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      message: "Email enviado com sucesso"
    });
    expect(sendNotification).toHaveBeenCalledWith({
      to: "test@example.com",
      subject: "Test Subject",
      type: "success",
      username: "John",
      filename: "video.mp4"
    });
  });

  test("deve retornar erro 500 quando sendNotification falhar", async () => {
    sendNotification.mockRejectedValueOnce(new Error("SMTP Error"));
    
    const event = {
      to: "test@example.com",
      subject: "Test",
      type: "success"
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({
      message: "Erro interno"
    });
  });
});
