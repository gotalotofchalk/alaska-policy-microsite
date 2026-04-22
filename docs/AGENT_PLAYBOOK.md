# RHT-NAV Agent Playbook

This playbook defines the set of agents that accelerate development and operations of
the RHT-NAV microsite (Alaska, Kentucky, East-Texas pilot, future states) while
enforcing the non-negotiable data-integrity contract in `CLAUDE.md`.

Every agent below is categorized by its runtime model:

- **Cloud Agent** — long-running background agent launched from cursor.com/agents.
- **Bugbot** — per-PR reviewer.
- **Scheduled** — cron-style Cloud Agent.
- **Interactive** — in-IDE subagent invoked on demand.
- **Env Setup** — the onboarding-flow agent that edits the Cloud Agent base image.

All agents must obey the hard rule in `CLAUDE.md`: **never fabricate, estimate, or
round-trip data**. When source data is missing, emit a visible
`Data coming soon — [source, field]` placeholder.

Allowed primary sources include: CMS, US Census Bureau, FCC Broadband Data Collection,
HRSA AHRF, HRSA HPSA, CDC PLACES, ArcGIS Hub, state health departments,
Cecil G. Sheps Center, KFF, and equivalent peer-reviewed or government sources.

---

## Suggested rollout order

1. Env Setup Agent (#24) — unblocks everything else.
2. Source-Citation Auditor (#1) + Data Provenance Schema Agent (#2).
3. Assumption-Set Diff Reviewer (#17).
4. State-Onboarding Agent (#10).
5. One data refresher (#4 or #6) to validate the pattern.
6. Tribal Data Sovereignty Reviewer (#3).
7. v0 Importer (#12) + Accessibility Agent (#14).
8. Everything else in Tier 4–7 as the project broadens.

---

## Tier 1 — Data integrity (enforce `CLAUDE.md`)

### 1. Source-Citation Auditor
- **Type**: Bugbot.
- **Trigger**: Any PR touching `src/data/**`, `src/data/generated/**`,
  `src/components/module-sources.tsx`, any `.mdx`, or any `.tsx`/`.ts` introducing
  numeric literals into JSX or exported constants.
- **Checks**:
  - Every new or changed numeric literal in a data file has an adjacent
    `source`, `sourceUrl`, `vintage`, and `retrievedOn` field (or equivalent
    provenance shape, see #2).
  - Every displayed stat in a component is either routed through the data pack
    with a source entry, or wrapped in a `<DataComingSoon source="…" field="…" />`
    placeholder.
  - No stats originate from an LLM-generated constant. Flags any numeric literal
    added without a commit-linked primary-source URL.
- **Seed prompt**: see `.cursor/rules/data-integrity.mdc`.

### 2. Data Provenance Schema Agent
- **Type**: Cloud Agent (one-shot, then on demand).
- **Scope**: Extend the data pack schema so every field carries
  `{ value, source, sourceUrl, vintage, retrievedOn, methodology }`. Migrate
  `src/data/generated/alaska-data-pack.json`, `kentucky-broadband-data.ts`,
  `kentucky-facilities.ts`, `alaska-assessment.ts`, and peers to the same shape.
  Update `scripts/build_data_pack.py` to emit it, and update
  `src/components/module-sources.tsx` and the `/data-methodology` page to
  consume it.
- **Deliverable**: TypeScript type `ProvenanceField<T>` plus a Python dataclass
  used throughout the ETL.

### 3. Tribal Data Sovereignty / CARE-Principles Reviewer
- **Type**: Bugbot.
- **Scope**: Scoped to `src/app/[state]/tribal-health/**`, any Alaska Native
  regional data, and any HPSA/HRSA/PLACES layer that could identify small
  populations.
- **Checks**:
  - No county- or sub-county counts below standard small-cell suppression
    thresholds (e.g. n < 11 for CDC PLACES-derived layers).
  - Tribal datasets cite tribal health organization or tribal epidemiology
    center approvals where applicable.
  - Public-facing language follows CARE principles (Collective benefit,
    Authority to control, Responsibility, Ethics).

---

## Tier 2 — Data refresh pipeline

All are **Scheduled Cloud Agents** that open a PR. They never merge themselves;
they leave a reviewable diff with a provenance report.

### 4. CMS POS Refresher — quarterly
- Pull latest CMS Provider of Services file, diff against
  `scripts/data-raw/cms-pos-q4-2025.csv`, rebuild facility layers, open PR
  "CMS POS refresh → QX YYYY".
- Entry point: `scripts/agents/refresh_cms_pos.py`.

### 5. HRSA AHRF + HPSA Refresher — AHRF annual, HPSA monthly
- Pulls HRSA AHRF and HPSA designations, regenerates workforce-shortage layers,
  updates `src/app/[state]/capacity/` inputs.
- Entry point: `scripts/agents/refresh_hrsa.py`.

### 6. FCC BDC Refresher — twice yearly (June / December)
- Downloads BDC Fabric + availability files, re-bins to H3 via `h3-js`,
  updates `kentucky-broadband-data.ts` and `kentucky-broadband-availability.ts`,
  regenerates `src/components/connectivity-translator.tsx` inputs.
- Entry point: `scripts/agents/refresh_fcc_bdc.py`.

### 7. CDC PLACES + Census ACS Refresher — annual
- Pulls new vintages, updates county prevalence and population layers, opens
  PR with a vintage-bump changelog.
- Entry point: `scripts/agents/refresh_places_acs.py`.

### 8. ArcGIS Online Feature Service Sync — weekly
- Uses student-tier ArcGIS Online via the ArcGIS API for Python. For each
  registered Feature Service (Alaska DHSS regions, Kentucky DPH layers,
  per-state ArcGIS Hub items), pulls via REST, materializes to
  `src/data/generated/*.geojson`, reprojects to EPSG:4326, and records metadata
  (source URL, item ID, last-edit timestamp).
- Entry point: `scripts/agents/refresh_arcgis.py`.

### 9. Cecil G. Sheps Rural Hospital Closures Watcher — monthly
- Ingests the Sheps Center closure list, flags any closure in a scaffolded
  state (AK, KY, East TX, future), opens an issue or PR touching `capacity/`
  and `stakeholder-reports/`.
- Entry point: `scripts/agents/refresh_sheps_closures.py`.

---

## Tier 3 — Multi-state scaffolding

### 10. State-Onboarding Agent
- **Type**: Cloud Agent, on-demand.
- **Trigger**: Human runs it with `state=NM` (or similar two-letter code).
- **Scope**: Scaffolds the full parallel of the Kentucky setup:
  - `src/app/[state]/...` routes (overview, need, capacity, connectivity,
    benchmarks, implementation-strategy, stakeholder-reports, optional
    tribal-health).
  - `src/data/<state>-config.ts`, `<state>-counties.json`,
    `<state>-pyramid-config.ts`, broadband + facilities skeletons.
  - Seeds counties from Census TIGER.
  - Wires ETL entries in `scripts/build_data_pack.py` but leaves numeric
    fields as `DataComingSoon` placeholders. Refuses to invent values.
  - Opens a draft PR: "Scaffold &lt;State&gt; — empty data pack, placeholders only".

### 11. Rural Health Region Classifier
- Classifies each county with RUCA / FAR / USDA ERS rural-urban continuum codes,
  emits a typed `RuralClassification` layer cited to USDA ERS.

---

## Tier 4 — UI / UX / design

### 12. v0 Design-to-Page Importer
- **Type**: Interactive.
- **Trigger**: Paste a Vercel v0 share URL or a Figma frame.
- **Scope**: Generates the component via v0, then reconciles it with repo
  conventions: replaces ad-hoc Tailwind with existing tokens, swaps stock
  numbers for `DataComingSoon` placeholders or real data-pack fields, adds
  the `module-sources.tsx` attribution block, and respects existing
  `page-hero.tsx` / `pyramid-tabs.tsx` / `state-sidebar.tsx` patterns.

### 13. Claude Design Systems Agent
- Owns design tokens (color ramps, chart palettes, type scale), enforces them
  across `src/components/`, keeps `docs/DESIGN_SYSTEM.md` in sync, reviews any
  new Tailwind class that isn't a token.

### 14. Accessibility / Section 508 / WCAG 2.2 AA Agent
- **Type**: Bugbot + Scheduled (weekly).
- **Scope**: Runs axe-core + Lighthouse + Playwright a11y snapshots on the
  `next build` output. Blocks PRs that regress AA. Weekly scheduled full-site
  sweep against the deployed Vercel preview.

### 15. Map / Leaflet Performance Agent
- Watches bundle size of Leaflet + react-leaflet + H3 payloads. Flags any
  page shipping more than 150 KB of polygon JSON to the client. Suggests
  topojson / vector-tile migrations.

---

## Tier 5 — QA, testing, correctness

### 16. Simulation Invariant Property-Test Author
- Reads `src/lib/simulation.ts` and `tests/simulation-invariants.ts`. Proposes
  additional property-based tests (monotonicity, boundedness, sanity around
  zero-uptake, screening-yield bounds). Opens PRs that strengthen
  `npm run test:simulation`.

### 17. Assumption-Set Diff Reviewer
- **Type**: Bugbot.
- **Trigger**: PR touches `src/data/default-assumptions.json`, `prisma/seed.cjs`,
  or any published assumption row.
- **Scope**: For each changed assumption, posts prior value, new value, delta,
  and cited literature reference. Refuses silent assumption drift.

### 18. Playwright E2E Author
- **Type**: Interactive.
- For any new `src/app/[state]/<route>/page.tsx`, generates a matching spec in
  `tests/` covering: renders, sources block is visible, `Data coming soon`
  text is absent when real data is expected, basic keyboard navigation.

### 19. Pre-Deploy Gatekeeper — nightly against `main`
- Runs `npm run test:all`, `npm run lint`, `npm run typecheck`, `npm run build`,
  plus the a11y sweep. Posts a GitHub issue if red. Independent of per-PR CI
  so drift is caught even on clean PRs.

---

## Tier 6 — Policy content + stakeholder outputs

### 20. Stakeholder Report Compiler
- Reads the data pack + assumption set and generates markdown/MDX for
  `src/app/[state]/stakeholder-reports/` with proper citations. Leaves
  narrative blocks as `<!-- author: -->` TODOs for a human. Never invents
  numbers.

### 21. Methodology Page Generator
- Generates `/data-methodology` directly from the provenance schema (see #2).
  Runs on every data refresh.

### 22. Implementation Playbook Drafter
- For each state, assembles `implementation-strategy/` from region definitions,
  the capacity layer, the connectivity layer, and literature-backed intervention
  templates in `intervention-catalog.ts`. Emits `Data coming soon` placeholders
  wherever a local datum is missing.

### 23. Glossary / Plain-Language Translator
- Scans public-facing copy for jargon ("HPSA", "FQHC", "BDC Fabric", "DME",
  "teleretinal"), adds `<abbr>` tags and a site-wide glossary.

---

## Tier 7 — Dev ops + agent platform hygiene

### 24. Env Setup Agent — run this **first**
- **Type**: Env Setup (cursor.com/onboard).
- **Scope**: Bakes the base image for all future Cloud Agents in this repo:
  - Node 20 + `npm ci`.
  - Python 3.11 + ETL deps (pandas, pyproj, shapely, h3, arcgis, requests).
  - `npx playwright install --with-deps chromium firefox webkit`.
  - `prisma generate` + a cached SQLite database from `npm run setup`.
  - Env-var scaffold for ArcGIS Online OAuth, Census API key, FCC BDC key,
    Vercel deploy hook. These live in Cursor Dashboard → Secrets, not the
    repo.
- **Draft prompt**: `docs/ENV_SETUP_AGENT_PROMPT.md`.

### 25. Secrets Hygiene Bot
- **Type**: Bugbot. Blocks any PR adding a string matching API-key / token
  patterns — especially ArcGIS tokens, Census API keys, FCC BDC keys, and
  Vercel deploy hooks.

### 26. Dependency & Security Updater — scheduled
- Renovate-style. Weekly `npm audit`, monthly `pip` upgrades for the ETL.
  Pins major-version bumps behind a human-reviewed PR. Special-cases Next.js
  majors (currently 16.1.6, a fast-moving surface).

### 27. Changelog / Release Notes Agent
- On each merge, appends to `CHANGELOG.md` grouped as
  `Data vintages / UI / Simulation / Governance`. Tags the Vercel deploy with
  the data-pack hash.

### 28. Vercel Preview Smoke Agent
- **Trigger**: Each Vercel preview deploy.
- Hits the preview URL, walks every `[state]` route, screenshots each, verifies
  no `undefined` / `NaN` renders, posts the screenshot gallery to the PR.

### 29. Cursor Rules / Memory Keeper
- Maintains `.cursor/rules/` entries so every future in-IDE agent inherits:
  the `CLAUDE.md` data rule, the provenance schema contract, the
  state-onboarding contract, the a11y baseline, and the list of allowed
  primary sources. Reviews PRs that modify these rules.

---

## Tool-to-agent map

| Tool you have               | Agents that use it                          |
| --------------------------- | ------------------------------------------- |
| Claude Max                  | #2, #10, #12, #16, #18, #20, #22, #23       |
| Cursor Cloud Agents         | #2, #4–11, #19, #20, #22, #26, #27, #28     |
| Cursor Bugbot               | #1, #3, #14, #17, #25                       |
| Cursor Env Setup            | #24                                         |
| Cursor `.cursor/rules/`     | #29 (plus inherited by every in-IDE agent)  |
| Vercel                      | #14, #28                                    |
| Vercel v0                   | #12                                         |
| Claude Design               | #12, #13                                    |
| ArcGIS Online (student)     | #8, #11                                     |
| GitHub                      | every agent (PRs, issues, templates)        |
