#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# Portfolinho — Installationsskript
# Kör: bash install.sh
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()    { echo -e "${GREEN}✔${NC}  $*"; }
warn()    { echo -e "${YELLOW}⚠${NC}  $*"; }
section() { echo -e "\n${GREEN}══ $* ══${NC}"; }

section "Portfolinho — Installation"

# ── Krav ────────────────────────────────────────────────────────────────────
section "Kontrollerar krav"

command -v docker >/dev/null 2>&1 || { echo -e "${RED}✗${NC}  Docker saknas. Installera Docker: https://docs.docker.com/get-docker/"; exit 1; }
docker compose version >/dev/null 2>&1 || { echo -e "${RED}✗${NC}  Docker Compose (v2) saknas."; exit 1; }
command -v openssl >/dev/null 2>&1 || { echo -e "${RED}✗${NC}  openssl saknas."; exit 1; }

info "Docker OK"
info "Docker Compose OK"
info "openssl OK"

# ── Miljövariabler ───────────────────────────────────────────────────────────
section "Miljövariabler"

if [ -f ".env" ]; then
    warn ".env finns redan — hoppar över skapande (tar bort och kör om för ny installation)"
else
    cp .env.example .env
    info "Skapade .env från .env.example"

    # Generera BETTER_AUTH_SECRET
    SECRET=$(openssl rand -hex 32)
    sed -i "s|^BETTER_AUTH_SECRET=.*|BETTER_AUTH_SECRET=${SECRET}|" .env
    info "Genererade BETTER_AUTH_SECRET"

    # Generera RSA-nyckelpar för LTI 1.3
    TMPKEY=$(mktemp)
    openssl genrsa -out "${TMPKEY}" 2048 2>/dev/null
    PRIVATE_KEY=$(awk 'NF {sub(/\r/, ""); printf "%s\\n", $0}' "${TMPKEY}")
    rm -f "${TMPKEY}"
    sed -i "s|^LTI_PRIVATE_KEY=.*|LTI_PRIVATE_KEY=${PRIVATE_KEY}|" .env
    sed -i "s|^LTI_KEY_ID=.*|LTI_KEY_ID=portfolinho-$(hostname)-$(date +%Y)|" .env
    info "Genererade RSA-nyckelpar för LTI 1.3"
fi

# ── PUBLIC_URL ───────────────────────────────────────────────────────────────
source .env
if [ "${PUBLIC_URL}" = "https://portfolinho.ditt-larosate.se" ] || [ -z "${PUBLIC_URL}" ]; then
    echo ""
    warn "PUBLIC_URL är inte satt. Vilken URL ska Portfolinho nås på?"
    warn "Exempel: https://portfolinho.hv.se  eller  http://localhost:3000"
    read -rp "  PUBLIC_URL: " INPUT_URL
    if [ -n "${INPUT_URL}" ]; then
        sed -i "s|^PUBLIC_URL=.*|PUBLIC_URL=${INPUT_URL}|" .env
        info "Satte PUBLIC_URL=${INPUT_URL}"
    else
        warn "Behåller standardvärde — ändra PUBLIC_URL i .env innan du registrerar i Canvas"
    fi
fi

# ── Bygg och starta ──────────────────────────────────────────────────────────
section "Bygger och startar Portfolinho"
docker compose build --quiet
info "Bygge klart"

docker compose up -d
info "Tjänster startade"

# ── Verifiera ────────────────────────────────────────────────────────────────
section "Verifierar"
echo "Väntar på att server ska bli healthy..."
for i in $(seq 1 30); do
    if docker compose exec -T server wget --quiet --tries=1 --spider http://localhost:3001/health 2>/dev/null; then
        info "Server svarar på /health"
        break
    fi
    if [ "$i" -eq 30 ]; then
        warn "Server svarar inte efter 30 försök — kör 'docker compose logs server' för felsökning"
    fi
    sleep 2
done

# ── Nästa steg ───────────────────────────────────────────────────────────────
source .env
section "Installation klar"
cat <<EOF

  Portfolinho körs på: ${PUBLIC_URL:-http://localhost:${PORT:-3000}}

  Nästa steg:
  ┌─────────────────────────────────────────────────────────────────────┐
  │ 1. Registrera Portfolinho i Canvas som LTI 1.3 Developer Key        │
  │    → Se INSTALL.md, avsnitt "Canvas-konfiguration"                  │
  │                                                                     │
  │ 2. Fyll i CANVAS_ISSUER, CANVAS_CLIENT_ID, CANVAS_CLIENT_SECRET     │
  │    i .env och starta om: docker compose restart server              │
  │                                                                     │
  │ 3. Lägg till verktyget i en Canvas-kurs och testa LTI-launch        │
  └─────────────────────────────────────────────────────────────────────┘

  Hantering:
    Stoppa:     docker compose stop
    Starta om:  docker compose up -d
    Loggar:     docker compose logs -f
    Uppdatera:  git pull && docker compose build && docker compose up -d

EOF
