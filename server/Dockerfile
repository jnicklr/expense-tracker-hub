# Imagem do node
FROM node:22-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar dependências
COPY package*.json ./
RUN npm install
RUN npm install pm2 -g 

# Copiar código para dentro do docker
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Build do TypeScript (se houver)
RUN npm run build

# Copiar e dar permissão ao entrypoint
COPY infra/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Usar o entrypoint.sh como ponto de entrada
ENTRYPOINT ["/entrypoint.sh"]