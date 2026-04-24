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
WORKDIR /app

# node_modules på alla nivåer — pnpm workspace-symlinks kräver detta
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=builder /app/packages/db/node_modules ./packages/db/node_modules

COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/apps/server/dist ./apps/server/dist

COPY package.json pnpm-workspace.yaml ./
COPY packages/db/package.json ./packages/db/
COPY apps/server/package.json ./apps/server/

EXPOSE 3001
CMD ["node", "apps/server/dist/index.js"]
