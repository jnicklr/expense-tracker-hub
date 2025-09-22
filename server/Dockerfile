# Imagem do node
FROM node:22-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar dependências
COPY package*.json ./
RUN npm install

# Copiar código para dentro do docker
COPY . .

# Copiar e dar permissão ao entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Usar o entrypoint.sh como ponto de entrada
ENTRYPOINT ["/entrypoint.sh"]