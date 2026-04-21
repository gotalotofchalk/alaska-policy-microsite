# Env Setup Agent — seed prompt

Paste this prompt into the onboarding flow at
[cursor.com/onboard](https://cursor.com/onboard). The resulting Env Setup
Agent will modify the Cloud Agent base image and startup script so every
future agent in this repo starts from a fully-provisioned VM.

---

## Prompt

> You are setting up the Cloud Agent base image for the **RHT-NAV** repo
> (`alaska-policy-microsite` / `rht-nav`). Read `README.md`, `CLAUDE.md`,
> `package.json`, `prisma/schema.prisma`, and `docs/AGENT_PLAYBOOK.md` before
> modifying anything.
>
> The base image must support both the Next.js app and the Python ETL. Please
> bake in the following so downstream agents do not repeat this work:
>
> 1. **Node toolchain**
>    - Node 20 LTS.
>    - Run `npm ci` at image build time to pre-warm `node_modules`.
>    - Run `npx prisma generate`.
>    - Run `npx playwright install --with-deps chromium firefox webkit` so
>      `npm run test:e2e` works out of the box.
>
> 2. **Python toolchain**
>    - Python 3.11.
>    - `pip install` the ETL dependencies used by `scripts/build_data_pack.py`
>      and the refreshers in `scripts/agents/` (pandas, numpy, pyproj, shapely,
>      h3, requests, arcgis, python-dotenv, geopandas). Pin to the latest
>      compatible versions and record them in a `requirements-agents.txt`
>      file at the repo root.
>
> 3. **Database scaffold**
>    - Run `npm run setup` (which runs `data:build`, `db:push`, and `db:seed`)
>      during image build, so the SQLite file and seeded assumption sets are
>      already present.
>
> 4. **Secrets scaffold (do NOT hardcode values)**
>    - Document the following expected env vars in
>      `docs/ENV_VARS.md` and confirm they are declared in Cursor Dashboard
>      -> Secrets:
>        - `ARCGIS_USERNAME`, `ARCGIS_PASSWORD` or `ARCGIS_API_KEY`
>        - `CENSUS_API_KEY`
>        - `FCC_BDC_API_KEY` (if using authenticated BDC endpoints)
>        - `VERCEL_DEPLOY_HOOK_URL`
>        - Prisma `DATABASE_URL` (already in `.env.example`)
>    - Do not put any secret values in the repo.
>
> 5. **Startup script**
>    - On every new VM, run `npm ci`, `prisma generate`, and print the
>      versions of Node, Python, pnpm/npm, and the pinned Python deps.
>
> 6. **Observability**
>    - Add a short `scripts/agents/env-doctor.sh` that prints everything an
>      agent needs to verify its environment (node/python versions, Playwright
>      browser cache path, Prisma client presence, which secrets are set to
>      non-empty values — never print the secret values themselves).
>
> **Hard constraints** (from `CLAUDE.md`, non-negotiable):
>
> - Do not add any dataset, number, or scraped content to the base image.
> - Do not commit secrets or `.env` files.
> - Do not invent version numbers; use the latest stable releases at the time
>   of image build and record them in lockfiles.
>
> When finished, open a PR titled `chore(env): bake RHT-NAV Cloud Agent base
> image` that includes `requirements-agents.txt`, `docs/ENV_VARS.md`, and any
> `.cursor/environment.json` or equivalent config updates. Do not merge; leave
> the PR in draft for human review.

---

## Why this matters

Every other agent in `docs/AGENT_PLAYBOOK.md` benefits:

- The Bugbot agents (#1, #3, #14, #17, #25) need Node + Playwright pre-warmed.
- The Scheduled agents (#4–9, #26, #27, #28) need Python + arcgis + h3 + the
  Census/FCC keys pre-injected.
- The State-Onboarding Agent (#10) needs `npm run setup` to be a one-liner.

Running this Env Setup Agent once turns every downstream agent invocation
from "spend 3 minutes installing deps" into "start working immediately".
