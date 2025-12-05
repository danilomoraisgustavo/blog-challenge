# backend/Dockerfile
FROM node:20-alpine AS base

WORKDIR /app

# Copia package.json e instala dependências (produção)
COPY package*.json ./
RUN npm ci --omit=dev

# Copia código fonte
COPY . .

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "src/index.js"]
