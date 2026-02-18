# 🔍 Entendendo o CI/CD

## Como o CI funciona

### Quando roda o CI?

O workflow de testes roda automaticamente em:

1. **Push** para branches `main` ou `develop`
2. **Pull Request** para `main` ou `develop`

### O que o CI testa?

```yaml
✅ Instala dependências
✅ Roda testes em Node.js 18.x
✅ Roda testes em Node.js 20.x
✅ Verifica cobertura de código (mín. 80%)
✅ Faz upload para codecov.io
```

## Acompanhando seu PR

### 1. Acesse o seu PR no GitHub

Você verá uma seção "Checks" no seu PR:

```
✅ Test Suite (18.x) - Passou
✅ Test Suite (20.x) - Passou
✅ Code Coverage - Passou
```

### 2. Clickar em "Details" para mais informações

Vê o:
- Saída completa dos testes
- Linha específica que falhou (se houver)
- Relatório de cobertura

## Interpretando resultados

### ✅ Tudo passou

```
Test Suites: 7 passed, 7 total
Tests:       53 passed, 53 total
```

Seu PR está pronto para merge! ✨

### ❌ Um teste falhou

```
FAIL __tests__/handler.test.js
  ● Validation › deve rejeitar campos vazios
    Expected 400, received 500
```

**Ações:**
1. Leia a mensagem de erro
2. Corrija o código localmente
3. Rode `npm test` para verificar
4. Commite a correção
5. CI rodará novamente automaticamente

### ⚠️ Cobertura abaixo de 80%

```
Coverage: 75%
✗ Cobertura abaixo de 80%
```

**Ações:**
1. Rode `npm run test:coverage`
2. Abra `coverage/index.html` no navegador
3. Identifique código não testado (vermelho)
4. Adicione testes faltantes
5. Commite as mudanças

## Visualizando Logs

### Via GitHub Actions

1. Vá ao seu PR
2. Clique em "Checks"
3. Clique em "Test Suite"
4. Expanda "Rodar testes" para ver a saída completa

### Exemplo de saída

```
PASS __tests__/handler.test.js
  Handler
    ✓ deve retornar erro 400 quando faltar campos (15ms)
    ✓ deve retornar sucesso 200 quando enviar (8ms)
    ✓ deve retornar erro 500 quando falhar (6ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

## Status Badges

### No README

A badge mostra o status atual:

- 🟢 **Passing**: Última build passou
- 🟡 **Running**: CI está rodando
- 🔴 **Failing**: Última build falhou

Clique na badge para ver o histórico de builds.

## Branch Protection Rules

Seu repositório pode ter regras que exigem:

- ✅ Todos os testes passarem
- ✅ Reviews aprovadas
- ✅ Branch atualizada com main

Se algum teste falhar, você **não consegue fazer merge** do PR.

## Reruns

Se um teste falhar aleatoriamente (race condition, timeout):

### Opção 1: Via GitHub
1. Vá para "Actions" > "Test Suite"
2. Encontre o workflow que falhou
3. Clique "Re-run failed jobs"

### Opção 2: Via commit
Faça um novo commit vazio:
```bash
git commit --allow-empty -m "chore: trigger CI"
git push
```

## Codecov Integration

A cobertura é enviada para [codecov.io](https://codecov.io):

### Ver relatório online
1. Acesse codecov.io
2. Busque seu repositório
3. Veja histórico de cobertura
4. Compare com commits anteriores

### Pull Request Comments

Codecov adiciona um comentário no PR mostrando:
- Mudanças de cobertura
- Arquivos com baixa cobertura
- Comparação com branch base

## Troubleshooting

### "Test failures that occur on CI but not locally"

Possíveis causas:
- Diferença de versão do Node.js
- Ordem de execução dos testes
- Race conditions
- Variáveis de ambiente

**Solução:**
```bash
# Testa em múltiplas versões localmente
nvm use 18
npm test

nvm use 20
npm test
```

### "CI timeout"

Se um teste demore muito:
- Adicione timeout ao teste
- Otimize o código
- Verifique queries lentas

```javascript
test("meu teste", async () => {
  // teste aqui
}, 10000); // timeout de 10s
```

### "Flaky tests" (testes que falham aleatoriamente)

```bash
# Roda o teste 10 vezes
npm test -- --logHeapUsage --testNamePattern="meu teste" --testTimeout=5000
```

## Links úteis

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Jest Configuration](https://jestjs.io/docs/configuration)
- [Codecov Setup](https://codecov.io/docs)

---

**Dúvidas? Abra uma issue ou discussion!**
