# mflow-frontend

Web UI for [mflow](../mflow), a personal cash flow tracker. Built with React 19, TypeScript, Vite, [react-admin](https://marmelab.com/react-admin/) and MUI.

## Setup

```sh
npm install
```

## Configuration

The backend URL comes from `VITE_API_URL`, read from the env files at the project root:

| File | Used by |
|---|---|
| `.env` | `npm run dev`, `npm run build` |
| `.env.staging` | `npm run build:staging` |

For local development point it at the backend, e.g. `VITE_API_URL=http://localhost:5001/api`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run build:staging` | Build using `.env.staging` |
| `npm run serve` | Preview the built output |
| `npm run type-check` | `tsc --noEmit` |
| `npm run lint` | ESLint with autofix |
| `npm run format` | Prettier |

## Structure

```
src/
  App.tsx, index.tsx     # app shell and react-admin resource registration
  authProvider.ts        # JWT login against the backend
  httpClient.tsx         # fetch wrapper that adds the Bearer token
  <resource>.tsx         # one file per resource (accounts, bonds, payables, recurrents, ...)
  dashboards/            # charts, e.g. the future timeline
  layout/, lib/          # layout components and helpers
```

The data provider is [ra-data-json-server](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-json-server), so backend list endpoints must follow the json-server query conventions (`_start`, `_end`, `_sort`, `_order`).

## Deploy

`deploy.sh` builds in staging mode and rsyncs `dist/` to the staging web host. Check the target before running it. A `Dockerfile` is also provided for containerized hosting.
