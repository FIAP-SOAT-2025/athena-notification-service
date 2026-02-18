const { handler } = require("../src/handler");
const { sendNotification } = require("../src/modules/notification/notification.service");

jest.mock("../src/modules/notification/notification.service");

describe("Handler - Edge Cases and Validations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve rejeitar evento sem nenhum campo", async () => {
    const response = await handler({});

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toBe("Missing required fields");
  });

  test("deve rejeitar evento com 'to' vazio", async () => {
    const response = await handler({
      to: "",
      subject: "Test",
      type: "success"
    });

    expect(response.statusCode).toBe(400);
  });

  test("deve rejeitar evento com 'subject' vazio", async () => {
    const response = await handler({
      to: "test@example.com",
      subject: "",
      type: "success"
    });

    expect(response.statusCode).toBe(400);
  });

  test("deve rejeitar evento com 'type' null", async () => {
    const response = await handler({
      to: "test@example.com",
      subject: "Test",
      type: null
    });

    expect(response.statusCode).toBe(400);
  });

  test("deve rejeitar evento com 'type' undefined", async () => {
    const response = await handler({
      to: "test@example.com",
      subject: "Test"
    });

    expect(response.statusCode).toBe(400);
  });

  test("deve aceitar campos opcionais ausentes", async () => {
    sendNotification.mockResolvedValueOnce(undefined);

    const response = await handler({
      to: "test@example.com",
      subject: "Test",
      type: "success"
    });

    expect(response.statusCode).toBe(200);
    expect(sendNotification).toHaveBeenCalledWith({
      to: "test@example.com",
      subject: "Test",
      type: "success"
    });
  });

  test("deve passar dados adicionais para sendNotification", async () => {
    sendNotification.mockResolvedValueOnce(undefined);

    const response = await handler({
      to: "test@example.com",
      subject: "Test",
      type: "success",
      username: "John",
      filename: "video.mp4",
      metadata: "extra-data",
      timestamp: "2026-02-18T14:30:00Z"
    });

    expect(response.statusCode).toBe(200);
    expect(sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "test@example.com",
        subject: "Test",
        type: "success"
      })
    );
  });

  test("deve retornar status correto para erro genérico", async () => {
    sendNotification.mockRejectedValueOnce(new Error("Unknown error"));

    const response = await handler({
      to: "test@example.com",
      subject: "Test",
      type: "success"
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe("Erro interno");
    expect(sendNotification).toHaveBeenCalled();
  });

  test("deve retornar status 500 para erro não tratado", async () => {
    const error = new Error("Unexpected error");
    sendNotification.mockRejectedValueOnce(error);

    const response = await handler({
      to: "test@example.com",
      subject: "Test",
      type: "success"
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe("Erro interno");
  });

  test("deve lidar com email com múltiplos recipients", async () => {
    sendNotification.mockResolvedValueOnce(undefined);

    const response = await handler({
      to: "user1@example.com, user2@example.com, user3@example.com",
      subject: "Test",
      type: "success"
    });

    expect(response.statusCode).toBe(200);
    expect(sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user1@example.com, user2@example.com, user3@example.com"
      })
    );
  });

  test("deve lidar com caracteres especiais na url", async () => {
    sendNotification.mockResolvedValueOnce(undefined);

    const response = await handler({
      to: "test+tag@example.com",
      subject: "Test & Special < > Characters",
      type: "success"
    });

    expect(response.statusCode).toBe(200);
  });

  test("deve manter estrutura de resposta consistente no erro", async () => {
    sendNotification.mockRejectedValueOnce(new Error("Test"));

    const response = await handler({
      to: "test@example.com",
      subject: "Test",
      type: "success"
    });

    expect(response).toHaveProperty("statusCode");
    expect(response).toHaveProperty("body");
    expect(typeof response.body).toBe("string");
    expect(() => JSON.parse(response.body)).not.toThrow();
  });

  test("deve manter estrutura de resposta consistente no sucesso", async () => {
    sendNotification.mockResolvedValueOnce(undefined);

    const response = await handler({
      to: "test@example.com",
      subject: "Test",
      type: "success"
    });

    expect(response).toHaveProperty("statusCode");
    expect(response).toHaveProperty("body");
    expect(typeof response.body).toBe("string");
    expect(JSON.parse(response.body)).toHaveProperty("message");
  });

  test("deve processar evento com valores muito longos", async () => {
    sendNotification.mockResolvedValueOnce(undefined);

    const longSubject = "S".repeat(1000);
    const longUsername = "U".repeat(500);

    const response = await handler({
      to: "test@example.com",
      subject: longSubject,
      type: "success",
      username: longUsername
    });

    expect(response.statusCode).toBe(200);
    expect(sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: longSubject,
        username: longUsername
      })
    );
  });
});
