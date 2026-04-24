# Portfolinho

LTI 1.3 portfolio-verktyg för Canvas LMS. Studenter bygger portfolios genom att samla artefakter i Moment — musikfiler, dokument, reflektioner, bilder — som tillsammans utgör kunskapsuttryck. Lärare designar mallar, kopplar lärandemål och bedömer portfolion i sin helhet mot Canvas-rubriken. Versionshantering på Moment-nivå möjliggör formativt lärande och autenticitet i AI-eran.

## Arkitektur

Monorepo med pnpm workspaces:

```
apps/web        React + Vite + TypeScript + shadcn/ui   (port 5173)
apps/server     Hono API + LTI 1.3 + Better Auth        (port 3001)
packages/db     Drizzle ORM + PostgreSQL-schema
```

## Datamodell (kärna)

```
Portfolio
  └── Moment[]
        └── MomentVersion[]   ← snapshot/kunskapsuttryck
              └── Artefakter[] ← media, dokument, RTF, länk
        ├── Bedömning: self / peer (anon) / teacher (final)
        └── Koppling → Canvas lärandemål + rubrikkriterier
```

## Kom igång

### Krav
- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Docker Desktop (för PostgreSQL)

### Starta

```bash
# 1. Starta databasen
docker-compose up -d

# 2. Installera beroenden
pnpm install

# 3. Skapa tabeller
pnpm db:migrate

# 4. Miljövariabler (kopiera och fyll i)
cp apps/server/.env.example apps/server/.env

# 5. Starta allt
pnpm dev
```

Öppna http://localhost:5173 — du ser Portfolinho-startsidan med tre POC-vyer.

### Databasverktyg

```bash
pnpm db:studio    # Drizzle Studio — grafisk databasvy i browsern
pnpm db:generate  # Generera migration efter schemaändring
pnpm db:migrate   # Kör migrationer mot PostgreSQL
```

## Miljövariabler

`apps/server/.env`:
```
DATABASE_URL=postgresql://portfolinho:portfolinho@localhost:5432/portfolinho
PORT=3001
WEB_URL=http://localhost:5173

# Canvas LTI 1.3 (fylls i vid Canvas-installation)
LTI_KEY_ID=
LTI_PRIVATE_KEY=
CANVAS_ISSUER=

# Canvas REST API (OAuth2, för lärandemål + rubriksynk)
CANVAS_CLIENT_ID=
CANVAS_CLIENT_SECRET=

# Better Auth
BETTER_AUTH_SECRET=byt-ut-detta-till-en-lång-slumpmässig-sträng
```

## Nuläge och vad som återstår

### Klart
- [x] Monorepo-struktur (web, server, db)
- [x] Komplett Drizzle-schema (alla tabeller)
- [x] Hono-server med route-stubs för alla endpoints
- [x] LTI 1.3 route-stubs (login, launch, jwks)
- [x] POC-vyer: malldesign, studentvy, bedömningsvy
- [x] Docker Compose för PostgreSQL + MinIO

### Nästa steg (prioritetsordning)
1. **Autentisering** — Better Auth konfigureras i `apps/server/src/auth.ts`, session-hook i web
2. **LTI 1.3** — ltijs kopplas in i `apps/server/src/routes/lti.ts`
3. **Portfolio CRUD** — fyll ut `apps/server/src/routes/portfolios.ts` + `moments.ts`
4. **Artefakt-uppladdning** — filhantering i `apps/server/src/routes/artefakter.ts`
5. **Bedömningsvy** — koppla mot riktig data istället för mock
6. **Canvas-synk** — lärandemål + rubrik i `apps/server/src/routes/canvas.ts`
7. **Publicering** — synlighetskontroll + delningslänkar

## Nyckelkoncept att känna till

**Moment** är en sammanhållen pedagogisk enhet — ett "kunskapsuttryck". Det är inte bara en samling filer; det är kombinationen av artefakter (t.ex. musikfil + reflektion + produktionsbilder) som tillsammans visar vad studenten kan vid ett specifikt tillfälle.

**MomentVersion** är en snapshot av hela Momentet. Varje gång studenten gör en ny version frysas alla artefakter — oförändrade artefakter länkas till föregående version utan duplicering (git-modellen). Studenten skapar ny version medvetet med en notering om vad som ändrades.

**Bedömning i tre lager** — self, peer (anonymiserat), teacher — syns parallellt i bedömningsvyn. Läraren sätter slutlig markering som låser matrisen och synkas till Canvas via LTI AGS.

**Publiceringsgrindar** (formative_gate / summative_gate) — läraren styr när studenten får publicera. Under formativa processen är allt låst; efter slutinlämning eller lärarens godkännande öppnas publiceringen.

## Relevanta standarder

- **LEAP2A** — primärt exportformat (Atom-baserad portfolio-standard, används av Mahara)
- **Open Badges 3.0** — verifierbara credentials per Moment/Portfolio
- **LTI 1.3 + AGS** — Canvas-integration och betygsåterrapportering
- **Canvas Outcomes API** — synk av lärandemål (kräver OAuth2 Developer Key)
