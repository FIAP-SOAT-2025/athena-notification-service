#!/bin/bash

# Script para simular o CI localmente
# Útil para testar antes de fazer push

set -e # Exit on error

echo "================================"
echo "🧪 Simulando CI Localmente"
echo "================================"
echo ""

# Verifica se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm ci
fi

echo ""
echo "================================"
echo "🧪 Rodando testes..."
echo "================================"
npm test -- --coverage --no-coverage-reports

echo ""
echo "================================"
echo "✅ Cobertura de código"
echo "================================"

# Extrai a cobertura
COVERAGE=$(head -n 20 coverage/coverage-summary.json | grep -o '"lines"[^}]*' | grep -o '[0-9.]*' | head -1)

echo "Linhas: ${COVERAGE}%"

if (( $(echo "$COVERAGE < 80" | bc -l) )); then
    echo "❌ Cobertura abaixo de 80%"
    echo ""
    echo "Para ver quais linhas não estão testadas:"
    echo "  npm run test:coverage && open coverage/index.html"
    exit 1
fi

echo "✅ Cobertura aceitável!"

echo ""
echo "================================"
echo "✨ Tudo passou! Seguro fazer push"
echo "================================"
