#!/bin/sh
set -e

echo ">> Ambiente atual: $APP_ENV"

if [ "$APP_ENV" = "dev" ]; then
    echo ">> Iniciando em modo desenvolvimento"
    exec npm run start:dev
elif [ "$APP_ENV" = "prod" ]; then
    echo ">> Iniciando em modo produção"
    exec npm start
else
    echo ">> Ambiente não especificado, usando produção como padrão"
    exec npm start
fi