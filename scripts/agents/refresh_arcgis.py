#!/usr/bin/env python3
"""Agent #8 — ArcGIS Online Feature Service sync.

Cadence: weekly.
Sources: registered ArcGIS Feature Services (Alaska DHSS regions, Kentucky DPH
layers, state-specific ArcGIS Hub items). Uses ArcGIS API for Python with the
student-tier ArcGIS Online credentials provided via Cursor Dashboard -> Secrets
(env vars: ARCGIS_USERNAME, ARCGIS_PASSWORD or ARCGIS_API_KEY).

Contract: see docs/AGENT_PLAYBOOK.md and .cursor/rules/data-integrity.mdc.

Outputs:
  - src/data/generated/*.geojson (reprojected to EPSG:4326)
  - Per-layer provenance metadata emitted alongside each GeoJSON file.

Never commit secrets. Secrets Hygiene Bot (#25) will block any PR that does.
"""

from __future__ import annotations

from _base import build_argparser, now_iso  # noqa: F401


def main() -> int:
    parser = build_argparser(description=__doc__)
    args = parser.parse_args()
    print("ArcGIS feature service sync stub")
    print(f"  dry-run: {args.dry_run}")
    print(f"  state:   {args.state or 'ALL'}")
    print(f"  started: {now_iso()}")
    print(
        "TODO: authenticate via env vars, iterate registered items, pull via "
        "REST, reproject to EPSG:4326, emit ProvenanceField-wrapped GeoJSON, "
        "open a draft PR."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
