# Environment variables

RHT-NAV uses repository-local configuration for development and Cursor Dashboard
Secrets for keys. Never commit `.env` files or secret values.

## Local development

Copy `.env.example` to `.env` and keep the SQLite default unless you need a
different database path:

- `DATABASE_URL` - Prisma SQLite connection string, for example
  `file:./dev.db`.

## Cursor Cloud Agent secrets

Declare these in Cursor Dashboard -> Cloud Agents -> Secrets. Use non-redacted
or redacted values according to workspace policy, but do not write the values
into the repository.

| Variable | Required for | Notes |
| --- | --- | --- |
| `ARCGIS_USERNAME` | ArcGIS refresh agents | Use with `ARCGIS_PASSWORD` when not using token auth. |
| `ARCGIS_PASSWORD` | ArcGIS refresh agents | Pair with `ARCGIS_USERNAME`; mark redacted. |
| `ARCGIS_API_KEY` | ArcGIS refresh agents | Alternative to username/password; mark redacted. |
| `CENSUS_API_KEY` | Census/ACS refreshers | Used when upstream Census endpoints require a key. |
| `FCC_BDC_API_KEY` | FCC BDC refreshers | Only required for authenticated BDC endpoints. |
| `VERCEL_DEPLOY_HOOK_URL` | Deploy automation | Trigger URL for controlled preview or production deploys. |
| `DATABASE_URL` | Prisma setup/runtime | Already documented in `.env.example`; Cloud Agents can use `file:./dev.db`. |

## Verification

Run `scripts/agents/env-doctor.sh` to confirm tool versions, Prisma client
presence, Playwright browser cache, pinned Python dependencies, and which
expected secrets are non-empty. The doctor prints only `set` or `missing` for
secrets and never prints secret values.
