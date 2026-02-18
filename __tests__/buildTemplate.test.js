const { buildTemplate } = require("../src/utils/buildTemplate");

describe("Build Template", () => {
  const mockTemplate = `
    <h1>{{title}}</h1>
    <p>Olá {{username}}</p>
    <p>Arquivo: {{filename}}</p>
    {{statusBox}}
  `;

  test("deve construir template com tipo 'success'", () => {
    const result = buildTemplate({
      username: "João",
      filename: "video.mp4",
      type: "success",
      emailTemplate: mockTemplate
    });

    expect(result).toContain("O processamento do seu vídeo");
    expect(result).toContain("Olá João");
    expect(result).toContain("Arquivo: video.mp4");
    expect(result).toContain("✅ Processamento Concluído");
  });

  test("deve construir template com tipo 'error'", () => {
    const result = buildTemplate({
      username: "Maria",
      filename: "documento.pdf",
      type: "error",
      emailTemplate: mockTemplate
    });

    expect(result).toContain("Identificamos um problema");
    expect(result).toContain("Olá Maria");
    expect(result).toContain("Arquivo: documento.pdf");
    expect(result).toContain("⚠ Erro de Processamento");
  });

  test("deve retornar vazio para variáveis não fornecidas", () => {
    const result = buildTemplate({
      username: "Test",
      type: "success",
      emailTemplate: mockTemplate
    });

    expect(result).toContain("Arquivo: ");
  });

  test("deve lançar erro para tipo inválido", () => {
    expect(() => {
      buildTemplate({
        username: "Test",
        type: "invalid",
        emailTemplate: mockTemplate
      });
    }).toThrow("Invalid template type: invalid");
  });

  test("deve lançar erro se tipo não for fornecido", () => {
    expect(() => {
      buildTemplate({
        username: "Test",
        emailTemplate: mockTemplate
      });
    }).toThrow("Invalid template type: undefined");
  });

  test("deve substituir múltiplas variáveis corretamente", () => {
    const simpleTemplate = "Usuário: {{username}}, Arquivo: {{filename}}";
    
    const result = buildTemplate({
      username: "Pedro",
      filename: "audio.mp3",
      type: "success",
      emailTemplate: simpleTemplate
    });

    expect(result).toContain("Usuário: Pedro");
    expect(result).toContain("Arquivo: audio.mp3");
  });
});
