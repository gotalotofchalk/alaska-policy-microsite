#!/usr/bin/env python3
"""Agent #7 — CDC PLACES + US Census ACS refresher.

Cadence: annual for both (PLACES annual release; ACS 5-year annual release).
Sources:
  - CDC PLACES: https://www.cdc.gov/places/
  - US Census ACS: https://www.census.gov/programs-surveys/acs

Contract: see docs/AGENT_PLAYBOOK.md and .cursor/rules/data-integrity.mdc.

Notes:
  - Apply CDC PLACES small-cell suppression (n < 11) before emitting any
    sub-county count. Tribal-health layers get additional review by Bugbot #3.
  - Emit ProvenanceField entries. If PLACES suppresses a measure for a county,
    emit value=None with the suppression reason in `methodology`.
"""

from __future__ import annotations

from _base import build_argparser, now_iso  # noqa: F401


def main() -> int:
    parser = build_argparser(description=__doc__)
    args = parser.parse_args()
    print("CDC PLACES + Census ACS refresher stub")
    print(f"  dry-run: {args.dry_run}")
    print(f"  state:   {args.state or 'ALL'}")
    print(f"  started: {now_iso()}")
    print(
        "TODO: pull latest PLACES + ACS vintages, respect small-cell "
        "suppression, emit ProvenanceField entries, open a draft PR."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
