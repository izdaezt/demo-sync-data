# demo-sync-data

- `app/` — React (Ant Design) UI + Node.js/TypeScript API in one source
- `database/` — SQL scripts (run in filename order)
- `job/` — Python sync job (to be added)

## Run (dev, hot reload)

```bash
cp .env.sample .env        # fill in DATABASE_URL
docker compose up --build
docker compose exec app npm run db:init   # create tables, sample data, admin user (first time)
```

- UI: http://localhost:5173 (login with `ADMIN_USERNAME` / `ADMIN_PASSWORD` from `.env`)
- API: http://localhost:3000/api

## Production build

`docker compose -f docker-compose.prod.yml up --build` — one image serves API + built UI on :3000.
Without Docker: `cd app && npm run build` → `dist/` (`dist/client` + `dist/server`), run with `npm start`.

## Deploy to Vercel

1. Import the repo in Vercel and set **Root Directory** to `app`.
2. Add env vars: `DATABASE_URL`, `DATABASE_SSL=true`, `JWT_SECRET`, `JWT_EXPIRES_IN`.
3. Deploy. UI is served as static (`dist/client`), `/api/*` runs as a function from `api/index.ts`.
4. Run `npm run db:init` once locally (with `.env` pointing at the same DB) to create tables and the admin user.
