FROM node:20-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

# Kopiera manifest för cache-effektivitet
COPY package.json pnpm-workspace.yaml ./
COPY packages/db/package.json ./packages/db/
COPY apps/web/package.json ./apps/web/

RUN pnpm install --no-frozen-lockfile

COPY packages/db ./packages/db
COPY apps/web ./apps/web

# Bygg React-appen (PUBLIC_URL behövs inte vid build — det är en runtime-config)
RUN pnpm --filter @portfolinho/web build

# ── Nginx för att serva statiska filer ──────────────────────────────────────
FROM nginx:alpine AS runner
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
