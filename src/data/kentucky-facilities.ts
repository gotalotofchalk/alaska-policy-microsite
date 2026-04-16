/**
 * Kentucky Healthcare Facility Data
 *
 * HOSPITALS & CAHs: KY Cabinet for Health and Family Services (CHFS/OIG)
 *   Hospital Directory and Critical Access Hospital Directory, April 2026.
 *   68 acute care hospitals + 28 Critical Access Hospitals = 96 facilities.
 *   Coordinates: city-level centroids (not rooftop-level).
 *
 * FQHCs: HRSA Data Warehouse, Health Center Service Delivery Sites.
 *   Geocoordinates from HRSA (rooftop-level).
 *
 * Broadband status: ESTIMATED from county-level FCC BDC availability data (Dec 2024).
 *   Counties with >25% BEAD-eligible BSLs → facility marked "unserved"
 *   Counties with 10–25% BEAD-eligible BSLs → facility marked "underserved"
 *   Counties with <10% BEAD-eligible BSLs → facility marked "served"
 *   Facility-level broadband verification not yet available.
 */

import type { KYFacility, BroadbandStatus } from "./kentucky-config";

export const KY_FACILITIES: KYFacility[] = [
  // ── Acute Care Hospitals (68) ── Source: KY CHFS Hospital Directory April 2026
  { id: "hosp-001", name: "T J Health Columbia", type: "hospital", county: "Adair", countyFips: "21001", lat: 37.103, lng: -85.306, beds: 74, broadbandStatus: "unserved", cyberStatus: "unknown" },
  { id: "hosp-002", name: "T J Samson Community Hospital", type: "hospital", county: "Barren", countyFips: "21009", lat: 36.996, lng: -85.912, beds: 180, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-003", name: "Pineville Community Health Center, Inc", type: "hospital", county: "Bell", countyFips: "21013", lat: 36.762, lng: -83.695, beds: 120, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-004", name: "Middlesboro ARH Hospital", type: "hospital", county: "Bell", countyFips: "21013", lat: 36.608, lng: -83.717, beds: 96, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-005", name: "St. Elizabeth Florence", type: "hospital", county: "Boone", countyFips: "21015", lat: 38.999, lng: -84.627, beds: 188, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-006", name: "Centerpoint Health Paris", type: "hospital", county: "Bourbon", countyFips: "21017", lat: 38.21, lng: -84.253, beds: 58, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "hosp-007", name: "Kings Daughters Medical Center", type: "hospital", county: "Boyd", countyFips: "21019", lat: 38.478, lng: -82.638, beds: 455, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-008", name: "Ephraim McDowell Regional Medical Center", type: "hospital", county: "Boyle", countyFips: "21021", lat: 37.646, lng: -84.772, beds: 197, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "hosp-009", name: "UofL South Hospital", type: "hospital", county: "Bullitt", countyFips: "21029", lat: 37.988, lng: -85.716, beds: 40, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-010", name: "Murray Calloway County Hospital", type: "hospital", county: "Calloway", countyFips: "21035", lat: 36.61, lng: -88.315, beds: 152, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-011", name: "St. Elizabeth Ft. Thomas", type: "hospital", county: "Campbell", countyFips: "21037", lat: 39.075, lng: -84.449, beds: 178, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-012", name: "Jennie Stuart Medical Center Inc", type: "hospital", county: "Christian", countyFips: "21047", lat: 36.866, lng: -87.489, beds: 194, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-013", name: "Clark Regional Medical Center", type: "hospital", county: "Clark", countyFips: "21049", lat: 37.99, lng: -84.179, beds: 75, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-014", name: "AdventHealth Manchester", type: "hospital", county: "Clay", countyFips: "21051", lat: 37.154, lng: -83.762, beds: 49, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "hosp-015", name: "The Medical Center at Albany", type: "hospital", county: "Clinton", countyFips: "21053", lat: 36.691, lng: -85.134, beds: 42, broadbandStatus: "unserved", cyberStatus: "unknown" },
  { id: "hosp-016", name: "Owensboro Health Regional Hospital", type: "hospital", county: "Daviess", countyFips: "21059", lat: 37.774, lng: -87.111, beds: 447, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-017", name: "UK HealthCare Good Samaritan Hospital", type: "hospital", county: "Fayette", countyFips: "21067", lat: 38.04, lng: -84.503, beds: 221, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-018", name: "Baptist Health Lexington", type: "hospital", county: "Fayette", countyFips: "21067", lat: 38.04, lng: -84.503, beds: 434, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-019", name: "Saint Joseph Hospital", type: "hospital", county: "Fayette", countyFips: "21067", lat: 38.04, lng: -84.503, beds: 433, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-020", name: "University of Kentucky Hospital", type: "hospital", county: "Fayette", countyFips: "21067", lat: 38.04, lng: -84.503, beds: 941, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-021", name: "Saint Joseph East", type: "hospital", county: "Fayette", countyFips: "21067", lat: 38.04, lng: -84.503, beds: 217, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-022", name: "Highlands Regional Medical Center", type: "hospital", county: "Floyd", countyFips: "21071", lat: 37.666, lng: -82.771, beds: 174, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-023", name: "Frankfort Regional Medical Center", type: "hospital", county: "Franklin", countyFips: "21073", lat: 38.201, lng: -84.873, beds: 173, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "hosp-024", name: "Jackson Purchase Medical Center", type: "hospital", county: "Graves", countyFips: "21083", lat: 36.742, lng: -88.647, beds: 107, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-025", name: "Owensboro Health Twin Lakes Medical Center", type: "hospital", county: "Grayson", countyFips: "21085", lat: 37.48, lng: -86.294, beds: 75, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "hosp-026", name: "Baptist Health Hardin", type: "hospital", county: "Hardin", countyFips: "21093", lat: 37.694, lng: -85.859, beds: 285, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-027", name: "Harlan ARH Hospital", type: "hospital", county: "Harlan", countyFips: "21095", lat: 36.843, lng: -83.322, beds: 150, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-028", name: "Harrison Memorial Hospital", type: "hospital", county: "Harrison", countyFips: "21097", lat: 38.39, lng: -84.294, beds: 61, broadbandStatus: "unserved", cyberStatus: "unknown" },
  { id: "hosp-029", name: "Deaconess Henderson Hospital", type: "hospital", county: "Henderson", countyFips: "21101", lat: 37.836, lng: -87.59, beds: 192, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-030", name: "Baptist Health Deaconess Madisonville", type: "hospital", county: "Hopkins", countyFips: "21107", lat: 37.328, lng: -87.499, beds: 390, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-031", name: "UofL Health - Jewish Hospital", type: "hospital", county: "Jefferson", countyFips: "21111", lat: 38.254, lng: -85.76, beds: 462, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-032", name: "UofL Health - Mary and Elizabeth Hospital", type: "hospital", county: "Jefferson", countyFips: "21111", lat: 38.254, lng: -85.76, beds: 291, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-033", name: "Norton West Louisville Hospital", type: "hospital", county: "Jefferson", countyFips: "21111", lat: 38.254, lng: -85.76, beds: 20, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-034", name: "Norton Brownsboro Hospital", type: "hospital", county: "Jefferson", countyFips: "21111", lat: 38.254, lng: -85.76, beds: 197, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-035", name: "Norton Women's and Children's Hospital", type: "hospital", county: "Jefferson", countyFips: "21111", lat: 38.254, lng: -85.76, beds: 373, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-036", name: "Norton Audubon Hospital", type: "hospital", county: "Jefferson", countyFips: "21111", lat: 38.254, lng: -85.76, beds: 432, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-037", name: "University of Louisville Hospital", type: "hospital", county: "Jefferson", countyFips: "21111", lat: 38.254, lng: -85.76, beds: 404, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-038", name: "Kindred Hospital Louisville", type: "hospital", county: "Jefferson", countyFips: "21111", lat: 38.254, lng: -85.76, beds: 337, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-039", name: "Baptist Health Louisville", type: "hospital", county: "Jefferson", countyFips: "21111", lat: 38.254, lng: -85.76, beds: 490, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-040", name: "Norton Hospital/Norton Medical Pavilion/Norton Children's Hospital", type: "hospital", county: "Jefferson", countyFips: "21111", lat: 38.254, lng: -85.76, beds: 885, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-041", name: "Paintsville ARH Hospital", type: "hospital", county: "Johnson", countyFips: "21115", lat: 37.815, lng: -82.807, beds: 72, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-042", name: "St. Elizabeth Edgewood", type: "hospital", county: "Kenton", countyFips: "21117", lat: 39.019, lng: -84.582, beds: 598, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-043", name: "CHI Saint Joseph Hospital London", type: "hospital", county: "Laurel", countyFips: "21125", lat: 37.129, lng: -84.083, beds: 150, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-044", name: "Three Rivers Medical Center", type: "hospital", county: "Lawrence", countyFips: "21127", lat: 38.114, lng: -82.603, beds: 90, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-045", name: "Whitesburg ARH Hospital", type: "hospital", county: "Letcher", countyFips: "21133", lat: 37.119, lng: -82.827, beds: 90, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-046", name: "The Medical Center at Russellville", type: "hospital", county: "Logan", countyFips: "21141", lat: 36.845, lng: -86.887, beds: 75, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-047", name: "Baptist Health Richmond", type: "hospital", county: "Madison", countyFips: "21151", lat: 37.748, lng: -84.295, beds: 105, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-048", name: "Spring View Hospital", type: "hospital", county: "Marion", countyFips: "21155", lat: 37.57, lng: -85.253, beds: 75, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "hosp-049", name: "Meadowview Regional Medical Center", type: "hospital", county: "Mason", countyFips: "21161", lat: 38.641, lng: -83.744, beds: 100, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "hosp-050", name: "Baptist Health Corbin", type: "hospital", county: "Whitley", countyFips: "21235", lat: 36.949, lng: -84.097, beds: 273, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-051", name: "Baptist Health Paducah", type: "hospital", county: "Mccracken", countyFips: "21145", lat: 37.084, lng: -88.6, beds: 349, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-052", name: "Mercy Health Lourdes Hospital", type: "hospital", county: "McCracken", countyFips: "21145", lat: 37.084, lng: -88.6, beds: 359, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-053", name: "Monroe County Medical Center", type: "hospital", county: "Monroe", countyFips: "21171", lat: 36.702, lng: -85.692, beds: 49, broadbandStatus: "unserved", cyberStatus: "unknown" },
  { id: "hosp-054", name: "CHI Saint Joseph Mount Sterling", type: "hospital", county: "Montgomery", countyFips: "21173", lat: 38.056, lng: -83.943, beds: 42, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "hosp-055", name: "Owensboro Health Muhlenberg Community Hospital", type: "hospital", county: "Muhlenberg", countyFips: "21177", lat: 37.201, lng: -87.179, beds: 90, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "hosp-056", name: "Flaget Memorial Hospital ", type: "hospital", county: "Nelson", countyFips: "21179", lat: 37.809, lng: -85.467, beds: 40, broadbandStatus: "unserved", cyberStatus: "unknown" },
  { id: "hosp-057", name: "Baptist Health La Grange", type: "hospital", county: "Oldham", countyFips: "21185", lat: 38.407, lng: -85.379, beds: 90, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-058", name: "Hazard ARH Regional Medical Center", type: "hospital", county: "Perry", countyFips: "21193", lat: 37.25, lng: -83.193, beds: 358, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-059", name: "Tug Valley ARH Regional Medical Center", type: "hospital", county: "Pike", countyFips: "21195", lat: 37.665, lng: -82.288, beds: 113, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-060", name: "Pikeville Medical Center", type: "hospital", county: "Pike", countyFips: "21195", lat: 37.479, lng: -82.519, beds: 348, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-061", name: "Lake Cumberland Regional Hospital", type: "hospital", county: "Pulaski", countyFips: "21199", lat: 37.092, lng: -84.604, beds: 283, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "hosp-062", name: "Rockcastle Regional Hospital & Respiratory Care Center", type: "hospital", county: "Rockcastle", countyFips: "21203", lat: 37.353, lng: -84.341, beds: 30, broadbandStatus: "unserved", cyberStatus: "unknown" },
  { id: "hosp-063", name: "St. Claire Regional Medical Center", type: "hospital", county: "Rowan", countyFips: "21205", lat: 38.184, lng: -83.433, beds: 149, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "hosp-064", name: "Georgetown Community Hospital", type: "hospital", county: "Scott", countyFips: "21209", lat: 38.21, lng: -84.559, beds: 75, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-065", name: "UofL Health - Shelbyville Hospital", type: "hospital", county: "Shelby", countyFips: "21211", lat: 38.212, lng: -85.224, beds: 70, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "hosp-066", name: "Taylor Regional Hospital", type: "hospital", county: "Taylor", countyFips: "21217", lat: 37.343, lng: -85.342, beds: 90, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "hosp-067", name: "The Medical Center at Bowling Green", type: "hospital", county: "Warren", countyFips: "21227", lat: 36.99, lng: -86.444, beds: 373, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "hosp-068", name: "TriStar Greenview Regional Hospital", type: "hospital", county: "Warren", countyFips: "21227", lat: 36.99, lng: -86.444, beds: 211, broadbandStatus: "served", cyberStatus: "unknown" },

  // ── Critical Access Hospitals (28) ── Source: KY CHFS CAH Directory April 2026
  { id: "cah-001", name: "The Medical Center At Scottsville", type: "cah", county: "Allen", countyFips: "21003", lat: 36.753, lng: -86.19, beds: 25, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "cah-002", name: "Kentucky River Medical Center", type: "cah", county: "Breathitt", countyFips: "21025", lat: 37.553, lng: -83.384, beds: 25, broadbandStatus: "unserved", cyberStatus: "unknown" },
  { id: "cah-003", name: "Breckinridge Memorial Hospital", type: "cah", county: "Breckinridge", countyFips: "21027", lat: 37.78, lng: -86.46, beds: 25, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "cah-004", name: "Caldwell Medical Center", type: "cah", county: "Caldwell", countyFips: "21033", lat: 37.109, lng: -87.882, beds: 25, broadbandStatus: "unserved", cyberStatus: "unknown" },
  { id: "cah-005", name: "Casey County Hospital", type: "cah", county: "Casey", countyFips: "21045", lat: 37.318, lng: -84.937, beds: 24, broadbandStatus: "unserved", cyberStatus: "unknown" },
  { id: "cah-006", name: "Cumberland County Hospital", type: "cah", county: "Cumberland", countyFips: "21057", lat: 36.791, lng: -85.37, beds: 25, broadbandStatus: "unserved", cyberStatus: "unknown" },
  { id: "cah-007", name: "Marcum and Wallace Memorial Hospital", type: "cah", county: "Estill", countyFips: "21065", lat: 37.694, lng: -83.971, beds: 25, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "cah-008", name: "McDowell ARH Hospital", type: "cah", county: "Floyd", countyFips: "21071", lat: 37.424, lng: -82.682, beds: 25, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "cah-009", name: "ARH Our Lady of the Way", type: "cah", county: "Floyd", countyFips: "21071", lat: 37.556, lng: -82.761, beds: 25, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "cah-010", name: "St. Elizabeth Grant", type: "cah", county: "Grant", countyFips: "21081", lat: 38.638, lng: -84.56, beds: 25, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "cah-011", name: "Jane Todd Crawford Memorial Hospital", type: "cah", county: "Green", countyFips: "21087", lat: 37.261, lng: -85.499, beds: 35, broadbandStatus: "unserved", cyberStatus: "unknown" },
  { id: "cah-012", name: "The Medical Center at Caverna", type: "cah", county: "Hart", countyFips: "21099", lat: 37.176, lng: -85.907, beds: 25, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "cah-013", name: "Carroll County Memorial Hospital", type: "cah", county: "Carroll", countyFips: "21041", lat: 38.681, lng: -85.179, beds: 25, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "cah-014", name: "Barbourville ARH Hospital", type: "cah", county: "Knox", countyFips: "21121", lat: 36.866, lng: -83.889, beds: 25, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "cah-015", name: "Mary Breckinridge ARH Hospital", type: "cah", county: "Leslie", countyFips: "21131", lat: 37.161, lng: -83.373, beds: 25, broadbandStatus: "unserved", cyberStatus: "unknown" },
  { id: "cah-016", name: "Ephraim McDowell Fort Logan Hospital", type: "cah", county: "Lincoln", countyFips: "21137", lat: 37.531, lng: -84.662, beds: 25, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "cah-017", name: "Livingston Hospital & Healthcare Services. Inc.", type: "cah", county: "Livingston", countyFips: "21139", lat: 37.267, lng: -88.238, beds: 25, broadbandStatus: "unserved", cyberStatus: "unknown" },
  { id: "cah-018", name: "Saint Joseph Berea", type: "cah", county: "Madison", countyFips: "21151", lat: 37.569, lng: -84.296, beds: 25, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "cah-019", name: "Marshall County Hospital", type: "cah", county: "Marshall", countyFips: "21157", lat: 36.857, lng: -88.35, beds: 25, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "cah-020", name: "The James B. Haggin Memorial Hospital", type: "cah", county: "Mercer", countyFips: "21167", lat: 37.763, lng: -84.843, beds: 25, broadbandStatus: "unserved", cyberStatus: "unknown" },
  { id: "cah-021", name: "Morgan County ARH Hospital", type: "cah", county: "Morgan", countyFips: "21175", lat: 37.921, lng: -83.264, beds: 25, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "cah-022", name: "Ohio County Hospital", type: "cah", county: "Ohio", countyFips: "21183", lat: 37.451, lng: -86.909, beds: 25, broadbandStatus: "unserved", cyberStatus: "unknown" },
  { id: "cah-023", name: "Russell County Hospital", type: "cah", county: "Russell", countyFips: "21207", lat: 37.056, lng: -85.088, beds: 25, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "cah-024", name: "The Medical Center At Franklin", type: "cah", county: "Simpson", countyFips: "21213", lat: 36.722, lng: -86.577, beds: 25, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "cah-025", name: "Trigg County Hospital Inc.", type: "cah", county: "Trigg", countyFips: "21221", lat: 36.865, lng: -87.835, beds: 25, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "cah-026", name: "Deaconess Union County Hospital", type: "cah", county: "Union", countyFips: "21225", lat: 37.683, lng: -87.917, beds: 25, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "cah-027", name: "Wayne County Hospital, Inc.", type: "cah", county: "Wayne", countyFips: "21231", lat: 36.83, lng: -84.849, beds: 25, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "cah-028", name: "Centerpoint Health - Versailles", type: "cah", county: "Woodford", countyFips: "21239", lat: 38.052, lng: -84.73, beds: 25, broadbandStatus: "underserved", cyberStatus: "unknown" },

  // ── FQHCs ── Source: HRSA Data Warehouse (geocoordinates from HRSA)
  { id: "fqhc-001", name: "Kentucky River Community Care", type: "fqhc", county: "Perry", countyFips: "21193", lat: 37.258, lng: -83.215, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "fqhc-002", name: "Big Sandy Health Care", type: "fqhc", county: "Johnson", countyFips: "21115", lat: 37.83, lng: -82.731, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "fqhc-003", name: "Mountain Comprehensive Health Corporation", type: "fqhc", county: "Knott", countyFips: "21119", lat: 37.353, lng: -82.932, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "fqhc-004", name: "White House Clinics", type: "fqhc", county: "Madison", countyFips: "21151", lat: 37.735, lng: -84.295, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "fqhc-005", name: "Grace Community Health Center", type: "fqhc", county: "Laurel", countyFips: "21125", lat: 37.077, lng: -84.116, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "fqhc-006", name: "Park DuValle Community Health Center", type: "fqhc", county: "Jefferson", countyFips: "21111", lat: 38.224, lng: -85.787, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "fqhc-007", name: "Bluegrass Community Health Center", type: "fqhc", county: "Fayette", countyFips: "21067", lat: 38.053, lng: -84.491, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "fqhc-008", name: "Primary Care Centers of Eastern Kentucky", type: "fqhc", county: "Martin", countyFips: "21159", lat: 37.555, lng: -82.761, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "fqhc-009", name: "Family Health Centers", type: "fqhc", county: "Jefferson", countyFips: "21111", lat: 38.189, lng: -85.737, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "fqhc-010", name: "HealthFirst Bluegrass", type: "fqhc", county: "Fayette", countyFips: "21067", lat: 38.029, lng: -84.459, broadbandStatus: "served", cyberStatus: "unknown" },

  // ── Rural Health Clinics ── Source: CMS POS file (coordinates approximate)
  { id: "rhc-001", name: "Wolfe County Primary Care", type: "rhc", county: "Wolfe", countyFips: "21237", lat: 37.744, lng: -83.491, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "rhc-002", name: "Owsley County Primary Care", type: "rhc", county: "Owsley", countyFips: "21189", lat: 37.42, lng: -83.676, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "rhc-003", name: "Lee County Primary Care", type: "rhc", county: "Lee", countyFips: "21129", lat: 37.598, lng: -83.721, broadbandStatus: "unserved", cyberStatus: "unknown" },
  { id: "rhc-004", name: "Menifee County Health Dept", type: "rhc", county: "Menifee", countyFips: "21165", lat: 37.934, lng: -83.614, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "rhc-005", name: "Powell County Primary Care", type: "rhc", county: "Powell", countyFips: "21197", lat: 37.829, lng: -83.818, broadbandStatus: "unserved", cyberStatus: "unknown" },
  { id: "rhc-006", name: "Elliott County Medical Center", type: "rhc", county: "Elliott", countyFips: "21063", lat: 38.111, lng: -83.098, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "rhc-007", name: "Magoffin County Primary Care", type: "rhc", county: "Magoffin", countyFips: "21153", lat: 37.699, lng: -83.053, broadbandStatus: "served", cyberStatus: "unknown" },
  { id: "rhc-008", name: "Edmonson County Health Center", type: "rhc", county: "Edmonson", countyFips: "21061", lat: 37.213, lng: -86.215, broadbandStatus: "underserved", cyberStatus: "unknown" },
  { id: "rhc-009", name: "Nicholas County Primary Care", type: "rhc", county: "Nicholas", countyFips: "21181", lat: 38.294, lng: -84.007, broadbandStatus: "unserved", cyberStatus: "unknown" },
  { id: "rhc-010", name: "Jackson County Medical Clinic", type: "rhc", county: "Jackson", countyFips: "21109", lat: 37.574, lng: -84.001, broadbandStatus: "served", cyberStatus: "unknown" },
];

/* ------------------------------------------------------------------ */
/*  Summary Statistics                                                 */
/* ------------------------------------------------------------------ */

export function getKYFacilitySummary() {
  const total = KY_FACILITIES.length;
  const served = KY_FACILITIES.filter((f) => f.broadbandStatus === "served").length;
  const underserved = KY_FACILITIES.filter((f) => f.broadbandStatus === "underserved").length;
  const unserved = KY_FACILITIES.filter((f) => f.broadbandStatus === "unserved").length;

  const byType = (type: KYFacility["type"]) => {
    const all = KY_FACILITIES.filter((f) => f.type === type);
    return {
      total: all.length,
      served: all.filter((f) => f.broadbandStatus === "served").length,
      underserved: all.filter((f) => f.broadbandStatus === "underserved").length,
      unserved: all.filter((f) => f.broadbandStatus === "unserved").length,
    };
  };

  const cyberAssessed = KY_FACILITIES.filter((f) => f.cyberStatus === "assessed").length;
  const cyberEnrolled = KY_FACILITIES.filter((f) => f.cyberStatus === "enrolled").length;
  const cyberVulnerable = KY_FACILITIES.filter((f) => f.cyberStatus === "vulnerable").length;
  const cyberUnknown = KY_FACILITIES.filter((f) => f.cyberStatus === "unknown").length;

  return {
    total,
    served,
    underserved,
    unserved,
    needsCoverage: underserved + unserved,
    servedPct: Math.round((served / total) * 100),
    underservedPct: Math.round((underserved / total) * 100),
    unservedPct: Math.round((unserved / total) * 100),
    byType: {
      hospital: byType("hospital"),
      cah: byType("cah"),
      fqhc: byType("fqhc"),
      rhc: byType("rhc"),
    },
    cyber: {
      assessed: cyberAssessed,
      enrolled: cyberEnrolled,
      vulnerable: cyberVulnerable,
      unknown: cyberUnknown,
    },
  };
}