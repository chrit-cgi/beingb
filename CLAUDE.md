# beingb

## Decisions & constraints
- Mobile-first. No hover-only interactions. Min tap target 44px. Use `dvh` not `vh`.
- PWA enabled via `@ducanh2912/next-pwa` — configured in `next.config.ts`
- SQLite for local dev. Swap to Postgres by changing `lib/db.ts` driver + `DATABASE_URL` only.
- Drizzle ORM — schema in `db/schema.ts`, never write raw SQL elsewhere in the codebase.
- Next.js App Router, TypeScript strict mode.

## Auth
- NextAuth.js v5 (next-auth@5), credentials provider + JWT session strategy
- Seed user: lucy@lucy.eu / changeme123, role: admin
- Run `npm run db:seed` to create seed user after first migration
- Route protection in `proxy.ts` (Next.js 16 replaced `middleware.ts` with `proxy.ts`)
- `trustHost: true` set in `lib/auth.ts` for sliplane.io deployment

## Modularity rules
- API routes must be thin: validate input → call service → return JSON. No logic in routes.
- All DB access via `lib/repo/` only. Never import `lib/db.ts` outside of repo files.
- Business logic in `lib/services/`. Analysis tasks go in `lib/services/analysis/`.
- UI components in `app/(ui)/components/`. View variants (text/table/chart) are separate files.

## Dev setup
- `npm run dev` — starts on localhost:3000
- `npm run db:generate && npm run db:migrate` — generate + apply migrations
- `npm run db:seed` — create lucy@lucy.eu seed user
- `.env.local` — copy from `.env.example`

## Deployment
- Dockerfile in root, targets sliplane.io
- Required env vars: `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_URL`
- GitHub main → Sliplane auto-deploy
- SQLite db file persisted via Docker volume `/data`
