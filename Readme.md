## 📧 Athena Mail Notification

[![Test Suite](https://github.com/resplandeluiz/email-notification/actions/workflows/tests.yml/badge.svg)](https://github.com/resplandeluiz/email-notification/actions/workflows/tests.yml)
[![codecov](https://codecov.io/gh/resplandeluiz/email-notification/graph/badge.svg?token=YOUR_TOKEN)](https://codecov.io/gh/resplandeluiz/email-notification)

Serviço serverless responsável pelo envio de notificações por e-mail utilizando AWS Lambda e Nodemailer.



### 🚀 Tecnologias Utilizadas

<ul>
<li>Node.js</li>
<li>AWS Lambda</li>
<li>Nodemailer</li>
<li>Gmail (SMTP)</li>
<li>Dotenv (ambiente local)</li>
</ul>

### 🏗 Arquitetura

O projeto segue uma estrutura modular baseada em camadas:

src/
│
├── config/            # Configurações (SMTP, etc)
├── services/          # Regras de negócio
├── templates/         # Templates HTML
├── utils/             # Funções utilitárias
└── handler.js         # Entry point da Lambda

## Fluxo de execução

Lambda Handler
    ↓
Notification Service
    ↓
Template Builder
    ↓
SMTP Transporter
    ↓
Envio de Email

## ⚙️ Configuração
1️⃣ Instalar dependências

`npm install`

2️⃣ Variáveis de Ambiente (Local)

Crie um arquivo .env na raiz:

MAIL_USER=seuemail@gmail.com
MAIL_PASS=sua_senha_de_app


##### ⚠️ Utilize senha de aplicativo do Gmail.

## 🧪 Executar Localmente

Execute:

`node local.js`


O arquivo local.js simula o evento da AWS Lambda.

Exemplo de evento:

const mockEvent = {
  to: "destinatario@email.com",
  subject: "Erro ao processor o vídeo",
  type: "error", OU "success"
  username: "Luiz Resplande",
  filename: "video.mp4"
};


## 📩 Payload esperado pela Lambda
{
  "to": "usuario@email.com",
  "subject": "Processamento do Vídeo",
  "type": "success",
  "username": "Luiz",
  "filename": "video.mp4"
}

## 📌 Tipos de Notificação

Atualmente suportados:
 - success 
 - error


Cada tipo injeta dinamicamente:

Título

Caixa de status

Conteúdo contextual

## ✅ Testes

O projeto possui uma suite completa de testes com **100% de cobertura de código**.

### Rodar testes localmente:

```bash
npm test                # Rodar testes uma vez
npm run test:watch     # Modo watch (re-roda ao modificar)
npm run test:coverage  # Gera relatório de cobertura (./coverage)
```

### CI/CD

O projeto utiliza **GitHub Actions** para rodar os testes automaticamente:

- ✅ Rodam em **todo push** para `main` ou `develop`
- ✅ Rodam em **todo PR** (Pull Request)
- ✅ Testam em **Node.js 18.x e 20.x**
- ✅ Verificam **cobertura mínima de 80%**
- ✅ Bloqueiam merge caso os testes falhem

**Status CI**: Veja o [workflow](.github/workflows/tests.yml)

### Configurar Branch Protection:

Para garantir que apenas PRs com testes passando sejam mergiados, consulte [.github/BRANCH_PROTECTION.md](.github/BRANCH_PROTECTION.md)

## 🔒 Segurança

Variáveis sensíveis via Environment Variables

Sem credenciais hardcoded

Separação de templates e lógica


### 👨‍💻 Autor

Desenvolvido pela equipe Athena/Dev.