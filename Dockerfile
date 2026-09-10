FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json tsconfig.json ./

# Etapa de desarrollo (incluye dependencias dev como tsx / nodemon)
FROM base AS dev
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "run", "dev"]

# Etapa de compilación (reutiliza dependencias para compilar TypeScript)
FROM dev AS builder
RUN npm run build

# Etapa final de producción (mínima y segura)
FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

# Asignar propiedad del directorio de trabajo al usuario no-root
RUN chown -R node:node /app

USER node

# Instalar solo dependencias de producción bajo el usuario node
COPY --chown=node:node package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copiar el build compilado con el ownership correcto
COPY --from=builder --chown=node:node /app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/server.js"]