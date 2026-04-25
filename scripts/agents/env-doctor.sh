#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "== RHT-NAV environment doctor =="

echo
echo "Toolchain:"
printf "  Node: "
node --version
printf "  npm: "
npm --version
if command -v pnpm >/dev/null 2>&1; then
  printf "  pnpm: "
  pnpm --version
else
  echo "  pnpm: not installed"
fi
printf "  Python: "
python3 --version

echo
echo "Prisma:"
if [ -d "node_modules/@prisma/client" ]; then
  echo "  @prisma/client: present"
else
  echo "  @prisma/client: missing"
fi

echo
echo "Playwright:"
echo "  browser cache: ${PLAYWRIGHT_BROWSERS_PATH:-$HOME/.cache/ms-playwright}"
if [ -d "${PLAYWRIGHT_BROWSERS_PATH:-$HOME/.cache/ms-playwright}" ]; then
  echo "  browser cache status: present"
else
  echo "  browser cache status: missing"
fi

echo
echo "Python agent dependencies:"
python3 - <<'PY'
from __future__ import annotations

from importlib import metadata
from pathlib import Path

requirements = Path("requirements-agents.txt")
if not requirements.exists():
    raise SystemExit("  requirements-agents.txt: missing")

for raw_line in requirements.read_text().splitlines():
    line = raw_line.strip()
    if not line or line.startswith("#"):
        continue
    package = line.split("==", 1)[0]
    try:
        version = metadata.version(package)
    except metadata.PackageNotFoundError:
        version = "missing"
    print(f"  {package}: {version}")
PY

echo
echo "Secrets:"
for name in \
  ARCGIS_USERNAME \
  ARCGIS_PASSWORD \
  ARCGIS_API_KEY \
  CENSUS_API_KEY \
  FCC_BDC_API_KEY \
  VERCEL_DEPLOY_HOOK_URL \
  DATABASE_URL; do
  if [ -n "${!name:-}" ]; then
    echo "  ${name}: set"
  else
    echo "  ${name}: missing"
  fi
done
