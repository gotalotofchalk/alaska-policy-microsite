/**
 * Kentucky Healthcare Facility Sample Data
 *
 * IMPORTANT: This is SAMPLE DATA for initial development and demo.
 * Replace with real data from:
 *   - HIFLD (hospitals/CAHs with geocoordinates)
 *   - HRSA Data Warehouse (FQHCs with geocoordinates)
 *   - CMS POS file (RHCs, cross-reference)
 *
 * Broadband status is ESTIMATED based on county-level FCC data.
 * Replace with facility-level verification when available.
 *
 * [development note: run scripts/load-kentucky-facilities.ts to
 *  regenerate this file from downloaded CSV sources]
 */

import type { KYFacility } from "./kentucky-config";

export const KY_FACILITIES: KYFacility[] = [
  // ── Critical Access Hospitals (Eastern KY Appalachian region) ──────
  { id: "cah-001", name: "Morgan County ARH Hospital", type: "cah", county: "Morgan", countyFips: "21175", lat: 38.033, lng: -83.264, beds: 25, hasBroadband: false },
  { id: "cah-002", name: "McDowell ARH Hospital", type: "cah", county: "Floyd", countyFips: "21071", lat: 37.647, lng: -82.674, beds: 25, hasBroadband: false },
  { id: "cah-003", name: "Whitesburg ARH Hospital", type: "cah", county: "Letcher", countyFips: "21133", lat: 37.118, lng: -82.826, beds: 25, hasBroadband: false },
  { id: "cah-004", name: "Mary Breckinridge ARH Hospital", type: "cah", county: "Leslie", countyFips: "21131", lat: 37.099, lng: -83.380, beds: 25, hasBroadband: false },
  { id: "cah-005", name: "Middlesboro ARH Hospital", type: "cah", county: "Bell", countyFips: "21013", lat: 36.608, lng: -83.717, beds: 25, hasBroadband: false },
  { id: "cah-006", name: "Bourbon Community Hospital", type: "cah", county: "Bourbon", countyFips: "21017", lat: 38.213, lng: -84.252, beds: 25, hasBroadband: true },
  { id: "cah-007", name: "Carroll County Memorial Hospital", type: "cah", county: "Carroll", countyFips: "21041", lat: 38.680, lng: -85.181, beds: 25, hasBroadband: true },
  { id: "cah-008", name: "Clinton County Hospital", type: "cah", county: "Clinton", countyFips: "21053", lat: 36.733, lng: -85.129, beds: 25, hasBroadband: false },
  { id: "cah-009", name: "Livingston Hospital", type: "cah", county: "Rockcastle", countyFips: "21203", lat: 37.388, lng: -84.342, beds: 25, hasBroadband: false },
  { id: "cah-010", name: "Fleming County Hospital", type: "cah", county: "Fleming", countyFips: "21069", lat: 38.420, lng: -83.734, beds: 25, hasBroadband: false },
  { id: "cah-011", name: "James B. Haggin Memorial Hospital", type: "cah", county: "Mercer", countyFips: "21167", lat: 37.772, lng: -84.873, beds: 25, hasBroadband: true },
  { id: "cah-012", name: "Jane Todd Crawford Hospital", type: "cah", county: "Green", countyFips: "21087", lat: 37.260, lng: -85.523, beds: 25, hasBroadband: false },

  // ── General Acute Care Hospitals ──────────────────────────────────
  { id: "hosp-001", name: "University of Kentucky Albert B. Chandler Hospital", type: "hospital", county: "Fayette", countyFips: "21067", lat: 38.031, lng: -84.508, beds: 945, hasBroadband: true },
  { id: "hosp-002", name: "Norton Hospital", type: "hospital", county: "Jefferson", countyFips: "21111", lat: 38.243, lng: -85.749, beds: 583, hasBroadband: true },
  { id: "hosp-003", name: "Baptist Health Lexington", type: "hospital", county: "Fayette", countyFips: "21067", lat: 38.003, lng: -84.525, beds: 383, hasBroadband: true },
  { id: "hosp-004", name: "St. Elizabeth Medical Center", type: "hospital", county: "Kenton", countyFips: "21117", lat: 39.029, lng: -84.517, beds: 488, hasBroadband: true },
  { id: "hosp-005", name: "Pikeville Medical Center", type: "hospital", county: "Pike", countyFips: "21195", lat: 37.480, lng: -82.520, beds: 261, hasBroadband: true },
  { id: "hosp-006", name: "Hazard ARH Regional Medical Center", type: "hospital", county: "Perry", countyFips: "21193", lat: 37.250, lng: -83.192, beds: 308, hasBroadband: true },
  { id: "hosp-007", name: "Lake Cumberland Regional Hospital", type: "hospital", county: "Pulaski", countyFips: "21199", lat: 37.085, lng: -84.609, beds: 295, hasBroadband: true },
  { id: "hosp-008", name: "Owensboro Health Regional Hospital", type: "hospital", county: "Daviess", countyFips: "21059", lat: 37.762, lng: -87.095, beds: 477, hasBroadband: true },
  { id: "hosp-009", name: "The Medical Center at Bowling Green", type: "hospital", county: "Warren", countyFips: "21227", lat: 36.977, lng: -86.456, beds: 337, hasBroadband: true },
  { id: "hosp-010", name: "Baptist Health Corbin", type: "hospital", county: "Whitley", countyFips: "21235", lat: 36.949, lng: -84.097, beds: 273, hasBroadband: true },

  // ── FQHCs (community health centers serving underserved populations) ─
  { id: "fqhc-001", name: "Kentucky River Community Care", type: "fqhc", county: "Perry", countyFips: "21193", lat: 37.258, lng: -83.215, hasBroadband: true },
  { id: "fqhc-002", name: "Big Sandy Health Care", type: "fqhc", county: "Johnson", countyFips: "21115", lat: 37.830, lng: -82.731, hasBroadband: false },
  { id: "fqhc-003", name: "Mountain Comprehensive Health Corporation", type: "fqhc", county: "Knott", countyFips: "21119", lat: 37.353, lng: -82.932, hasBroadband: false },
  { id: "fqhc-004", name: "White House Clinics", type: "fqhc", county: "Madison", countyFips: "21151", lat: 37.735, lng: -84.295, hasBroadband: true },
  { id: "fqhc-005", name: "Grace Community Health Center", type: "fqhc", county: "Laurel", countyFips: "21125", lat: 37.077, lng: -84.116, hasBroadband: true },
  { id: "fqhc-006", name: "Park DuValle Community Health Center", type: "fqhc", county: "Jefferson", countyFips: "21111", lat: 38.224, lng: -85.787, hasBroadband: true },
  { id: "fqhc-007", name: "Bluegrass Community Health Center", type: "fqhc", county: "Fayette", countyFips: "21067", lat: 38.053, lng: -84.491, hasBroadband: true },
  { id: "fqhc-008", name: "Primary Care Centers of Eastern Kentucky", type: "fqhc", county: "Floyd", countyFips: "21071", lat: 37.598, lng: -82.748, hasBroadband: false },
  { id: "fqhc-009", name: "Daniel Boone Clinic", type: "fqhc", county: "Clay", countyFips: "21051", lat: 37.160, lng: -83.778, hasBroadband: false },
  { id: "fqhc-010", name: "Family Health Centers", type: "fqhc", county: "Jefferson", countyFips: "21111", lat: 38.185, lng: -85.770, hasBroadband: true },

  // ── Rural Health Clinics ──────────────────────────────────────────
  { id: "rhc-001", name: "Wolfe County Primary Care", type: "rhc", county: "Wolfe", countyFips: "21237", lat: 37.742, lng: -83.494, hasBroadband: false },
  { id: "rhc-002", name: "Menifee County Health Department Clinic", type: "rhc", county: "Menifee", countyFips: "21165", lat: 37.941, lng: -83.607, hasBroadband: false },
  { id: "rhc-003", name: "Elliott County Medical Center", type: "rhc", county: "Elliott", countyFips: "21063", lat: 38.149, lng: -83.102, hasBroadband: false },
  { id: "rhc-004", name: "Owsley County Health Center", type: "rhc", county: "Owsley", countyFips: "21189", lat: 37.423, lng: -83.681, hasBroadband: false },
  { id: "rhc-005", name: "Lee County Primary Care", type: "rhc", county: "Lee", countyFips: "21129", lat: 37.601, lng: -83.684, hasBroadband: false },
  { id: "rhc-006", name: "Metcalfe County Medical Clinic", type: "rhc", county: "Metcalfe", countyFips: "21169", lat: 36.986, lng: -85.610, hasBroadband: false },
  { id: "rhc-007", name: "Casey County Primary Care", type: "rhc", county: "Casey", countyFips: "21045", lat: 37.330, lng: -84.917, hasBroadband: false },
  { id: "rhc-008", name: "Monroe County Medical Center Clinic", type: "rhc", county: "Monroe", countyFips: "21171", lat: 36.710, lng: -85.693, hasBroadband: false },
  { id: "rhc-009", name: "Nicholas County Family Practice", type: "rhc", county: "Nicholas", countyFips: "21181", lat: 38.294, lng: -84.007, hasBroadband: false },
  { id: "rhc-010", name: "Jackson County Medical Clinic", type: "rhc", county: "Jackson", countyFips: "21109", lat: 37.574, lng: -84.001, hasBroadband: false },
];

/* ------------------------------------------------------------------ */
/*  Summary Statistics (auto-derived)                                  */
/* ------------------------------------------------------------------ */

export function getKYFacilitySummary() {
  const total = KY_FACILITIES.length;
  const served = KY_FACILITIES.filter((f) => f.hasBroadband).length;
  const unserved = total - served;

  const byType = (type: KYFacility["type"]) => {
    const all = KY_FACILITIES.filter((f) => f.type === type);
    return {
      total: all.length,
      served: all.filter((f) => f.hasBroadband).length,
      unserved: all.filter((f) => !f.hasBroadband).length,
    };
  };

  return {
    total,
    served,
    unserved,
    servedPct: Math.round((served / total) * 100),
    unservedPct: Math.round((unserved / total) * 100),
    byType: {
      hospital: byType("hospital"),
      cah: byType("cah"),
      fqhc: byType("fqhc"),
      rhc: byType("rhc"),
    },
  };
}

/* ------------------------------------------------------------------ */
/*  County-level broadband summary (sample — replace with FCC data)    */
/* ------------------------------------------------------------------ */

export interface KYCountyBroadband {
  fips: string;
  name: string;
  population: number;
  households: number;
  pctServed25_3: number;       // % of locations with 25/3 Mbps
  pctServed100_20: number;     // % of locations with 100/20 Mbps
  unservedHouseholds: number;  // households below 25/3
}

/**
 * Sample county broadband data for Eastern Kentucky.
 * [development note: replace with FCC BDC + Census ACS merged data]
 */
export const KY_COUNTY_BROADBAND: KYCountyBroadband[] = [
  { fips: "21013", name: "Bell", population: 24_757, households: 10_200, pctServed25_3: 62, pctServed100_20: 28, unservedHouseholds: 3_876 },
  { fips: "21019", name: "Boyd", population: 46_718, households: 19_800, pctServed25_3: 89, pctServed100_20: 61, unservedHouseholds: 2_178 },
  { fips: "21025", name: "Breathitt", population: 12_175, households: 5_100, pctServed25_3: 48, pctServed100_20: 15, unservedHouseholds: 2_652 },
  { fips: "21043", name: "Carter", population: 26_521, households: 10_900, pctServed25_3: 58, pctServed100_20: 22, unservedHouseholds: 4_578 },
  { fips: "21051", name: "Clay", population: 19_447, households: 7_800, pctServed25_3: 44, pctServed100_20: 12, unservedHouseholds: 4_368 },
  { fips: "21053", name: "Clinton", population: 9_533, households: 4_000, pctServed25_3: 52, pctServed100_20: 18, unservedHouseholds: 1_920 },
  { fips: "21063", name: "Elliott", population: 7_316, households: 2_900, pctServed25_3: 38, pctServed100_20: 8, unservedHouseholds: 1_798 },
  { fips: "21069", name: "Fleming", population: 14_422, households: 5_700, pctServed25_3: 55, pctServed100_20: 20, unservedHouseholds: 2_565 },
  { fips: "21071", name: "Floyd", population: 34_544, households: 14_200, pctServed25_3: 61, pctServed100_20: 25, unservedHouseholds: 5_538 },
  { fips: "21087", name: "Green", population: 10_879, households: 4_500, pctServed25_3: 50, pctServed100_20: 16, unservedHouseholds: 2_250 },
  { fips: "21109", name: "Jackson", population: 12_961, households: 5_200, pctServed25_3: 42, pctServed100_20: 11, unservedHouseholds: 3_016 },
  { fips: "21115", name: "Johnson", population: 21_535, households: 8_800, pctServed25_3: 56, pctServed100_20: 21, unservedHouseholds: 3_872 },
  { fips: "21119", name: "Knott", population: 13_543, households: 5_600, pctServed25_3: 45, pctServed100_20: 13, unservedHouseholds: 3_080 },
  { fips: "21125", name: "Laurel", population: 63_426, households: 25_100, pctServed25_3: 78, pctServed100_20: 45, unservedHouseholds: 5_522 },
  { fips: "21129", name: "Lee", population: 6_538, households: 2_700, pctServed25_3: 40, pctServed100_20: 10, unservedHouseholds: 1_620 },
  { fips: "21131", name: "Leslie", population: 9_426, households: 3_800, pctServed25_3: 43, pctServed100_20: 12, unservedHouseholds: 2_166 },
  { fips: "21133", name: "Letcher", population: 20_345, households: 8_600, pctServed25_3: 51, pctServed100_20: 19, unservedHouseholds: 4_214 },
  { fips: "21135", name: "Lewis", population: 13_092, households: 5_300, pctServed25_3: 46, pctServed100_20: 14, unservedHouseholds: 2_862 },
  { fips: "21153", name: "Magoffin", population: 12_027, households: 4_800, pctServed25_3: 41, pctServed100_20: 10, unservedHouseholds: 2_832 },
  { fips: "21159", name: "Martin", population: 10_582, households: 4_200, pctServed25_3: 39, pctServed100_20: 9, unservedHouseholds: 2_562 },
  { fips: "21165", name: "Menifee", population: 6_034, households: 2_500, pctServed25_3: 36, pctServed100_20: 8, unservedHouseholds: 1_600 },
  { fips: "21171", name: "Monroe", population: 10_295, households: 4_300, pctServed25_3: 54, pctServed100_20: 17, unservedHouseholds: 1_978 },
  { fips: "21175", name: "Morgan", population: 12_658, households: 5_100, pctServed25_3: 43, pctServed100_20: 11, unservedHouseholds: 2_907 },
  { fips: "21181", name: "Nicholas", population: 7_438, households: 3_000, pctServed25_3: 49, pctServed100_20: 16, unservedHouseholds: 1_530 },
  { fips: "21189", name: "Owsley", population: 4_189, households: 1_700, pctServed25_3: 34, pctServed100_20: 7, unservedHouseholds: 1_122 },
  { fips: "21193", name: "Perry", population: 24_098, households: 10_000, pctServed25_3: 65, pctServed100_20: 30, unservedHouseholds: 3_500 },
  { fips: "21195", name: "Pike", population: 56_300, households: 23_100, pctServed25_3: 68, pctServed100_20: 32, unservedHouseholds: 7_392 },
  { fips: "21199", name: "Pulaski", population: 65_486, households: 27_000, pctServed25_3: 75, pctServed100_20: 42, unservedHouseholds: 6_750 },
  { fips: "21203", name: "Rockcastle", population: 16_051, households: 6_600, pctServed25_3: 53, pctServed100_20: 19, unservedHouseholds: 3_102 },
  { fips: "21237", name: "Wolfe", population: 6_804, households: 2_800, pctServed25_3: 37, pctServed100_20: 9, unservedHouseholds: 1_764 },
];

export function getKYBroadbandSummary() {
  const totalHouseholds = KY_COUNTY_BROADBAND.reduce((s, c) => s + c.households, 0);
  const totalUnserved = KY_COUNTY_BROADBAND.reduce((s, c) => s + c.unservedHouseholds, 0);
  const totalPop = KY_COUNTY_BROADBAND.reduce((s, c) => s + c.population, 0);
  const avgServedPct = KY_COUNTY_BROADBAND.reduce((s, c) => s + c.pctServed25_3, 0) / KY_COUNTY_BROADBAND.length;

  return {
    countiesTracked: KY_COUNTY_BROADBAND.length,
    totalHouseholds,
    totalUnserved,
    totalPop,
    avgServedPct: Math.round(avgServedPct),
    unservedPct: Math.round((totalUnserved / totalHouseholds) * 100),
  };
}
