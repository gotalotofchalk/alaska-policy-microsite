/**
 * bsl-lookup.ts
 * 
 * Spatial lookup functions for the Kentucky BSL (Broadband Serviceable Location)
 * grid. Uses H3 Resolution-8 hexagon data from FCC BDC December 2024.
 * 
 * The grid is loaded lazily from /data/kentucky-bsl-grid.json on first use.
 * Each hex record has a centroid lat/lng and BSL counts (total, served,
 * underserved, unserved). Spatial queries use haversine distance to find
 * all hexes within a given radius of a point.
 * 
 * Place in: src/lib/bsl-lookup.ts
 */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface BSLCell {
  id: string;   // H3 hex ID
  lat: number;  // centroid latitude
  lng: number;  // centroid longitude
  t: number;    // total BSLs
  s: number;    // served BSLs
  u: number;    // underserved BSLs
  x: number;    // unserved BSLs
}

export interface BSLGridData {
  summary: {
    totalHexes: number;
    totalBSLs: number;
    servedBSLs: number;
    underservedBSLs: number;
    unservedBSLs: number;
    beadEligibleBSLs: number;
    generatedAt: string;
    source: string;
  };
  grid: BSLCell[];
}

export interface BSLCoverageResult {
  unservedBSLs: number;
  underservedBSLs: number;
  servedBSLs: number;
  totalBSLs: number;
  hexesInRange: number;
}

/* ------------------------------------------------------------------ */
/*  Grid loading                                                       */
/* ------------------------------------------------------------------ */

let gridData: BSLGridData | null = null;
let loadPromise: Promise<BSLGridData> | null = null;

/**
 * Load the BSL grid. Returns cached data on subsequent calls.
 * Call this in useEffect on the satellite planner page.
 */
export async function loadBSLGrid(): Promise<BSLGridData> {
  if (gridData) return gridData;
  if (loadPromise) return loadPromise;

  loadPromise = fetch('/data/kentucky-bsl-grid.json')
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load BSL grid: ${res.status}`);
      return res.json();
    })
    .then((data: BSLGridData) => {
      gridData = data;
      console.log(
        `[BSL Grid] Loaded ${data.grid.length.toLocaleString()} hexes, ` +
        `${data.summary.unservedBSLs.toLocaleString()} unserved BSLs`
      );
      return data;
    });

  return loadPromise;
}

/** Check if the grid has been loaded. */
export function isBSLGridLoaded(): boolean {
  return gridData !== null;
}

/** Get the loaded grid (returns null if not yet loaded). */
export function getBSLGrid(): BSLGridData | null {
  return gridData;
}

/* ------------------------------------------------------------------ */
/*  Haversine distance (miles)                                         */
/* ------------------------------------------------------------------ */

function haversineDistMiles(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ------------------------------------------------------------------ */
/*  Spatial queries                                                    */
/* ------------------------------------------------------------------ */

/**
 * Count BSLs within a radius of a point.
 * Returns zeros if the grid hasn't loaded yet.
 */
export function countBSLsInRadius(
  lat: number,
  lng: number,
  radiusMiles: number,
): BSLCoverageResult {
  if (!gridData) {
    return { unservedBSLs: 0, underservedBSLs: 0, servedBSLs: 0, totalBSLs: 0, hexesInRange: 0 };
  }

  let unservedBSLs = 0;
  let underservedBSLs = 0;
  let servedBSLs = 0;
  let totalBSLs = 0;
  let hexesInRange = 0;

  // Quick bounding box pre-filter (1 degree lat ≈ 69 miles)
  const latDelta = radiusMiles / 69;
  const lngDelta = radiusMiles / (69 * Math.cos((lat * Math.PI) / 180));
  const latMin = lat - latDelta;
  const latMax = lat + latDelta;
  const lngMin = lng - lngDelta;
  const lngMax = lng + lngDelta;

  for (const cell of gridData.grid) {
    // Fast bounding box check
    if (cell.lat < latMin || cell.lat > latMax || cell.lng < lngMin || cell.lng > lngMax) {
      continue;
    }
    // Precise distance check
    if (haversineDistMiles(lat, lng, cell.lat, cell.lng) <= radiusMiles) {
      unservedBSLs += cell.x;
      underservedBSLs += cell.u;
      servedBSLs += cell.s;
      totalBSLs += cell.t;
      hexesInRange++;
    }
  }

  return { unservedBSLs, underservedBSLs, servedBSLs, totalBSLs, hexesInRange };
}

/**
 * Count unique unserved BSLs reached by multiple terminals.
 * Deduplicates by tracking which hex IDs have been counted.
 */
export function countCumulativeCoverage(
  terminals: Array<{ lat: number; lng: number }>,
  radiusMiles: number,
): BSLCoverageResult {
  if (!gridData) {
    return { unservedBSLs: 0, underservedBSLs: 0, servedBSLs: 0, totalBSLs: 0, hexesInRange: 0 };
  }

  const coveredHexIds = new Set<string>();
  let unservedBSLs = 0;
  let underservedBSLs = 0;
  let servedBSLs = 0;
  let totalBSLs = 0;

  for (const terminal of terminals) {
    const latDelta = radiusMiles / 69;
    const lngDelta = radiusMiles / (69 * Math.cos((terminal.lat * Math.PI) / 180));
    const latMin = terminal.lat - latDelta;
    const latMax = terminal.lat + latDelta;
    const lngMin = terminal.lng - lngDelta;
    const lngMax = terminal.lng + lngDelta;

    for (const cell of gridData.grid) {
      if (coveredHexIds.has(cell.id)) continue;
      if (cell.lat < latMin || cell.lat > latMax || cell.lng < lngMin || cell.lng > lngMax) continue;
      if (haversineDistMiles(terminal.lat, terminal.lng, cell.lat, cell.lng) <= radiusMiles) {
        coveredHexIds.add(cell.id);
        unservedBSLs += cell.x;
        underservedBSLs += cell.u;
        servedBSLs += cell.s;
        totalBSLs += cell.t;
      }
    }
  }

  return {
    unservedBSLs,
    underservedBSLs,
    servedBSLs,
    totalBSLs,
    hexesInRange: coveredHexIds.size,
  };
}

/**
 * Get statewide totals from the grid summary.
 * Note: these only include hexes with gaps (unserved or underserved > 0).
 * For full state totals, use the county-level broadband data.
 */
export function getGridSummary() {
  return gridData?.summary ?? null;
}
