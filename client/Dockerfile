# Build
FROM node:22 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Runtime
FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

# Copia o build gerado
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=4000

# Vite preview por padrão
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4000"]
