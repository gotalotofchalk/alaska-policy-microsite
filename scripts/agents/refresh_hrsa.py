#!/usr/bin/env python3
"""Agent #5 — HRSA AHRF + HPSA refresher.

Cadence: AHRF annual, HPSA monthly.
Sources:
  - HRSA Area Health Resource File (AHRF): https://data.hrsa.gov/topics/health-workforce/ahrf
  - HRSA Health Professional Shortage Areas (HPSA):
      https://data.hrsa.gov/data/download

Contract: see docs/AGENT_PLAYBOOK.md and .cursor/rules/data-integrity.mdc.
"""

from __future__ import annotations

from _base import build_argparser, now_iso  # noqa: F401


def main() -> int:
    parser = build_argparser(description=__doc__)
    args = parser.parse_args()
    print("HRSA AHRF + HPSA refresher stub")
    print(f"  dry-run: {args.dry_run}")
    print(f"  state:   {args.state or 'ALL'}")
    print(f"  started: {now_iso()}")
    print(
        "TODO: pull latest AHRF and HPSA releases, update workforce-shortage "
        "layers for each scaffolded state, emit ProvenanceField entries, open "
        "a draft PR. Never synthesize missing values."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
