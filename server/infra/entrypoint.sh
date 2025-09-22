#!/bin/sh
set -e

echo ">> Ambiente atual: $NODE_ENV"

if [ "$NODE_ENV" = "development" ]; then
    echo ">> Iniciando em modo desenvolvimento"
    exec npm run start:dev
else
    echo ">> Iniciando em modo produção com PM2"
    exec pm2-runtime infra/ecosystem.config.js --env production
fi