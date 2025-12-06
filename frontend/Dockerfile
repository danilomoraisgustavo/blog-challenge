# frontend/Dockerfile

# Etapa 1: build do Vite/React
FROM node:20-alpine AS build

WORKDIR /app

# Copia apenas os manifests do frontend (usando contexto na raiz do repo)
COPY frontend/package*.json ./

# Como não temos package-lock no frontend, usamos npm install
RUN npm install

# Copia o código-fonte do frontend
COPY frontend/ .

# API do backend em produção (via Nginx /api → backend)
ENV VITE_API_URL=/api

# Build de produção
RUN npm run build

# Etapa 2: servir com Nginx
FROM nginx:1.27-alpine AS prod

# Remove a configuração default
RUN rm /etc/nginx/conf.d/default.conf

# Copia configuração customizada do Nginx (a partir da raiz do repo)
COPY infra/nginx.conf /etc/nginx/conf.d/default.conf

# Copia build gerado do frontend
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
