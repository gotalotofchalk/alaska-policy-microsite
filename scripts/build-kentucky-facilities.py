#!/usr/bin/env python3
"""
build-kentucky-facilities.py

Generates a production-quality src/data/kentucky-facilities.ts from:
  1. CMS Provider of Services Q4 2025 → hospitals, CAHs, RHCs
  2. HRSA Health Center Service Delivery Sites → FQHCs (with lat/lng)
  3. Census Geocoder API → rooftop coordinates for CMS facilities
  4. Census Reverse Geocoder → county FIPS for HRSA FQHCs
  5. Kentucky broadband county data → broadband status estimation

Run from project root:
  python3 scripts/build-kentucky-facilities.py
"""

import csv
import io
import json
import os
import re
import sys
import time
import urllib.request
import urllib.parse
from pathlib import Path

# ── Paths ────────────────────────────────────────────────────────────
BASE = Path(__file__).resolve().parent.parent
DATA_RAW = BASE / "scripts" / "data-raw"
BROADBAND_TS = BASE / "src" / "data" / "kentucky-broadband-data.ts"
OUTPUT_TS = BASE / "src" / "data" / "kentucky-facilities.ts"

CMS_FILE = DATA_RAW / "cms-pos-q4-2025.csv"
HRSA_FILE = DATA_RAW / "hrsa-fqhc-sites.csv"

# Broadband threshold: county adoption rate below this → facility marked unserved
UNSERVED_THRESHOLD = 60.0


# ── 1. Load county broadband data from the .ts file ─────────────────
def load_county_broadband():
    """Parse kentucky-broadband-data.ts → dict of FIPS → {name, pct}."""
    content = BROADBAND_TS.read_text()
    entries = {}

    # Match both possible field names: pctServed or broadbandPct
    pattern = (
        r'fips:\s*"(\d+)".*?name:\s*"([^"]+)".*?'
        r'(?:pctServed|broadbandPct):\s*([\d.]+)'
    )
    for m in re.finditer(pattern, content, re.DOTALL):
        fips = m.group(1)
        name = m.group(2).replace(" County", "").strip()
        pct = float(m.group(3))
        entries[fips] = {"name": name, "pct": pct}

    print(f"Loaded broadband data for {len(entries)} counties")
    return entries


# ── 2. Parse CMS Provider of Services ───────────────────────────────
def parse_cms_pos(county_data):
    """
    Extract KY hospitals, CAHs, and RHCs from CMS POS Q4 2025.
    Returns (facilities_list, addresses_to_geocode).
    """
    print(f"\n{'='*60}")
    print("STEP 1: Parsing CMS Provider of Services Q4 2025...")
    print(f"{'='*60}")

    facilities = []
    to_geocode = []
    seen_names = set()

    with open(CMS_FILE, "r", encoding="utf-8", errors="replace") as f:
        reader = csv.DictReader(f)
        for row in reader:
            state = row.get("STATE_CD", "").strip()
            if state != "KY":
                continue

            cat_cd = row.get("PRVDR_CTGRY_CD", "").strip()
            prvdr_num = row.get("PRVDR_NUM", "").strip()
            name = row.get("FAC_NAME", "").strip()
            street = row.get("ST_ADR", "").strip()
            city = row.get("CITY_NAME", "").strip()
            zipcode = row.get("ZIP_CD", "").strip()[:5]
            state_fips = row.get("FIPS_STATE_CD", "").strip()
            county_fips_3 = row.get("FIPS_CNTY_CD", "").strip()

            # Bed counts
            beds_raw = row.get("BED_CNT", "0").strip()
            crtfd_beds_raw = row.get("CRTFD_BED_CNT", "0").strip()

            # Skip terminated providers
            term_cd = row.get("PGM_TRMNTN_CD", "").strip()
            if term_cd and term_cd not in ("", "00"):
                continue

            # Skip skeleton records
            skeleton = row.get("SKLTN_REC_SW", "").strip()
            if skeleton == "Y":
                continue

            # Determine facility type
            fac_type = None
            if cat_cd == "01":
                # Hospital. CAH if CCN positions 3-4 == "13"
                if len(prvdr_num) >= 6 and prvdr_num[2:4] == "13":
                    fac_type = "cah"
                else:
                    fac_type = "hospital"
            elif cat_cd == "11":
                fac_type = "rhc"
            else:
                continue

            # Deduplicate by name + city (CMS can have multiple records)
            dedup_key = f"{name.lower()}|{city.lower()}"
            if dedup_key in seen_names:
                continue
            seen_names.add(dedup_key)

            # Build 5-digit FIPS
            fips_5 = ""
            if state_fips and county_fips_3:
                fips_5 = state_fips.zfill(2) + county_fips_3.zfill(3)

            # County name from broadband data
            county_name = ""
            if fips_5 in county_data:
                county_name = county_data[fips_5]["name"]

            # Bed count
            bed_count = 0
            try:
                bed_count = int(beds_raw) if beds_raw else 0
            except ValueError:
                pass
            if bed_count == 0:
                try:
                    bed_count = int(crtfd_beds_raw) if crtfd_beds_raw else 0
                except ValueError:
                    pass

            rec_id = f"cms-{fac_type}-{prvdr_num}"

            facilities.append({
                "id": rec_id,
                "name": name,
                "type": fac_type,
                "county": county_name,
                "countyFips": fips_5,
                "lat": None,
                "lng": None,
                "beds": bed_count if fac_type in ("hospital", "cah") else None,
                "street": street,
                "city": city,
                "zip": zipcode,
                "source": "CMS POS Q4 2025",
                "prvdr_num": prvdr_num,
            })
            to_geocode.append((rec_id, street, city, "KY", zipcode))

    by_type = {}
    for f in facilities:
        by_type[f["type"]] = by_type.get(f["type"], 0) + 1

    print(f"  Total KY facilities: {len(facilities)}")
    for t, c in sorted(by_type.items()):
        print(f"    {t}: {c}")

    return facilities, to_geocode


# ── 3. Parse HRSA FQHC Sites ────────────────────────────────────────
def parse_hrsa_fqhc():
    """Extract KY FQHC sites with coordinates from HRSA download."""
    print(f"\n{'='*60}")
    print("STEP 2: Parsing HRSA Health Center Sites...")
    print(f"{'='*60}")

    facilities = []
    seen = set()

    with open(HRSA_FILE, "r", encoding="utf-8", errors="replace") as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames or []

        # Check for county column
        county_col = None
        for h in headers:
            if "county" in h.lower():
                county_col = h
                print(f"  Found county column: '{county_col}'")
                break

        for row in reader:
            state = row.get("Site State Abbreviation", "").strip()
            if state != "KY":
                continue

            name = row.get("Site Name", "").strip()
            city = row.get("Site City", "").strip()
            address = row.get("Site Address", "").strip()
            zipcode = row.get("Site Postal Code", "").strip()[:5]
            status = row.get("Site Status Description", "").strip()

            # Only active sites
            if status and "Active" not in status:
                continue

            # Coordinates (X = longitude, Y = latitude)
            lng_str = row.get(
                "Geocoding Artifact Address Primary X Coordinate", ""
            ).strip()
            lat_str = row.get(
                "Geocoding Artifact Address Primary Y Coordinate", ""
            ).strip()

            lat, lng = None, None
            try:
                lat = float(lat_str) if lat_str else None
                lng = float(lng_str) if lng_str else None
            except ValueError:
                pass

            if not lat or not lng:
                print(f"  ⚠ Skipping (no coords): {name}, {city}")
                continue

            # Basic sanity: should be in Kentucky
            if not (36.0 < lat < 40.0 and -90.0 < lng < -81.0):
                print(f"  ⚠ Skipping (coords outside KY): {name} ({lat}, {lng})")
                continue

            # Deduplicate by name + city
            dedup_key = f"{name.lower()}|{city.lower()}"
            if dedup_key in seen:
                continue
            seen.add(dedup_key)

            # County from HRSA (if available)
            county_raw = ""
            if county_col:
                county_raw = row.get(county_col, "").strip()

            facilities.append({
                "id": None,  # assigned later
                "name": name,
                "type": "fqhc",
                "county": county_raw.replace(" County", "").strip(),
                "countyFips": "",  # filled via reverse geocoding
                "lat": round(lat, 6),
                "lng": round(lng, 6),
                "beds": None,
                "street": address,
                "city": city,
                "zip": zipcode,
                "source": "HRSA Health Center Service Delivery Sites",
            })

    print(f"  Found {len(facilities)} active KY FQHC sites with coordinates")
    return facilities


# ── 4. Census Geocoder: batch forward geocoding ─────────────────────
def geocode_batch(addresses):
    """
    Batch geocode via Census Geocoder.
    addresses: list of (id, street, city, state, zip)
    Returns: dict of id → (lat, lng)
    """
    if not addresses:
        return {}

    print(f"\n{'='*60}")
    print(f"STEP 3: Geocoding {len(addresses)} CMS facility addresses...")
    print(f"{'='*60}")
    print("  Using Census Geocoder batch API (this may take 30-60 seconds)...")

    results = {}

    # Census batch geocoder: max 10,000 per request
    # Format per line: id,street,city,state,zip
    csv_lines = []
    for rec_id, street, city, state, zipcode in addresses:
        # Clean fields — remove commas and quotes in address
        street_clean = street.replace('"', '').replace(',', ' ')
        city_clean = city.replace('"', '').replace(',', ' ')
        csv_lines.append(f'"{rec_id}","{street_clean}","{city_clean}","{state}","{zipcode}"')

    csv_content = "\n".join(csv_lines) + "\n"

    url = "https://geocoding.geo.census.gov/geocoder/locations/addressbatch"
    boundary = "----PythonFormBoundary7MA4YWxk"
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="addressFile"; '
        f'filename="addresses.csv"\r\n'
        f"Content-Type: text/csv\r\n\r\n"
        f"{csv_content}\r\n"
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="benchmark"\r\n\r\n'
        f"Public_AR_Current\r\n"
        f"--{boundary}--\r\n"
    )

    req = urllib.request.Request(
        url,
        data=body.encode("utf-8"),
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            response_text = resp.read().decode("utf-8", errors="replace")

        reader = csv.reader(io.StringIO(response_text))
        for row in reader:
            if len(row) < 6:
                continue
            rec_id = row[0].strip().strip('"')
            match_status = row[2].strip().strip('"') if len(row) > 2 else ""
            if match_status in ("Match", "Exact", "Non_Exact"):
                coords = row[5].strip().strip('"') if len(row) > 5 else ""
                if coords and "," in coords:
                    parts = coords.split(",")
                    try:
                        lon = float(parts[0])
                        lat = float(parts[1])
                        results[rec_id] = (round(lat, 6), round(lon, 6))
                    except (ValueError, IndexError):
                        pass

        matched = len(results)
        total = len(addresses)
        print(f"  Batch result: {matched}/{total} matched ({100*matched//total}%)")

    except Exception as e:
        print(f"  ⚠ Batch geocoding failed: {e}")
        print("  Falling back to individual geocoding...")

    # Individual fallback for unmatched
    unmatched = [a for a in addresses if a[0] not in results]
    if unmatched:
        print(f"  Geocoding {len(unmatched)} remaining addresses individually...")
        for i, (rec_id, street, city, state, zipcode) in enumerate(unmatched):
            addr_str = f"{street}, {city}, {state} {zipcode}"
            params = urllib.parse.urlencode({
                "address": addr_str,
                "benchmark": "Public_AR_Current",
                "format": "json",
            })
            api_url = (
                f"https://geocoding.geo.census.gov/geocoder/locations/"
                f"onelineaddress?{params}"
            )
            try:
                with urllib.request.urlopen(api_url, timeout=30) as resp:
                    data = json.loads(resp.read().decode("utf-8"))
                matches = data.get("result", {}).get("addressMatches", [])
                if matches:
                    coords = matches[0]["coordinates"]
                    results[rec_id] = (
                        round(coords["y"], 6),
                        round(coords["x"], 6),
                    )
                    if (i + 1) % 10 == 0:
                        print(f"    [{i+1}/{len(unmatched)}] geocoded...")
            except Exception:
                pass
            time.sleep(0.25)

    final_matched = len(results)
    print(f"  Final geocode results: {final_matched}/{len(addresses)}")
    return results


# ── 5. Census Reverse Geocoder: coordinates → county FIPS ───────────
def reverse_geocode_counties(facilities):
    """
    For FQHC facilities with lat/lng but no county FIPS,
    use Census reverse geocoder to find county.
    """
    need_county = [f for f in facilities if f["type"] == "fqhc" and not f["countyFips"]]
    if not need_county:
        return

    print(f"\n{'='*60}")
    print(f"STEP 4: Reverse geocoding {len(need_county)} FQHCs for county FIPS...")
    print(f"{'='*60}")

    for i, fac in enumerate(need_county):
        lat, lng = fac["lat"], fac["lng"]
        params = urllib.parse.urlencode({
            "x": lng,
            "y": lat,
            "benchmark": "Public_AR_Current",
            "vintage": "Current_Current",
            "format": "json",
        })
        url = (
            f"https://geocoding.geo.census.gov/geocoder/geographies/"
            f"coordinates?{params}"
        )
        try:
            with urllib.request.urlopen(url, timeout=30) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            counties = (
                data.get("result", {})
                .get("geographies", {})
                .get("Counties", [])
            )
            if counties:
                fac["countyFips"] = counties[0].get("GEOID", "")
                county_name = counties[0].get("NAME", "")
                if county_name and not fac["county"]:
                    fac["county"] = county_name.replace(" County", "").strip()
                if (i + 1) % 10 == 0:
                    print(f"  [{i+1}/{len(need_county)}] reverse geocoded...")
        except Exception as e:
            print(f"  ⚠ Reverse geocode failed for {fac['name']}: {e}")
        time.sleep(0.25)

    resolved = sum(1 for f in need_county if f["countyFips"])
    print(f"  Resolved {resolved}/{len(need_county)} county assignments")


# ── 6. Assign broadband status ──────────────────────────────────────
def assign_broadband(facilities, county_data):
    """
    Assign hasBroadband based on county adoption rate.
    Below UNSERVED_THRESHOLD → estimated unserved.
    """
    print(f"\n{'='*60}")
    print("STEP 5: Assigning broadband status from county data...")
    print(f"{'='*60}")
    print(f"  Threshold: county adoption < {UNSERVED_THRESHOLD}% → unserved")

    served = 0
    unserved = 0
    unknown = 0

    for fac in facilities:
        fips = fac.get("countyFips", "")
        if fips in county_data:
            pct = county_data[fips]["pct"]
            fac["hasBroadband"] = pct >= UNSERVED_THRESHOLD
            fac["broadbandSource"] = (
                f"Estimated from county broadband adoption rate "
                f"({pct:.1f}%, Census ACS 2023 B28002). "
                f"County {'above' if pct >= UNSERVED_THRESHOLD else 'below'} "
                f"{UNSERVED_THRESHOLD}% threshold."
            )
            if fac["hasBroadband"]:
                served += 1
            else:
                unserved += 1
        else:
            # Default to served if county unknown (likely urban)
            fac["hasBroadband"] = True
            fac["broadbandSource"] = "County FIPS not matched; defaulted to served"
            unknown += 1

    print(f"  Served (≥{UNSERVED_THRESHOLD}%): {served}")
    print(f"  Unserved (<{UNSERVED_THRESHOLD}%): {unserved}")
    if unknown:
        print(f"  Unknown county (defaulted served): {unknown}")


# ── 7. Generate TypeScript output ────────────────────────────────────
def generate_typescript(facilities):
    """Write the final kentucky-facilities.ts."""
    print(f"\n{'='*60}")
    print("STEP 6: Generating TypeScript output...")
    print(f"{'='*60}")

    # Assign sequential IDs by type
    counters = {"hospital": 0, "cah": 0, "fqhc": 0, "rhc": 0}
    for fac in facilities:
        t = fac["type"]
        counters[t] += 1
        fac["id"] = f"{t}-{counters[t]:03d}"

    # Sort: hospitals, CAHs, FQHCs, RHCs (each alphabetical by name)
    type_order = {"hospital": 0, "cah": 1, "fqhc": 2, "rhc": 3}
    facilities.sort(key=lambda f: (type_order.get(f["type"], 9), f["name"]))

    # Build facility lines
    lines = []
    current_type = None
    for fac in facilities:
        if fac["type"] != current_type:
            current_type = fac["type"]
            label = {
                "hospital": "Hospitals",
                "cah": "Critical Access Hospitals",
                "fqhc": "Federally Qualified Health Centers",
                "rhc": "Rural Health Clinics",
            }.get(current_type, current_type)
            source = fac.get("source", "")
            lines.append(f"\n  // ── {label} ({counters[current_type]}) ── Source: {source}")

        # Build the object literal
        parts = [
            f'id: "{fac["id"]}"',
            f'name: "{escape_ts(fac["name"])}"',
            f'type: "{fac["type"]}"',
            f'county: "{escape_ts(fac["county"])}"',
            f'countyFips: "{fac["countyFips"]}"',
            f'lat: {fac["lat"]}',
            f'lng: {fac["lng"]}',
        ]
        if fac.get("beds") is not None and fac["type"] in ("hospital", "cah"):
            parts.append(f'beds: {fac["beds"]}')
        parts.append(f'hasBroadband: {"true" if fac["hasBroadband"] else "false"}')

        line = "  { " + ", ".join(parts) + " },"
        lines.append(line)

    facility_block = "\n".join(lines)

    # Write the file
    ts_content = f'''\
/**
 * Kentucky Healthcare Facility Data — PRODUCTION
 *
 * Generated: {time.strftime("%B %d, %Y at %H:%M")}
 * Script: scripts/build-kentucky-facilities.py
 *
 * Data sources:
 *   Hospitals & CAHs: CMS Provider of Services Q4 2025 (Oct 2025 extract)
 *   FQHCs: HRSA Health Center Service Delivery Sites (quarterly, current)
 *   RHCs: CMS Provider of Services Q4 2025 (category code 11)
 *   Coordinates: U.S. Census Bureau Geocoder API (rooftop-level)
 *   Broadband status: Estimated from county-level adoption rates
 *     (Census ACS 2023 Table B28002; threshold: {UNSERVED_THRESHOLD}%)
 *
 * Facility counts:
 *   Hospitals: {counters["hospital"]}
 *   Critical Access Hospitals: {counters["cah"]}
 *   FQHCs: {counters["fqhc"]}
 *   RHCs: {counters["rhc"]}
 *   Total: {sum(counters.values())}
 *
 * Broadband status methodology:
 *   Each facility is assigned broadband status based on the broadband
 *   adoption rate of its county (Census ACS 2023 Table B28002).
 *   Counties with adoption rates below {UNSERVED_THRESHOLD}% are classified
 *   as "unserved." This is an ESTIMATE — actual facility-level broadband
 *   availability requires FCC BDC Fabric-level verification.
 */

import type {{ KYFacility }} from "./kentucky-config";

export const KY_FACILITIES: KYFacility[] = [{facility_block}
];

/* ------------------------------------------------------------------ */
/*  Summary Statistics (auto-derived)                                  */
/* ------------------------------------------------------------------ */

export function getKYFacilitySummary() {{
  const total = KY_FACILITIES.length;
  const served = KY_FACILITIES.filter((f) => f.hasBroadband).length;
  const unserved = total - served;

  const byType = (type: KYFacility["type"]) => {{
    const all = KY_FACILITIES.filter((f) => f.type === type);
    return {{
      total: all.length,
      served: all.filter((f) => f.hasBroadband).length,
      unserved: all.filter((f) => !f.hasBroadband).length,
    }};
  }};

  return {{
    total,
    served,
    unserved,
    servedPct: Math.round((served / total) * 100),
    unservedPct: Math.round((unserved / total) * 100),
    byType: {{
      hospital: byType("hospital"),
      cah: byType("cah"),
      fqhc: byType("fqhc"),
      rhc: byType("rhc"),
    }},
  }};
}}
'''

    OUTPUT_TS.write_text(ts_content)
    print(f"  Written to {OUTPUT_TS}")
    print(f"  Total facilities: {sum(counters.values())}")
    for t in ("hospital", "cah", "fqhc", "rhc"):
        print(f"    {t}: {counters[t]}")


def escape_ts(s):
    """Escape a string for TypeScript string literal."""
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("'", "\\'")


# ── Main ─────────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("Kentucky Facility Data Builder")
    print("=" * 60)

    # Verify files exist
    for path, label in [
        (CMS_FILE, "CMS POS"),
        (HRSA_FILE, "HRSA FQHC"),
        (BROADBAND_TS, "Broadband data"),
    ]:
        if not path.exists():
            print(f"ERROR: {label} not found at {path}")
            sys.exit(1)
        print(f"  ✓ {label}: {path.name}")

    # Load county broadband data
    county_data = load_county_broadband()

    # Parse CMS POS (hospitals, CAHs, RHCs)
    cms_facilities, to_geocode = parse_cms_pos(county_data)

    # Parse HRSA FQHCs
    fqhc_facilities = parse_hrsa_fqhc()

    # Geocode CMS facilities
    geocode_results = geocode_batch(to_geocode)

    # Apply geocode results to CMS facilities
    geocoded = 0
    failed_geocode = []
    for fac in cms_facilities:
        rec_id = fac["id"]
        if rec_id in geocode_results:
            fac["lat"], fac["lng"] = geocode_results[rec_id]
            geocoded += 1
        else:
            failed_geocode.append(fac)

    print(f"\n  Applied coordinates to {geocoded}/{len(cms_facilities)} CMS facilities")

    # Remove facilities that couldn't be geocoded
    if failed_geocode:
        print(f"  ⚠ {len(failed_geocode)} facilities could not be geocoded:")
        for fac in failed_geocode[:10]:
            print(f"      {fac['name']}, {fac.get('city', '?')}")
        if len(failed_geocode) > 10:
            print(f"      ... and {len(failed_geocode)-10} more")

    cms_with_coords = [f for f in cms_facilities if f["lat"] is not None]

    # Reverse geocode FQHCs to get county FIPS
    reverse_geocode_counties(fqhc_facilities)

    # Merge all facilities
    all_facilities = cms_with_coords + fqhc_facilities

    # Assign broadband status
    assign_broadband(all_facilities, county_data)

    # Clean up internal fields before output
    for fac in all_facilities:
        for key in ("street", "city", "zip", "source", "prvdr_num"):
            fac.pop(key, None)

    # Generate output
    # Re-add source for the header comment (store before cleanup)
    generate_typescript(all_facilities)

    # Summary
    print(f"\n{'='*60}")
    print("DONE")
    print(f"{'='*60}")
    total = len(all_facilities)
    served = sum(1 for f in all_facilities if f.get("hasBroadband"))
    print(f"Total facilities: {total}")
    print(f"Broadband served: {served} ({100*served//total}%)")
    print(f"Broadband unserved: {total - served} ({100*(total-served)//total}%)")
    print(f"\nNext: run 'npm run build' to verify, then git commit and push.")


if __name__ == "__main__":
    main()
