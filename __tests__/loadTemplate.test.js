const fs = require("fs");
const path = require("path");
const { loadTemplate } = require("../src/utils/loadTemplate.util");

jest.mock("fs");

describe("Load Template", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve carregar um template com sucesso", () => {
    const mockHtml = "<h1>Email Template</h1>";
    fs.readFileSync.mockReturnValue(mockHtml);

    const result = loadTemplate("email.template.html");

    expect(result).toBe(mockHtml);
    expect(fs.readFileSync).toHaveBeenCalledWith(
      expect.stringContaining("email.template.html"),
      "utf-8"
    );
  });

  test("deve usar o caminho correto para o template", () => {
    const mockHtml = "<p>Content</p>";
    fs.readFileSync.mockReturnValue(mockHtml);

    loadTemplate("email.template.html");

    const callArg = fs.readFileSync.mock.calls[0][0];
    expect(callArg).toContain("src/templates");
    expect(callArg).toContain("email.template.html");
  });

  test("deve lançar erro quando arquivo não existe", () => {
    fs.readFileSync.mockImplementation(() => {
      throw new Error("ENOENT: no such file or directory");
    });

    expect(() => {
      loadTemplate("nonexistent.html");
    }).toThrow();
  });

  test("deve retornar conteúdo como string UTF-8", () => {
    const mockContent = "Template com acentuação: café";
    fs.readFileSync.mockReturnValue(mockContent);

    const result = loadTemplate("test.html");

    expect(typeof result).toBe("string");
    expect(result).toBe(mockContent);
  });
});
