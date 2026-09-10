FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json tsconfig.json ./

FROM base AS dev
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "run", "dev"]

FROM dev AS builder
RUN npm run build

FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

RUN chown -R node:node /app

USER node

COPY --chown=node:node package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=builder --chown=node:node /app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/server.js"]