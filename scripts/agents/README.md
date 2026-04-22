# `scripts/agents/`

Entry points for the **Scheduled Cloud Agents** defined in
[`docs/AGENT_PLAYBOOK.md`](../../docs/AGENT_PLAYBOOK.md).

Each script is intended to be launched by a Cursor Cloud Agent on a cadence.
None of them merges their own PR — every run opens a draft PR for a human to
review.

| Script | Agent # | Cadence | Primary source |
| ------ | ------- | ------- | -------------- |
| `refresh_cms_pos.py` | 4 | Quarterly | CMS Provider of Services |
| `refresh_hrsa.py` | 5 | AHRF annual / HPSA monthly | HRSA AHRF + HPSA |
| `refresh_fcc_bdc.py` | 6 | Twice yearly (Jun / Dec) | FCC BDC |
| `refresh_places_acs.py` | 7 | Annual | CDC PLACES + Census ACS |
| `refresh_arcgis.py` | 8 | Weekly | ArcGIS Online feature services |
| `refresh_sheps_closures.py` | 9 | Monthly | Cecil G. Sheps Center |

## Hard constraint

These agents MUST follow `CLAUDE.md` and `.cursor/rules/data-integrity.mdc`:

- Fetch from the declared primary source URL or fail loudly.
- Never synthesize missing values. When a field is not present in the upstream
  release, emit it as `{ value: null, source, sourceUrl, vintage, retrievedOn }`
  so the UI renders `<DataComingSoon />`.
- Every emitted field carries full provenance (see
  `.cursor/rules/provenance-schema.mdc`).
- The PR body must include the full list of source URLs fetched, the vintages
  returned, and the field-level diff.

## Local dry-run

Each script supports `--dry-run` (writes nothing) and `--state <CODE>` (scopes
to a single state). The actual implementation bodies are left as `TODO` in each
script and will be populated per agent once the Env Setup Agent bakes the
Python dependency set into the Cloud Agent base image.
