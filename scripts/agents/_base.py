"""Shared helpers for RHT-NAV scheduled-refresh agents.

Every refresher script in this directory follows the same contract:

- Parse `--dry-run` and `--state <CODE>` flags.
- Fetch from the declared primary-source URL or fail loudly.
- Emit every field as a ProvenanceField with {value, source, sourceUrl,
  vintage, retrievedOn}. Never synthesize missing values.
- Print a human-readable summary suitable for copying into a PR body.

This module is intentionally dependency-light: it does not import pandas or
arcgis at module load, so the top-level scripts can be introspected even when
the Cloud Agent base image is not yet provisioned.

See docs/AGENT_PLAYBOOK.md and .cursor/rules/data-integrity.mdc.
"""

from __future__ import annotations

import argparse
import dataclasses
import datetime as _dt
import json
import sys
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = REPO_ROOT / "src" / "data"
GENERATED_DIR = DATA_DIR / "generated"
RAW_DIR = REPO_ROOT / "scripts" / "data-raw"


@dataclasses.dataclass(frozen=True)
class ProvenanceField:
    """Canonical shape used throughout RHT-NAV data packs.

    The `value` may be `None` when the upstream release did not provide the
    field for this state/county. In that case the UI renders
    `<DataComingSoon source={source} field={name} />`. Never fill a missing
    value with a guess — that violates CLAUDE.md.
    """

    value: Any
    source: str
    source_url: str
    vintage: str | None
    retrieved_on: str
    methodology: str | None = None

    def to_json(self) -> dict[str, Any]:
        return {
            "value": self.value,
            "source": self.source,
            "sourceUrl": self.source_url,
            "vintage": self.vintage,
            "retrievedOn": self.retrieved_on,
            "methodology": self.methodology,
        }


def now_iso() -> str:
    return _dt.datetime.now(_dt.timezone.utc).isoformat(timespec="seconds")


def build_argparser(description: str) -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=description)
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Fetch and diff but do not write any files.",
    )
    parser.add_argument(
        "--state",
        default=None,
        help="Two-letter USPS state code to scope to (e.g. KY, AK).",
    )
    return parser


def write_json(path: Path, payload: dict[str, Any], *, dry_run: bool) -> None:
    if dry_run:
        print(f"[dry-run] would write {path}")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n")
    print(f"wrote {path}")


def refuse_fabrication(field_name: str) -> None:
    """Call this from a refresher when an upstream field is missing.

    Prints a clear error and exits non-zero. DO NOT call a fallback that
    guesses the value — that is prohibited by CLAUDE.md.
    """

    print(
        f"[data-integrity] missing upstream value for '{field_name}'. "
        "Emitting ProvenanceField(value=None, ...) and exiting 0 so the UI "
        "renders <DataComingSoon/>. This is the only acceptable behavior.",
        file=sys.stderr,
    )
