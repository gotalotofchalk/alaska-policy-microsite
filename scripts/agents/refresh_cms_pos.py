#!/usr/bin/env python3
"""Agent #4 — CMS Provider of Services refresher (quarterly).

Cadence: quarterly. Source: CMS Provider of Services (POS) public file.
Contract: see docs/AGENT_PLAYBOOK.md and .cursor/rules/data-integrity.mdc.

This script is a stub. Implementation is intentionally deferred until the Env
Setup Agent (#24) bakes the Python dependency set into the Cloud Agent base
image. The stub documents the required inputs, outputs, and invariants so the
downstream implementer cannot accidentally drift from the contract.
"""

from __future__ import annotations

from _base import build_argparser, now_iso  # noqa: F401

CMS_POS_LANDING_URL = "https://data.cms.gov/provider-characteristics"

INVARIANTS = """
Required invariants for this agent:

- Fetch the latest quarterly CMS POS release from an official CMS URL only.
- Diff the pulled file against scripts/data-raw/cms-pos-q4-2025.csv and any
  later vintage already committed.
- Emit facility-level records as ProvenanceField entries with:
    source = "CMS Provider of Services"
    sourceUrl = the specific CMS release URL (not the landing page)
    vintage = "YYYY-QX"
    retrievedOn = ISO8601 UTC now
- Never synthesize missing attributes. If a facility field is absent upstream,
  emit value=None.
- Open a draft PR titled "CMS POS refresh -> QX YYYY" with the per-state
  facility delta as the PR body.
"""


def main() -> int:
    parser = build_argparser(description=__doc__)
    args = parser.parse_args()
    print("CMS POS refresher stub")
    print(f"  dry-run: {args.dry_run}")
    print(f"  state:   {args.state or 'ALL'}")
    print(f"  started: {now_iso()}")
    print(INVARIANTS)
    print("TODO: implement fetch + diff + provenance emit.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
