# frontend/Dockerfile

# Etapa 1: build do Vite/React
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# API do backend em produção (via Nginx /api → backend)
ENV VITE_API_URL=/api

RUN npm run build

# Etapa 2: nginx para servir estático + proxy
FROM nginx:1.27-alpine AS prod

# Remove config default
RUN rm /etc/nginx/conf.d/default.conf

# Copia config customizada
COPY infra/nginx.conf /etc/nginx/conf.d/default.conf

# Copia build gerado
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
