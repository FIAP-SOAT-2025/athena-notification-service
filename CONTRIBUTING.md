# 🤝 Guia de Contribuição

## Fluxo de Desenvolvimento

### 1. Criar uma branch feature
```bash
git checkout -b feat/sua-feature
# ou
git checkout -b fix/seu-bug
```

### 2. Fazer suas alterações

Certifique-se de:
- ✅ Adicionar ou atualizar testes para suas mudanças
- ✅ Manter cobertura de código acima de 80%
- ✅ Seguir o padrão de código do projeto

### 3. Rodar testes localmente

```bash
npm test              # Rodar testes
npm run test:watch   # Assistir mudanças
npm run test:coverage # Verificar cobertura
```

### 4. Fazer commit com mensagens claras

```bash
git commit -m "feat: adicionar nova funcionalidade"
git commit -m "fix: corrigir bug em notificações"
git commit -m "test: adicionar testes para X"
git commit -m "docs: atualizar documentação"
git commit -m "refactor: melhorar estrutura de código"
git commit -m "perf: otimizar performance de X"
```

**Padrão Conventional Commits:**
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `test:` Adição/modificação de testes
- `docs:` Documentação
- `refactor:` Refatoração (sem mudança funcional)
- `perf:` Otimização de performance
- `chore:` Outras mudanças (build, deps, etc)

### 5. Push para seu fork/branch

```bash
git push origin feat/sua-feature
```

### 6. Criar Pull Request

No GitHub:
1. Preencha a descrição do PR
2. Linke issues relacionadas (`Closes #123`)
3. Aguarde os testes rodem automaticamente

## ✅ Checklist para PR

Antes de criar um PR, garanta:

- [ ] Testes passando localmente (`npm test`)
- [ ] Cobertura acima de 80% (`npm run test:coverage`)
- [ ] Código segue o padrão do projeto
- [ ] Sem console.log ou debug code
- [ ] Commit messages claras e descritivas
- [ ] Documentação atualizada (se necessário)

## 🤖 Verificações Automáticas

Seu PR será testado automaticamente com:

- ✅ **Node.js 18.x**: Versão LTS anterior
- ✅ **Node.js 20.x**: Versão LTS atual
- ✅ **Cobertura de código**: Mínimo 80%
- ✅ **Lint**: *(opcional, adicionar depois)*

Se algum teste falhar, o PR não poderá ser mergiado. 

### 🔄 Refazer testes

Se precisar refazer os testes após correções:
1. Faça os commits adicionais
2. O CI rodará automaticamente
3. Não é necessário fazer nada manualmente

## 📋 Estrutura de Commits

```
feat: adicionar suporte para múltiplos recipients
- Descrever mudanças principais
- Listas de alterações importantes

fix: corrigir erro de validação de email
- Descrever o bug original
- Explicar a solução

test: adicionar testes para validação
- Casos testados
- Cobertura alcançada
```

## 🚀 Deploy (quando implementado)

Após merge em `main`:
1. Testes são rodados
2. Build é gerado
3. Deploy automático em produção (configurar depois)

## 📞 Precisa de ajuda?

- Dúvidas sobre código? Abra uma issue
- Sugestões? Abra uma discussion
- Encontrou um bug? Reporte uma issue detalhada

---

**Obrigado por contribuir! 🎉**
