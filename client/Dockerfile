# ========================
# 1. Build stage
# ========================
FROM node:22 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ========================
# 2. Frontend server (NGINX)
# ========================
FROM nginx:alpine

# Remove conteúdo padrão
RUN rm -rf /usr/share/nginx/html/*

# Copia dist para o nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
