# 💰 API de Controle Financeiro

Esta é uma **API REST** desenvolvida com **NestJS**, **Prisma ORM** e **PostgreSQL**, responsável por gerenciar **usuários**, **contas bancárias**, **categorias** e **transações financeiras**.  
A aplicação é totalmente **containerizada com Docker** e pode ser executada com apenas alguns comandos.

---

## 🧱 Tecnologias Principais

- [NestJS](https://nestjs.com/) – Framework Node.js para aplicações escaláveis.
- [Prisma ORM](https://www.prisma.io/) – Mapeamento objeto-relacional (ORM) para PostgreSQL.
- [PostgreSQL](https://www.postgresql.org/) – Banco de dados relacional.
- [Docker & Docker Compose](https://www.docker.com/) – Containerização e orquestração.
- [PM2](https://pm2.keymetrics.io/) – Gerenciador de processos Node.js.
- [pgAdmin](https://www.pgadmin.org/) – Interface gráfica para gerenciar o banco de dados PostgreSQL.
- [Swagger](https://docs.nestjs.com/openapi/introduction) – Documentação interativa da API.

---

## 🔧 Configuração do Ambiente

Antes de iniciar, crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
PORT=3000
NODE_ENV="development"
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=FinanceDB
POSTGRES_PORT=5432
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin123
PGADMIN_PORT=8080
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001
DATABASE_URL="postgresql://admin:admin123@host.docker.internal:5432/FinanceDB?schema=public"
JWT_SECRET="teste123"
```

> ⚠️ **Importante:** ajuste o `DATABASE_URL` conforme o nome do seu container PostgreSQL se necessário.

---

## 🚀 Como Executar o Projeto

### 1 - Acessar a pasta da API

```bash
cd server
```

### 2 - Construir os containers

```bash
docker compose build
```

### 3 - Subir os containers

```bash
docker compose up -d
```

### 4 - Acessar o container da aplicação

```bash
docker exec -it <nome_do_container_app> sh
```

### 5 -  Executar as migrações do Prisma

Dentro do container:

```bash
npx prisma migrate dev
```

Isso criará as tabelas no banco PostgreSQL conforme o schema definido.

---

## 🧩 Serviços Disponíveis

| Serviço     | Descrição                        | Porta Local |
|--------------|----------------------------------|-------------|
| `app`        | API NestJS                      | `3000`      |
| `postgres`   | Banco de dados PostgreSQL       | `5432`      |
| `pgadmin`    | Interface de administração DB   | `8080`      |

---

## 📚 Principais Funcionalidades

- 👤 **Usuários**: cadastro, autenticação JWT e gerenciamento.
- 🏦 **Contas bancárias**: vinculação de contas a usuários.
- 🗂 **Categorias**: agrupamento de despesas e receitas.
- 💸 **Transações**: controle de entradas e saídas financeiras.


---

## 🧠 Fluxo Resumido de Desenvolvimento

1. Acesse a pasta da API com `cd server`.
2. Atualize o `.env` com suas variáveis de ambiente.  
3. Execute `docker compose up --build -d`.  
4. Entre no container da aplicação (`app`).  
5. Rode `npx prisma migrate dev`.  
6. A API estará disponível em:  
   👉 **http://localhost:3000**
7. A documentação da API estará disponível em:  
   👉 **http://localhost:3000/swagger**

---

## 🧑‍💻 Autores

**José Nichollas**  
**Ester Marreiro**
💼 Projeto de estudo e prática com NestJS, Prisma e Docker.
