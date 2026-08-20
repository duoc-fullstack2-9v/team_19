# ==============================================================================
# Multi-stage Dockerfile para Multiverso Comics (React + Vite)
# Optimizado para AWS App Runner, AWS ECS (Fargate), AWS EKS o EC2
# ==============================================================================

# ----------------- Etapa 1: Construcción (Build Stage) -----------------
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente y compilar
COPY . .
RUN npm run build

# ----------------- Etapa 2: Servidor Ligero (Production Stage) ---------
FROM nginx:1.27-alpine

# Eliminar configuración por defecto de Nginx
RUN rm -rf /etc/nginx/conf.d/* /usr/share/nginx/html/*

# Copiar build de la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto HTTP
EXPOSE 80

# Iniciar servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
