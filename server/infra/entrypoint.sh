#!/bin/sh
set -e

echo ">> Ambiente atual: $NODE_ENV"

echo ">> Aguardando banco ficar disponível..."
sleep 5

if [ "$NODE_ENV" = "development" ]; then
    echo ">> Rodando prisma migrate dev..."
    npx prisma migrate dev
    echo ">> Iniciando em modo desenvolvimento"
    exec npm run start:dev
else
    echo ">> Rodando prisma migrate deploy..."
    npx prisma migrate deploy
    echo ">> Iniciando em modo produção com PM2"
    exec pm2-runtime infra/ecosystem.config.js --env production
fi
