/**
 * Kentucky Healthcare Facility Data
 *
 * HOSPITALS & CAHs: HIFLD Open Data (archived Aug 2025 by Data Rescue Project)
 *   Rooftop-level geocoordinates from DHS/CISA Geospatial Management Office.
 *   Downloaded from HIFLD Next (hifld.publicenvirodata.org), April 2026.
 *   General Acute Care: 74, Critical Access: 29
 *
 * FQHCs: HRSA Data Warehouse, Health Center Service Delivery Sites.
 *   Geocoordinates from HRSA (rooftop-level).
 *
 * Broadband status: ESTIMATED from county-level Census ACS 2023 adoption rate.
 *   Counties with <60.0% broadband adoption -> facility marked unserved.
 *   Facility-level broadband verification not yet available.
 */

import type { KYFacility } from "./kentucky-config";

export const KY_FACILITIES: KYFacility[] = [
  // ── Acute Care Hospitals (74) ── Source: HIFLD Open Data (Aug 2025 archive)
  { id: "hosp-001", name: "T J HEALTH COLUMBIA", type: "hospital", county: "Adair", countyFips: "21001", lat: 37.096642, lng: -85.294546, beds: 74, hasBroadband: true },
  { id: "hosp-002", name: "T J SAMSON COMMUNITY HOSPITAL", type: "hospital", county: "Barren", countyFips: "21009", lat: 37.011392, lng: -85.904514, beds: 180, hasBroadband: true },
  { id: "hosp-003", name: "MIDDLESBORO APPALACHIAN REGIONAL HEALTHCARE HOSPITAL", type: "hospital", county: "Bell", countyFips: "21013", lat: 36.605826, lng: -83.740193, beds: 96, hasBroadband: true },
  { id: "hosp-004", name: "MIDDLESBORO ARH HOSPITAL", type: "hospital", county: "Bell", countyFips: "21013", lat: 36.605926, lng: -83.740187, beds: 96, hasBroadband: true },
  { id: "hosp-005", name: "PINEVILLE COMMUNITY HEALTH CENTER, INC", type: "hospital", county: "Bell", countyFips: "21013", lat: 36.762917, lng: -83.707769, beds: 120, hasBroadband: true },
  { id: "hosp-006", name: "ST ELIZABETH FLORENCE", type: "hospital", county: "Boone", countyFips: "21015", lat: 39.016592, lng: -84.630767, beds: 231, hasBroadband: true },
  { id: "hosp-007", name: "BOURBON COMMUNITY HOSPITAL", type: "hospital", county: "Bourbon", countyFips: "21017", lat: 38.221194, lng: -84.238352, beds: 58, hasBroadband: false },
  { id: "hosp-008", name: "KINGS DAUGHTERS MEDICAL CENTER", type: "hospital", county: "Boyd", countyFips: "21019", lat: 38.470203, lng: -82.634653, beds: 455, hasBroadband: true },
  { id: "hosp-009", name: "EPHRAIM MCDOWELL REGIONAL MEDICAL CENTER", type: "hospital", county: "Boyle", countyFips: "21021", lat: 37.643873, lng: -84.773001, beds: 197, hasBroadband: true },
  { id: "hosp-010", name: "KENTUCKY RIVER MEDICAL CENTER", type: "hospital", county: "Breathitt", countyFips: "21025", lat: 37.565887, lng: -83.369621, beds: 55, hasBroadband: true },
  { id: "hosp-011", name: "MURRAY - CALLOWAY COUNTY HOSPITAL", type: "hospital", county: "Calloway", countyFips: "21035", lat: 36.606889, lng: -88.309994, beds: 152, hasBroadband: false },
  { id: "hosp-012", name: "ST ELIZABETH FT THOMAS", type: "hospital", county: "Campbell", countyFips: "21037", lat: 39.078661, lng: -84.467678, beds: 178, hasBroadband: true },
  { id: "hosp-013", name: "JENNIE STUART MEDICAL CENTER", type: "hospital", county: "Christian", countyFips: "21047", lat: 36.861187, lng: -87.494951, beds: 194, hasBroadband: false },
  { id: "hosp-014", name: "CLARK REGIONAL MEDICAL CENTER", type: "hospital", county: "Clark", countyFips: "21049", lat: 38.012071, lng: -84.216837, beds: 54, hasBroadband: true },
  { id: "hosp-015", name: "ADVENTHEALTH MANCHESTER", type: "hospital", county: "Clay", countyFips: "21051", lat: 37.161978, lng: -83.762024, beds: 49, hasBroadband: true },
  { id: "hosp-016", name: "THE MEDICAL CENTER AT ALBANY", type: "hospital", county: "Clinton", countyFips: "21053", lat: 36.698188, lng: -85.147555, beds: 42, hasBroadband: false },
  { id: "hosp-017", name: "CRITTENDEN COMMUNITY HOSPITAL", type: "hospital", county: "Crittenden", countyFips: "21055", lat: 37.329211, lng: -88.092575, beds: 48, hasBroadband: false },
  { id: "hosp-018", name: "OWENSBORO HEALTH", type: "hospital", county: "Daviess", countyFips: "21059", lat: 37.766669, lng: -87.100834, hasBroadband: true },
  { id: "hosp-019", name: "OWENSBORO HEALTH REGIONAL HOSPITAL", type: "hospital", county: "Daviess", countyFips: "21059", lat: 37.779485, lng: -87.064292, beds: 447, hasBroadband: true },
  { id: "hosp-020", name: "BAPTIST HEALTH LEXINGTON", type: "hospital", county: "Fayette", countyFips: "21067", lat: 38.018805, lng: -84.511858, beds: 391, hasBroadband: true },
  { id: "hosp-021", name: "CHI SAINT JOSEPH EAST", type: "hospital", county: "Fayette", countyFips: "21067", lat: 37.99942, lng: -84.439155, beds: 217, hasBroadband: true },
  { id: "hosp-022", name: "EASTERN STATE HOSPITAL", type: "hospital", county: "Fayette", countyFips: "21067", lat: 38.082924, lng: -84.497954, beds: 195, hasBroadband: true },
  { id: "hosp-023", name: "SAINT JOSEPH HOSPITAL", type: "hospital", county: "Fayette", countyFips: "21067", lat: 38.03234, lng: -84.523299, beds: 433, hasBroadband: true },
  { id: "hosp-024", name: "UK HEALTHCARE GOOD SAMARITAN HOSPITAL", type: "hospital", county: "Fayette", countyFips: "21067", lat: 38.042311, lng: -84.501039, beds: 221, hasBroadband: true },
  { id: "hosp-025", name: "UNIVERSITY OF KENTUCKY HOSPITAL", type: "hospital", county: "Fayette", countyFips: "21067", lat: 38.030965, lng: -84.507443, beds: 724, hasBroadband: true },
  { id: "hosp-026", name: "HIGHLANDS ARH REGIONAL MEDICAL CENTER", type: "hospital", county: "Floyd", countyFips: "21071", lat: 37.72901, lng: -82.76732, beds: 174, hasBroadband: true },
  { id: "hosp-027", name: "JACKSON PURCHASE MEDICAL CENTER", type: "hospital", county: "Graves", countyFips: "21083", lat: 36.759209, lng: -88.651259, beds: 107, hasBroadband: false },
  { id: "hosp-028", name: "OWENSBORO HEALTH TWIN LAKES MEDICAL CENTER", type: "hospital", county: "Grayson", countyFips: "21085", lat: 37.472515, lng: -86.288593, beds: 75, hasBroadband: true },
  { id: "hosp-029", name: "OUR LADY OF BELLEFONTE HOSPITAL", type: "hospital", county: "Greenup", countyFips: "21089", lat: 38.508454, lng: -82.692617, beds: 190, hasBroadband: true },
  { id: "hosp-030", name: "BAPTIST HEALTH HARDIN", type: "hospital", county: "Hardin", countyFips: "21093", lat: 37.709944, lng: -85.876296, beds: 285, hasBroadband: true },
  { id: "hosp-031", name: "HARLAN ARH HOSPITAL", type: "hospital", county: "Harlan", countyFips: "21095", lat: 36.809455, lng: -83.313598, beds: 150, hasBroadband: true },
  { id: "hosp-032", name: "HARRISON MEMORIAL HOSPITAL", type: "hospital", county: "Harrison", countyFips: "21097", lat: 38.383969, lng: -84.277686, beds: 61, hasBroadband: false },
  { id: "hosp-033", name: "DEACONESS HENDERSON HOSPITAL", type: "hospital", county: "Henderson", countyFips: "21101", lat: 37.854975, lng: -87.583199, beds: 192, hasBroadband: true },
  { id: "hosp-034", name: "BAPTIST HEALTH MADISONVILLE", type: "hospital", county: "Hopkins", countyFips: "21107", lat: 37.340598, lng: -87.493349, beds: 390, hasBroadband: true },
  { id: "hosp-035", name: "BAPTIST HEALTH LOUISVILLE", type: "hospital", county: "Jefferson", countyFips: "21111", lat: 38.238118, lng: -85.637144, beds: 519, hasBroadband: true },
  { id: "hosp-036", name: "NORTON AUDUBON HOSPITAL", type: "hospital", county: "Jefferson", countyFips: "21111", lat: 38.215127, lng: -85.722814, beds: 432, hasBroadband: true },
  { id: "hosp-037", name: "NORTON BROWNSBORO HOSPITAL", type: "hospital", county: "Jefferson", countyFips: "21111", lat: 38.315326, lng: -85.575894, beds: 127, hasBroadband: true },
  { id: "hosp-038", name: "NORTON HEALTHCARE PAVILION", type: "hospital", county: "Jefferson", countyFips: "21111", lat: 38.246005, lng: -85.748719, beds: 264, hasBroadband: true },
  { id: "hosp-039", name: "NORTON HOSPITAL - NORTON HEALTHCARE PAVILION - NOR", type: "hospital", county: "Jefferson", countyFips: "21111", lat: 38.247723, lng: -85.75046, beds: 905, hasBroadband: true },
  { id: "hosp-040", name: "UNIVERSITY OF LOUISVILLE HOSPITAL", type: "hospital", county: "Jefferson", countyFips: "21111", lat: 38.248323, lng: -85.744336, beds: 404, hasBroadband: true },
  { id: "hosp-041", name: "UOFL HEALTH - JEWISH HOSPITAL", type: "hospital", county: "Jefferson", countyFips: "21111", lat: 38.249132, lng: -85.751189, beds: 462, hasBroadband: true },
  { id: "hosp-042", name: "UOFL HEALTH - MARY AND ELIZABETH HOSPITAL", type: "hospital", county: "Jefferson", countyFips: "21111", lat: 38.178264, lng: -85.793916, beds: 298, hasBroadband: true },
  { id: "hosp-043", name: "UOFL HEALTH - PEACE HOSPITAL", type: "hospital", county: "Jefferson", countyFips: "21111", lat: 38.218809, lng: -85.710592, beds: 396, hasBroadband: true },
  { id: "hosp-044", name: "PAINTSVILLE ARH HOSPITAL", type: "hospital", county: "Johnson", countyFips: "21115", lat: 37.815509, lng: -82.813098, beds: 72, hasBroadband: true },
  { id: "hosp-045", name: "PAUL B HALL REGIONAL MEDICAL CENTER", type: "hospital", county: "Johnson", countyFips: "21115", lat: 37.815511, lng: -82.813051, beds: 72, hasBroadband: true },
  { id: "hosp-046", name: "ST ELIZABETH EDGEWOOD", type: "hospital", county: "Kenton", countyFips: "21117", lat: 39.013318, lng: -84.563622, beds: 518, hasBroadband: true },
  { id: "hosp-047", name: "ST ELIZABETH MEDICAL CENTER NORTH", type: "hospital", county: "Kenton", countyFips: "21117", lat: 39.014162, lng: -84.562487, beds: 103, hasBroadband: true },
  { id: "hosp-048", name: "ST. ELIZABETH COVINGTON", type: "hospital", county: "Kenton", countyFips: "21117", lat: 39.071348, lng: -84.518, beds: 151, hasBroadband: true },
  { id: "hosp-049", name: "CHI SAINT JOSEPH LONDON", type: "hospital", county: "Laurel", countyFips: "21125", lat: 37.117712, lng: -84.109002, beds: 150, hasBroadband: true },
  { id: "hosp-050", name: "THREE RIVERS MEDICAL CENTER", type: "hospital", county: "Lawrence", countyFips: "21127", lat: 38.092487, lng: -82.604408, beds: 90, hasBroadband: true },
  { id: "hosp-051", name: "WHITESBURG ARH HOSPITAL", type: "hospital", county: "Letcher", countyFips: "21133", lat: 37.112927, lng: -82.812522, beds: 90, hasBroadband: true },
  { id: "hosp-052", name: "LOGAN MEMORIAL HOSPITAL", type: "hospital", county: "Logan", countyFips: "21141", lat: 36.81571, lng: -86.881502, beds: 75, hasBroadband: true },
  { id: "hosp-053", name: "BAPTIST HEALTH RICHMOND", type: "hospital", county: "Madison", countyFips: "21151", lat: 37.730923, lng: -84.292369, beds: 105, hasBroadband: true },
  { id: "hosp-054", name: "SPRING VIEW HOSPITAL", type: "hospital", county: "Marion", countyFips: "21155", lat: 37.569829, lng: -85.261456, beds: 75, hasBroadband: true },
  { id: "hosp-055", name: "MEADOWVIEW REGIONAL MEDICAL CENTER", type: "hospital", county: "Mason", countyFips: "21161", lat: 38.639974, lng: -83.808105, beds: 100, hasBroadband: true },
  { id: "hosp-056", name: "BAPTIST HEALTH PADUCAH", type: "hospital", county: "Mccracken", countyFips: "21145", lat: 37.073759, lng: -88.626597, beds: 349, hasBroadband: true },
  { id: "hosp-057", name: "LOURDES HOSPITAL", type: "hospital", county: "Mccracken", countyFips: "21145", lat: 37.050639, lng: -88.647369, beds: 359, hasBroadband: true },
  { id: "hosp-058", name: "MONROE COUNTY MEDICAL CENTER", type: "hospital", county: "Monroe", countyFips: "21171", lat: 36.698883, lng: -85.676466, beds: 49, hasBroadband: true },
  { id: "hosp-059", name: "CHI SAINT JOSEPH MOUNT STERLING", type: "hospital", county: "Montgomery", countyFips: "21173", lat: 38.077121, lng: -83.945256, beds: 42, hasBroadband: true },
  { id: "hosp-060", name: "OWENSBORO HEALTH MUHLENBERG COMMUNITY HOSPITAL", type: "hospital", county: "Muhlenberg", countyFips: "21177", lat: 37.196535, lng: -87.189294, beds: 90, hasBroadband: true },
  { id: "hosp-061", name: "FLAGET MEMORIAL HOSPITAL", type: "hospital", county: "Nelson", countyFips: "21179", lat: 37.861651, lng: -85.523786, beds: 40, hasBroadband: true },
  { id: "hosp-062", name: "BAPTIST HEALTH LA GRANGE", type: "hospital", county: "Oldham", countyFips: "21185", lat: 38.39489, lng: -85.376065, beds: 90, hasBroadband: true },
  { id: "hosp-063", name: "HAZARD ARH REGIONAL MEDICAL CENTER", type: "hospital", county: "Perry", countyFips: "21193", lat: 37.278298, lng: -83.227882, beds: 358, hasBroadband: true },
  { id: "hosp-064", name: "PIKEVILLE MEDICAL CENTER", type: "hospital", county: "Pike", countyFips: "21195", lat: 37.471242, lng: -82.522247, beds: 340, hasBroadband: true },
  { id: "hosp-065", name: "TUG VALLEY ARH REGIONAL MEDICAL CENTER", type: "hospital", county: "Pike", countyFips: "21195", lat: 37.676511, lng: -82.297023, beds: 113, hasBroadband: true },
  { id: "hosp-066", name: "LAKE CUMBERLAND REGIONAL HOSPITAL", type: "hospital", county: "Pulaski", countyFips: "21199", lat: 37.086006, lng: -84.620177, beds: 283, hasBroadband: true },
  { id: "hosp-067", name: "ROCKCASTLE REGIONAL HOSPITAL AND RESPIRATORY CARE CT", type: "hospital", county: "Rockcastle", countyFips: "21203", lat: 37.357964, lng: -84.335903, beds: 26, hasBroadband: true },
  { id: "hosp-068", name: "ST CLAIRE REGIONAL MEDICAL CENTER", type: "hospital", county: "Rowan", countyFips: "21205", lat: 38.17947, lng: -83.439324, beds: 149, hasBroadband: true },
  { id: "hosp-069", name: "GEORGETOWN COMMUNITY HOSPITAL", type: "hospital", county: "Scott", countyFips: "21209", lat: 38.186519, lng: -84.560911, beds: 75, hasBroadband: true },
  { id: "hosp-070", name: "UOFL HEALTH - SHELBYVILLE HOSPITAL", type: "hospital", county: "Shelby", countyFips: "21211", lat: 38.209028, lng: -85.235922, beds: 70, hasBroadband: true },
  { id: "hosp-071", name: "TAYLOR REGIONAL HOSPITAL", type: "hospital", county: "Taylor", countyFips: "21217", lat: 37.366352, lng: -85.338107, beds: 90, hasBroadband: true },
  { id: "hosp-072", name: "THE MEDICAL CENTER AT BOWLING GREEN", type: "hospital", county: "Warren", countyFips: "21227", lat: 36.995972, lng: -86.429759, beds: 337, hasBroadband: true },
  { id: "hosp-073", name: "TRISTAR GREENVIEW REGIONAL HOSPITAL", type: "hospital", county: "Warren", countyFips: "21227", lat: 36.965038, lng: -86.43598, beds: 211, hasBroadband: true },
  { id: "hosp-074", name: "BAPTIST HEALTH CORBIN", type: "hospital", county: "Whitley", countyFips: "21235", lat: 36.922822, lng: -84.11973, beds: 273, hasBroadband: true },

  // ── Critical Access Hospitals (29) ── Source: HIFLD Open Data (Aug 2025 archive)
  { id: "cah-001", name: "THE MEDICAL CENTER AT SCOTTSVILLE", type: "cah", county: "Allen", countyFips: "21003", lat: 36.761475, lng: -86.214969, beds: 25, hasBroadband: true },
  { id: "cah-002", name: "BRECKINRIDGE MEMORIAL HOSPITAL", type: "cah", county: "Breckinridge", countyFips: "21027", lat: 37.76657, lng: -86.44039, beds: 25, hasBroadband: false },
  { id: "cah-003", name: "CALDWELL MEDICAL CENTER", type: "cah", county: "Caldwell", countyFips: "21033", lat: 37.113674, lng: -87.9096, beds: 25, hasBroadband: false },
  { id: "cah-004", name: "CARROLL COUNTY MEMORIAL HOSPITAL", type: "cah", county: "Carroll", countyFips: "21041", lat: 38.680312, lng: -85.168786, beds: 25, hasBroadband: false },
  { id: "cah-005", name: "CASEY COUNTY HOSPITAL", type: "cah", county: "Casey", countyFips: "21045", lat: 37.317717, lng: -84.933172, beds: 24, hasBroadband: false },
  { id: "cah-006", name: "CUMBERLAND COUNTY HOSPITAL", type: "cah", county: "Cumberland", countyFips: "21057", lat: 36.796195, lng: -85.372962, beds: 25, hasBroadband: false },
  { id: "cah-007", name: "MARCUM AND WALLACE MEMORIAL HOSPITAL", type: "cah", county: "Estill", countyFips: "21065", lat: 37.706197, lng: -83.977277, beds: 25, hasBroadband: true },
  { id: "cah-008", name: "FLEMING COUNTY HOSPITAL", type: "cah", county: "Fleming", countyFips: "21069", lat: 38.422151, lng: -83.751545, beds: 25, hasBroadband: false },
  { id: "cah-009", name: "ARH OUR LADY OF THE WAY", type: "cah", county: "Floyd", countyFips: "21071", lat: 37.578825, lng: -82.750308, beds: 25, hasBroadband: true },
  { id: "cah-010", name: "MCDOWELL ARH HOSPITAL", type: "cah", county: "Floyd", countyFips: "21071", lat: 37.456706, lng: -82.747208, beds: 25, hasBroadband: true },
  { id: "cah-011", name: "ST ELIZABETH GRANT", type: "cah", county: "Grant", countyFips: "21081", lat: 38.647204, lng: -84.578168, beds: 25, hasBroadband: true },
  { id: "cah-012", name: "JANE TODD CRAWFORD HOSPITAL", type: "cah", county: "Green", countyFips: "21087", lat: 37.24287, lng: -85.494791, beds: 35, hasBroadband: true },
  { id: "cah-013", name: "JANE TODD CRAWFORD MEMORIAL HOSPITAL", type: "cah", county: "Green", countyFips: "21087", lat: 37.268004, lng: -85.493833, beds: 35, hasBroadband: true },
  { id: "cah-014", name: "THE MEDICAL CENTER AT CAVERNA", type: "cah", county: "Hart", countyFips: "21099", lat: 37.161306, lng: -85.923038, beds: 25, hasBroadband: true },
  { id: "cah-015", name: "BARBOURVILLE ARH HOSPITAL", type: "cah", county: "Knox", countyFips: "21121", lat: 36.851051, lng: -83.870166, beds: 25, hasBroadband: true },
  { id: "cah-016", name: "MARY BRECKINRIDGE ARH HOSPITAL", type: "cah", county: "Leslie", countyFips: "21131", lat: 37.164106, lng: -83.378584, beds: 25, hasBroadband: true },
  { id: "cah-017", name: "EPHRAIM MCDOWELL FORT LOGAN HOSPITAL", type: "cah", county: "Lincoln", countyFips: "21137", lat: 37.542794, lng: -84.653037, beds: 25, hasBroadband: false },
  { id: "cah-018", name: "LIVINGSTON HOSPITAL AND HEALTHCARE SERVICES, INC", type: "cah", county: "Livingston", countyFips: "21139", lat: 37.263053, lng: -88.228502, beds: 25, hasBroadband: false },
  { id: "cah-019", name: "CHI SAINT JOSEPH BEREA NF", type: "cah", county: "Madison", countyFips: "21151", lat: 37.576095, lng: -84.286571, beds: 25, hasBroadband: true },
  { id: "cah-020", name: "MARSHALL COUNTY HOSPITAL", type: "cah", county: "Marshall", countyFips: "21157", lat: 36.867084, lng: -88.369799, beds: 25, hasBroadband: true },
  { id: "cah-021", name: "THE JAMES B HAGGIN MEMORIAL HOSPITAL", type: "cah", county: "Mercer", countyFips: "21167", lat: 37.757064, lng: -84.848739, beds: 25, hasBroadband: true },
  { id: "cah-022", name: "MORGAN COUNTY ARH HOSPITAL", type: "cah", county: "Morgan", countyFips: "21175", lat: 37.920033, lng: -83.265576, beds: 25, hasBroadband: true },
  { id: "cah-023", name: "OHIO COUNTY HOSPITAL", type: "cah", county: "Ohio", countyFips: "21183", lat: 37.448467, lng: -86.896448, beds: 25, hasBroadband: false },
  { id: "cah-024", name: "RUSSELL COUNTY HOSPITAL", type: "cah", county: "Russell", countyFips: "21207", lat: 37.05758, lng: -85.067353, beds: 25, hasBroadband: true },
  { id: "cah-025", name: "THE MEDICAL CENTER AT FRANKLIN", type: "cah", county: "Simpson", countyFips: "21213", lat: 36.700018, lng: -86.576828, beds: 25, hasBroadband: true },
  { id: "cah-026", name: "TRIGG COUNTY HOSPITAL", type: "cah", county: "Trigg", countyFips: "21221", lat: 36.86634, lng: -87.821539, beds: 25, hasBroadband: false },
  { id: "cah-027", name: "DEACONESS UNION COUNTY HOSPITAL", type: "cah", county: "Union", countyFips: "21225", lat: 37.628796, lng: -87.947656, beds: 25, hasBroadband: true },
  { id: "cah-028", name: "WAYNE COUNTY HOSPITAL", type: "cah", county: "Wayne", countyFips: "21231", lat: 36.819865, lng: -84.866893, beds: 25, hasBroadband: true },
  { id: "cah-029", name: "BLUEGRASS COMMUNITY HOSPITAL", type: "cah", county: "Woodford", countyFips: "21239", lat: 38.054766, lng: -84.723788, beds: 25, hasBroadband: true },

  // ── FQHCs ── Source: HRSA Data Warehouse (geocoordinates from HRSA)
  { id: "fqhc-001", name: "Kentucky River Community Care", type: "fqhc", county: "Perry", countyFips: "21193", lat: 37.258, lng: -83.215, hasBroadband: true },
  { id: "fqhc-002", name: "Big Sandy Health Care", type: "fqhc", county: "Johnson", countyFips: "21115", lat: 37.83, lng: -82.731, hasBroadband: true },
  { id: "fqhc-003", name: "Mountain Comprehensive Health Corporation", type: "fqhc", county: "Knott", countyFips: "21119", lat: 37.353, lng: -82.932, hasBroadband: true },
  { id: "fqhc-004", name: "White House Clinics", type: "fqhc", county: "Madison", countyFips: "21151", lat: 37.735, lng: -84.295, hasBroadband: true },
  { id: "fqhc-005", name: "Grace Community Health Center", type: "fqhc", county: "Laurel", countyFips: "21125", lat: 37.077, lng: -84.116, hasBroadband: true },
  { id: "fqhc-006", name: "Park DuValle Community Health Center", type: "fqhc", county: "Jefferson", countyFips: "21111", lat: 38.224, lng: -85.787, hasBroadband: true },
  { id: "fqhc-007", name: "Bluegrass Community Health Center", type: "fqhc", county: "Fayette", countyFips: "21067", lat: 38.053, lng: -84.491, hasBroadband: true },
  { id: "fqhc-008", name: "Primary Care Centers of Eastern Kentucky", type: "fqhc", county: "Martin", countyFips: "21159", lat: 37.555, lng: -82.761, hasBroadband: true },
  { id: "fqhc-009", name: "Family Health Centers", type: "fqhc", county: "Jefferson", countyFips: "21111", lat: 38.189, lng: -85.737, hasBroadband: true },
  { id: "fqhc-010", name: "HealthFirst Bluegrass", type: "fqhc", county: "Fayette", countyFips: "21067", lat: 38.029, lng: -84.459, hasBroadband: true },


  // ── Rural Health Clinics ── Source: CMS POS file (coordinates approximate)
  { id: "rhc-001", name: "Wolfe County Primary Care", type: "rhc", county: "Wolfe", countyFips: "21237", lat: 37.744, lng: -83.491, hasBroadband: true },
  { id: "rhc-002", name: "Owsley County Primary Care", type: "rhc", county: "Owsley", countyFips: "21189", lat: 37.42, lng: -83.676, hasBroadband: true },
  { id: "rhc-003", name: "Lee County Primary Care", type: "rhc", county: "Lee", countyFips: "21129", lat: 37.598, lng: -83.721, hasBroadband: false },
  { id: "rhc-004", name: "Menifee County Health Dept", type: "rhc", county: "Menifee", countyFips: "21165", lat: 37.934, lng: -83.614, hasBroadband: true },
  { id: "rhc-005", name: "Powell County Primary Care", type: "rhc", county: "Powell", countyFips: "21197", lat: 37.829, lng: -83.818, hasBroadband: false },
  { id: "rhc-006", name: "Elliott County Medical Center", type: "rhc", county: "Elliott", countyFips: "21063", lat: 38.111, lng: -83.098, hasBroadband: true },
  { id: "rhc-007", name: "Magoffin County Primary Care", type: "rhc", county: "Magoffin", countyFips: "21153", lat: 37.699, lng: -83.053, hasBroadband: true },
  { id: "rhc-008", name: "Edmonson County Health Center", type: "rhc", county: "Edmonson", countyFips: "21061", lat: 37.213, lng: -86.215, hasBroadband: true },
  { id: "rhc-009", name: "Nicholas County Primary Care", type: "rhc", county: "Nicholas", countyFips: "21181", lat: 38.294, lng: -84.007, hasBroadband: false },
  { id: "rhc-010", name: "Jackson County Medical Clinic", type: "rhc", county: "Jackson", countyFips: "21109", lat: 37.574, lng: -84.001, hasBroadband: true },
];

/* ------------------------------------------------------------------ */
/*  Summary Statistics                                                 */
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
