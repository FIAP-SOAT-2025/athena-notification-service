# 📧 Athena Mail Notifications

[![Test Suite](https://github.com/FIAP-SOAT-2025/athena-notification-service/actions/workflows/tests.yml/badge.svg)](https://github.com/FIAP-SOAT-2025/athena-notification-service/blob/main/.github/workflows/tests.yml)
[![codecov](https://codecov.io/gh/FIAP-SOAT-2025/athena-notification-service/graph/badge.svg)](https://codecov.io/gh/FIAP-SOAT-2025/athena-notification-service)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)

> Serviço serverless altamente confiável para envio de notificações por e-mail, construído com AWS Lambda e Nodemailer. Suporta múltiplos tipos de notificação com templates dinâmicos e validações robustas.

## 📋 Índice

- [Características](#-características)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação-rápida)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [API](#-api)
- [Testes](#-testes-e-ci)
- [Contribuir](#-contribuir)
- [Licença](#-licença)

## ✨ Características

- ✅ **100% de cobertura de testes** - Suite completa com 53 testes
- ✅ **Validação robusta** - Verifica todos campos obrigatórios
- ✅ **Templates dinâmicos** - Substitui variáveis em tempo real
- ✅ **Múltiplos tipos** - Suporta notificações de sucesso e erro
- ✅ **CI/CD automático** - GitHub Actions em todo PR
- ✅ **Sem dependências pesadas** - Apenas 2 dependências de produção
- ✅ **Tratamento de erros** - Respostas claras e informativas
- ✅ **Segurança** - Variáveis sensíveis protegidas



## 🚀 Tecnologias

- **Node.js** v18+ - Runtime JavaScript
- **AWS Lambda** - Computação serverless
- **Nodemailer** - Cliente SMTP para envio de e-mail
- **Gmail (SMTP)** - Provedor de e-mail
- **Jest** - Framework de testes
- **GitHub Actions** - CI/CD automático

## 🏗️ Arquitetura

```
┌─────────────────────┐
│   AWS Lambda Event  │
└──────────┬──────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│             Lambda Handler (handler.js)             │
│  - Valida payload obrigatório                       │
│  - Extrai dados do evento                           │
└──────────────────┬──────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│    Notification Service (notification.service.js)   │
│  - Validação de tipos de notificação                │
│  - Orquestração do fluxo                            │
└──────────────────┬──────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│         Template Engine (buildTemplate.js)          │
│  - Carrega template HTML                            │
│  - Substitui variáveis {{username}}, {{filename}}   │
│  - Injeta conteúdo tipo-específico                  │
└──────────────────┬──────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│         SMTP Transporter (mail.config.js)           │
│  - Conecta ao Gmail SMTP                            │
│  - Envia e-mail                                     │
└──────────────────┬──────────────────────────────────┘
                   ↓
                ✉️ E-mail Enviado
```

## 🚀 Instalação Rápida

### Pré-requisitos
- Node.js 18+ instalado
- Conta Gmail com [senha de aplicativo](https://support.google.com/accounts/answer/185833) gerada
- Git

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/FIAP-SOAT-2025/athena-notification-service.git
cd athena-notification-service
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure variáveis de ambiente**
```bash
cp .env.example .env
```

Edite `.env`:
```env
MAIL_USER=seu_email@gmail.com
MAIL_PASS=sua_senha_de_app
```

⚠️ **Importante**: Utilize [senha de aplicativo](https://myaccount.google.com/apppasswords) do Gmail, não sua senha regular.

4. **Teste localmente**
```bash
npm test              # Roda testes
node local.js         # Simula Lambda localmente
```

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `MAIL_USER` | E-mail do remetente | `seu_email@gmail.com` |
| `MAIL_PASS` | Senha de aplicativo Gmail | `abcd efgh ijkl mnop` |

### Estrutura do Projeto

```
.
├── src/
│   ├── config/
│   │   └── mail.config.js        # Configuração SMTP
│   ├── modules/
│   │   └── notification/
│   │       └── notification.service.js    # Lógica principal
│   ├── templates/
│   │   └── email.template.html   # Template do e-mail
│   ├── utils/
│   │   ├── buildTemplate.js      # Engine de templates
│   │   └── loadTemplate.util.js  # Carregador de arquivos
│   └── handler.js                # Entry point Lambda
├── __tests__/                     # Testes (53 testes, 100% cobertura)
├── .github/
│   └── workflows/
│       └── tests.yml             # Pipeline CI/CD
└── package.json
```

## 💻 Uso

### Executar Localmente (Desenvolvimento)

```bash
node local.js
```

O arquivo `local.js` simula um evento da AWS Lambda. Edite para testar diferentes cenários:

```javascript
const mockEvent = {
  to: "destinatario@email.com",
  subject: "Seu vídeo foi processado",
  type: "success",           // "success" ou "error"
  username: "João Silva",
  filename: "video.mp4"
};
```

### Usar em Produção (AWS Lambda)

Configure a Lambda com:

**Runtime**: Node.js 18.x+  
**Handler**: `src/handler.handler`  
**Timeout**: 30 segundos  
**Memória**: 256 MB mínimo  

**Environment Variables**:
```
MAIL_USER=seu_email@gmail.com
MAIL_PASS=sua_senha_de_app
```

**Exemplo de invocação via AWS CLI**:
```bash
aws lambda invoke \
  --function-name email-notification \
  --payload '{
    "to": "user@example.com",
    "subject": "Seu e-mail!",
    "type": "success",
    "username": "João",
    "filename": "documento.pdf"
  }' \
  response.json
```

## 📊 API

### Request (Payload)

```javascript
{
  // OBRIGATÓRIOS
  "to": "usuario@email.com",                    // string: e-mail do destinatário
  "subject": "Assunto do e-mail",               // string: assunto
  "type": "success",                            // "success" | "error"
  
  // OPCIONAIS (injetados no template)
  "username": "Nome do Usuário",                // string: nome do usuário
  "filename": "documento.pdf"                   // string: nome do arquivo
}
```

### Response (Lambda)

**Sucesso (statusCode: 200)**:
```json
{
  "statusCode": 200,
  "body": "{\"message\": \"Email enviado com sucesso\"}"
}
```

**Erro (statusCode: 400)**:
```json
{
  "statusCode": 400,
  "body": "{\"message\": \"Missing required fields\"}"
}
```

**Erro Interno (statusCode: 500)**:
```json
{
  "statusCode": 500,
  "body": "{\"message\": \"Erro interno\"}"
}
```

### Tipos de Notificação

#### 1. **Success** ✅
Enviado quando o processamento foi bem-sucedido.

- Título dinâmico
- Badge verde (✅ Processamento Concluído)
- Mensagem de sucesso
- Detalhes do arquivo processado

#### 2. **Error** ❌
Enviado quando ocorre um erro no processamento.

- Título informando o problema
- Badge vermelha (⚠ Erro de Processamento)
- Mensagem de erro
- Aviso da equipe técnica

## ✅ Testes e CI

### Rodar Testes Localmente

```bash
npm test                    # Executa todos os testes uma vez
npm run test:watch        # Modo watch: re-roda ao modificar arquivo
npm run test:coverage     # Gera relatório de cobertura (./coverage)
```

### Cobertura de Testes

- **53 testes** cobrindo todos os cenários
- **100% de cobertura** de linhas, branches, funções
- Testa sucesso, erros, validações e edge cases

**Suites de testes**:
- `handler.test.js` - Testes da função Lambda
- `handler.edge-cases.test.js` - Casos extremos e validações
- `notification.service.test.js` - Lógica de notificação
- `notification.service.test.js` - Serviço de notificação
- `buildTemplate.test.js` - Engine de templates
- `buildTemplate.edge-cases.test.js` - Casos especiais de template
- `loadTemplate.test.js` - Carregamento de arquivos
- `integration.test.js` - Testes de integração ponta a ponta

### CI/CD com GitHub Actions

O projeto utiliza **GitHub Actions** para automação:

```yaml
Trigger: Push em main/develop ou Pull Request
  ↓
Instalar Node.js 18.x e 20.x
  ↓
npm ci (instalação limpa)
  ↓
npm test --coverage (testes + cobertura)
  ↓
Verificar cobertura ≥ 80%
  ↓
Upload para codecov.io
  ↓
✅ Sucesso → PR pode fazer merge
❌ Falha → Bloqueia merge até corrigir
```

**Requisitos para merge**:
- ✅ Todos os testes passam em Node 18.x
- ✅ Todos os testes passam em Node 20.x
- ✅ Cobertura de código ≥ 80%

Para detalhes sobre CI/CD, consulte [.github/CI_GUIDE.md](.github/CI_GUIDE.md)

### Configurar Branch Protection

Para garantir qualidade em PRs, configure proteção de branch no GitHub:

1. Acesse **Settings > Branches > Add rule**
2. Selecione `main` (ou sua branch padrão)
3. Marque ✅ "Require status checks to pass before merging"
4. Selecione os testes `test (18.x)` e `test (20.x)`

[Guia completo](.github/BRANCH_PROTECTION.md)

## 🔒 Segurança

- ✅ **Variáveis de ambiente** - Credenciais nunca no código
- ✅ **Validação de entrada** - Todos os campos obrigatórios validados
- ✅ **Sem dependências desnecessárias** - Apenas 2 packages
- ✅ **Sem logs sensíveis** - Credenciais nunca exibidas
- ✅ **Separação de responsabilidades** - Config, lógica e templates separados
- ✅ **Testes de segurança** - Casos de validação cobertos

### Práticas de Segurança

1. **Nunca faça commit de `.env`** - Use `.env.example` como template
2. **Use senhas de aplicativo** - Não sua senha do Gmail
3. **Limite permissões da Lambda** - Use IAM roles específicas
4. **Rotacione credenciais** - Regularmente atualize senhas
5. **Monitore logs** - CloudWatch para detectar anomalias

## 🐛 Troubleshooting

### "SMTP Error: Invalid login"
- Verifique `MAIL_USER` e `MAIL_PASS`
- Use [senha de aplicativo](https://myaccount.google.com/apppasswords), não sua senha
- 2FA deve estar **ativado** no Gmail

### "Missing required fields"
Ensure all required fields are in the payload:
```javascript
{
  "to": "email@example.com",           // ✅ Obrigatório
  "subject": "Seu assunto",            // ✅ Obrigatório
  "type": "success",                   // ✅ Obrigatório
  "username": "João"                   // ✅ Recomendado
}
```

### "Template file not found"
- Verifique se `src/templates/email.template.html` existe
- Verifique permissões de leitura do arquivo

### "Testes falhando localmente mas passando no CI"
Possíveis causas:
1. Versão diferente do Node.js
   ```bash
   node --version  # Deve ser 18+
   ```
2. Variáveis de ambiente não configuradas
   ```bash
   echo $MAIL_USER  # Verifique se está setado
   ```

### "Excedeu timeout na Lambda"
- Aumente timeout para 30+ segundos
- Verifique latência de conexão SMTP
- Considere adicionar retry logic

## 📖 Documentação Adicional

- [Guia de Contribuição](./CONTRIBUTING.md) - Como contribuir no projeto
- [Guia de CI/CD](./github/CI_GUIDE.md) - Detalhe sobre testes e integração
- [Configuração de Branch Protection](./.github/BRANCH_PROTECTION.md)

## 🤝 Contribuir

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch feature (`git checkout -b feat/sua-feature`)
3. Commit suas mudanças (`git commit -m 'feat: descrição'`)
4. Rode testes (`npm test`)
5. Push para sua branch (`git push origin feat/sua-feature`)
6. Abra um Pull Request

Consulte [CONTRIBUTING.md](./CONTRIBUTING.md) para mais detalhes.

## 📜 Licença

Este projeto está sob a licença [ISC](https://opensource.org/licenses/ISC).

## 👥 Autores

**Desenvolvido pela equipe Athena/Dev**

---

## 📞 Suporte

Tem dúvidas ou encontrou um bug?

- 📝 **Issues**: [Abra uma issue](https://github.com/FIAP-SOAT-2025/athena-notification-service/issues)
- 💬 **Discussions**: [Comece uma discussão](https://github.com/FIAP-SOAT-2025/athena-notification-service/discussions)
- 📧 **Email**: Contacte a equipe Athena

---

**Feito com ❤️ pela equipe Athena | 2026**