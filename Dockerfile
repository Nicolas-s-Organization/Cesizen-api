# syntax=docker/dockerfile:1

# ─── Stage 1 : build ────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

# Modules natifs (argon2, bcrypt) → outils de compilation ; openssl pour Prisma
RUN apk add --no-cache python3 make g++ openssl

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Génère le client Prisma (TS), bundle l'app en un fichier ESM, puis élague les devDependencies
RUN npx prisma generate && npm run build && npm prune --omit=dev

# ─── Stage 2 : runtime ──────────────────────────────────────────────────────
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# openssl pour les engines Prisma, wget pour le healthcheck
RUN apk add --no-cache openssl wget

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json /app/prisma.config.ts ./

# Dossier d'upload accessible en écriture par l'utilisateur non-root
RUN mkdir -p /app/uploads/articles && chown -R node:node /app/uploads

# Exécution en utilisateur non-root (l'utilisateur `node` existe dans l'image)
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

# Applique les migrations, applique le seed idempotent, puis démarre l'API.
# Le seed utilise des UUIDs fixes + upsert → no-op si les données existent déjà.
ENTRYPOINT ["sh", "-c", "npx prisma migrate deploy && node dist/seed.mjs && exec node dist/server.mjs"]
