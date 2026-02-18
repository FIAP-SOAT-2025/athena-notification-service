const STATUS_CONTENT = {
  error: {
    title: `Identificamos um problema <strong>durante o processamento</strong> do seu vídeo`,
    statusBox: `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;background:#0F1E33;border:1px solid #1F3B5C;border-radius:8px;">
        <tr>
          <td style="padding:20px;">
            <p style="color:#FFB547;font-weight:bold;margin:0 0 10px 0;">
              ⚠ Erro de Processamento
            </p>
            <p style="margin:0;">
              Um erro inesperado foi identificado durante o processamento do seu vídeo.
              Nossa equipe técnica já foi notificada.
            </p>
          </td>
        </tr>
      </table>
      <p style="margin-top:20px;">
        Estamos trabalhando para resolver a situação o mais rápido possível.
      </p>
    `
  },

  success: {
    title: `O processamento do seu vídeo <strong>foi concluído com sucesso</strong>`,
    statusBox: `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;background:#0F1E33;border:1px solid #1E5EDC;border-radius:8px;">
        <tr>
          <td style="padding:20px;">
            <p style="color:#4DA3FF;font-weight:bold;margin:0 0 10px 0;">
              ✅ Processamento Concluído
            </p>
            <p style="margin:0;">
              Seu vídeo foi processado com sucesso e já está disponível para visualização.
              Todas as etapas foram executadas corretamente.
            </p>
          </td>
        </tr>
      </table>
      <p style="margin-top:20px;">
        Você já pode acessar os detalhes e visualizar os resultados gerados.
      </p>
    `
  }
};

function replaceVariables(template, variables) {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    return variables[key.trim()] || "";
  });
}

function buildTemplate({ username, filename, type, emailTemplate }) {
  const content = STATUS_CONTENT[type];

  if (!content) {
    throw new Error(`Invalid template type: ${type}`);
  }

  return replaceVariables(emailTemplate, {
    username,
    filename,
    title: content.title,
    statusBox: content.statusBox
  });
}

module.exports = { buildTemplate };
