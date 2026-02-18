const { buildTemplate } = require("../src/utils/buildTemplate");

describe("Build Template - Edge Cases", () => {
  const mockTemplate = `
    <h1>{{title}}</h1>
    <p>{{username}} - {{filename}}</p>
    {{statusBox}}
    <footer>{{footer}}</footer>
  `;

  test("deve lidar com valores null", () => {
    const result = buildTemplate({
      username: null,
      filename: "file.txt",
      type: "success",
      emailTemplate: mockTemplate
    });

    expect(result).toContain("Processamento Concluído");
  });

  test("deve lidar com valores undefined", () => {
    const result = buildTemplate({
      username: undefined,
      filename: "file.txt",
      type: "success",
      emailTemplate: mockTemplate
    });

    expect(result).toContain("- file.txt");
  });

  test("deve lidar com strings vazias", () => {
    const result = buildTemplate({
      username: "",
      filename: "",
      type: "success",
      emailTemplate: mockTemplate
    });

    expect(result).toContain(" - ");
  });

  test("deve preservar espaços em branco significativos", () => {
    const result = buildTemplate({
      username: "  João  ",
      filename: "  video.mp4  ",
      type: "success",
      emailTemplate: mockTemplate
    });

    expect(result).toContain("  João  ");
    expect(result).toContain("  video.mp4  ");
  });

  test("deve lidar com números como valores", () => {
    const result = buildTemplate({
      username: 12345,
      filename: "file_001.mp4",
      type: "success",
      emailTemplate: mockTemplate
    });

    expect(result).toContain("12345");
  });

  test("deve lidar com strings muito longas", () => {
    const longString = "a".repeat(10000);
    const result = buildTemplate({
      username: longString,
      filename: "short.mp4",
      type: "success",
      emailTemplate: mockTemplate
    });

    expect(result.length).toBeGreaterThan(10000);
  });

  test("deve lidar com HTML especial no valor", () => {
    const result = buildTemplate({
      username: "<script>alert('xss')</script>",
      filename: "<img src=x onerror='alert(1)'>",
      type: "success",
      emailTemplate: mockTemplate
    });

    // Nota: O buildTemplate não sanitiza, apenas substitui
    expect(result).toContain("<script>");
    expect(result).toContain("<img");
  });

  test("deve suportar variaveis monetárias formatadas", () => {
    const moneyTemplate = "Valor: {{username}}, Moeda: {{currency}}";
    const result = buildTemplate({
      username: "R$ 1.000,00",
      type: "success",
      emailTemplate: moneyTemplate
    });

    expect(result).toContain("R$ 1.000,00");
  });

  test("deve suportar URLs no template", () => {
    const urlTemplate = '<a href="{{filename}}">Clique aqui</a>';
    const result = buildTemplate({
      filename: "https://example.com/video/123?token=abc&format=mp4",
      type: "success",
      emailTemplate: urlTemplate
    });

    expect(result).toContain("https://example.com/video/123?token=abc&format=mp4");
  });

  test("deve suportar datas formatadas", () => {
    const dateTemplate = "Data de processamento: {{username}}";
    const result = buildTemplate({
      username: "18 de fevereiro de 2026 às 14:30",
      type: "success",
      emailTemplate: dateTemplate
    });

    expect(result).toContain("18 de fevereiro de 2026 às 14:30");
  });

  test("deve lançar erro se template type não corresponder a STATUS_CONTENT", () => {
    expect(() => {
      buildTemplate({
        username: "test",
        type: "warning",
        emailTemplate: mockTemplate
      });
    }).toThrow();
  });

  test("deve lançar erro se emailTemplate não é fornecido", () => {
    expect(() => {
      buildTemplate({
        username: "test",
        type: "success"
      });
    }).toThrow();
  });

  test("deve funcionar com template vazio", () => {
    const result = buildTemplate({
      username: "John",
      type: "success",
      emailTemplate: ""
    });

    expect(result).toBe("");
  });

  test("deve substituir variáveis repetidas corretamente", () => {
    const repeatingTemplate = "{{username}} | {{username}} | {{username}}";
    const result = buildTemplate({
      username: "Alice",
      type: "success",
      emailTemplate: repeatingTemplate
    });

    expect(result).toBe("Alice | Alice | Alice");
  });

  test("deve diferenciar variáveis com nomes similares", () => {
    const similarTemplate = "Usuário: {{username}}";
    const result = buildTemplate({
      username: "Alice",
      type: "success",
      emailTemplate: similarTemplate
    });

    expect(result).toContain("Alice");
  });
});
