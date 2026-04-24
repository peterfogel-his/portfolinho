FROM node:20-alpine AS deps
RUN npm install -g pnpm
WORKDIR /app

# Kopiera manifest för cache-effektivitet
COPY package.json pnpm-workspace.yaml ./
COPY packages/db/package.json ./packages/db/
COPY apps/server/package.json ./apps/server/

RUN pnpm install --no-frozen-lockfile

# Kopiera källkod
COPY packages/db ./packages/db
COPY apps/server ./apps/server

# ── Produktionsbygge ────────────────────────────────────────────────────────
FROM deps AS builder
RUN pnpm --filter @portfolinho/db build
RUN pnpm --filter @portfolinho/server build

# ── Körbar image ────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY packages/db/package.json ./packages/db/
COPY apps/server/package.json ./apps/server/

RUN pnpm install --no-frozen-lockfile --prod

COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/apps/server/dist ./apps/server/dist

EXPOSE 3001
CMD ["node", "apps/server/dist/index.js"]
