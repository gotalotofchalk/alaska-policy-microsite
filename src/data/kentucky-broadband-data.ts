/**
 * Kentucky County Broadband Data — ALL 120 COUNTIES
 * Source: U.S. Census Bureau, ACS 2023 5-Year Estimates, Table B28002
 * B28002_001E = total households
 * B28002_007E = households with broadband (excl. cellular-only)
 * Generated: April 14, 2026
 *
 * This file replaces the sample 30-county data in kentucky-facilities.ts.
 * Population estimates derived from household count × 2.45 avg household size.
 */

export interface KYCountyBroadband {
  fips: string;
  name: string;
  population: number;
  households: number;
  broadbandHouseholds: number;
  unservedHouseholds: number;
  pctServed: number;       // broadband adoption rate (0-100)
}

export const KY_COUNTY_BROADBAND: KYCountyBroadband[] = [
  { fips: "21001", name: "Adair County", population: 17116, households: 6986, broadbandHouseholds: 4443, unservedHouseholds: 2543, pctServed: 63.6 },
  { fips: "21003", name: "Allen County", population: 19237, households: 7852, broadbandHouseholds: 4908, unservedHouseholds: 2944, pctServed: 62.5 },
  { fips: "21005", name: "Anderson County", population: 23265, households: 9496, broadbandHouseholds: 5885, unservedHouseholds: 3611, pctServed: 62.0 },
  { fips: "21007", name: "Ballard County", population: 7646, households: 3121, broadbandHouseholds: 1906, unservedHouseholds: 1215, pctServed: 61.1 },
  { fips: "21009", name: "Barren County", population: 44031, households: 17972, broadbandHouseholds: 12744, unservedHouseholds: 5228, pctServed: 70.9 },
  { fips: "21011", name: "Bath County", population: 11620, households: 4743, broadbandHouseholds: 2939, unservedHouseholds: 1804, pctServed: 62.0 },
  { fips: "21013", name: "Bell County", population: 23339, households: 9526, broadbandHouseholds: 6077, unservedHouseholds: 3449, pctServed: 63.8 },
  { fips: "21015", name: "Boone County", population: 123335, households: 50341, broadbandHouseholds: 42331, unservedHouseholds: 8010, pctServed: 84.1 },
  { fips: "21017", name: "Bourbon County", population: 19914, households: 8128, broadbandHouseholds: 4598, unservedHouseholds: 3530, pctServed: 56.6 },
  { fips: "21019", name: "Boyd County", population: 46589, households: 19016, broadbandHouseholds: 13651, unservedHouseholds: 5365, pctServed: 71.8 },
  { fips: "21021", name: "Boyle County", population: 28925, households: 11806, broadbandHouseholds: 7351, unservedHouseholds: 4455, pctServed: 62.3 },
  { fips: "21023", name: "Bracken County", population: 7994, households: 3263, broadbandHouseholds: 1901, unservedHouseholds: 1362, pctServed: 58.3 },
  { fips: "21025", name: "Breathitt County", population: 13553, households: 5532, broadbandHouseholds: 3295, unservedHouseholds: 2237, pctServed: 59.6 },
  { fips: "21027", name: "Breckinridge County", population: 18735, households: 7647, broadbandHouseholds: 4319, unservedHouseholds: 3328, pctServed: 56.5 },
  { fips: "21029", name: "Bullitt County", population: 76991, households: 31425, broadbandHouseholds: 23434, unservedHouseholds: 7991, pctServed: 74.6 },
  { fips: "21031", name: "Butler County", population: 11174, households: 4561, broadbandHouseholds: 1885, unservedHouseholds: 2676, pctServed: 41.3 },
  { fips: "21033", name: "Caldwell County", population: 12708, households: 5187, broadbandHouseholds: 2323, unservedHouseholds: 2864, pctServed: 44.8 },
  { fips: "21035", name: "Calloway County", population: 36961, households: 15086, broadbandHouseholds: 9092, unservedHouseholds: 5994, pctServed: 60.3 },
  { fips: "21037", name: "Campbell County", population: 96118, households: 39232, broadbandHouseholds: 31075, unservedHouseholds: 8157, pctServed: 79.2 },
  { fips: "21039", name: "Carlisle County", population: 4596, households: 1876, broadbandHouseholds: 1097, unservedHouseholds: 779, pctServed: 58.5 },
  { fips: "21041", name: "Carroll County", population: 10013, households: 4087, broadbandHouseholds: 2183, unservedHouseholds: 1904, pctServed: 53.4 },
  { fips: "21043", name: "Carter County", population: 25409, households: 10371, broadbandHouseholds: 6234, unservedHouseholds: 4137, pctServed: 60.1 },
  { fips: "21045", name: "Casey County", population: 15232, households: 6217, broadbandHouseholds: 3331, unservedHouseholds: 2886, pctServed: 53.6 },
  { fips: "21047", name: "Christian County", population: 62906, households: 25676, broadbandHouseholds: 13966, unservedHouseholds: 11710, pctServed: 54.4 },
  { fips: "21049", name: "Clark County", population: 36588, households: 14934, broadbandHouseholds: 10301, unservedHouseholds: 4633, pctServed: 69.0 },
  { fips: "21051", name: "Clay County", population: 17586, households: 7178, broadbandHouseholds: 5160, unservedHouseholds: 2018, pctServed: 71.9 },
  { fips: "21053", name: "Clinton County", population: 9217, households: 3762, broadbandHouseholds: 2049, unservedHouseholds: 1713, pctServed: 54.5 },
  { fips: "21055", name: "Crittenden County", population: 8705, households: 3553, broadbandHouseholds: 1341, unservedHouseholds: 2212, pctServed: 37.7 },
  { fips: "21057", name: "Cumberland County", population: 5954, households: 2430, broadbandHouseholds: 1399, unservedHouseholds: 1031, pctServed: 57.6 },
  { fips: "21059", name: "Daviess County", population: 100835, households: 41157, broadbandHouseholds: 29587, unservedHouseholds: 11570, pctServed: 71.9 },
  { fips: "21061", name: "Edmonson County", population: 12140, households: 4955, broadbandHouseholds: 2894, unservedHouseholds: 2061, pctServed: 58.4 },
  { fips: "21063", name: "Elliott County", population: 5608, households: 2289, broadbandHouseholds: 1540, unservedHouseholds: 749, pctServed: 67.3 },
  { fips: "21065", name: "Estill County", population: 14455, households: 5900, broadbandHouseholds: 3568, unservedHouseholds: 2332, pctServed: 60.5 },
  { fips: "21067", name: "Fayette County", population: 337617, households: 137803, broadbandHouseholds: 109204, unservedHouseholds: 28599, pctServed: 79.2 },
  { fips: "21069", name: "Fleming County", population: 14159, households: 5779, broadbandHouseholds: 3398, unservedHouseholds: 2381, pctServed: 58.8 },
  { fips: "21071", name: "Floyd County", population: 35427, households: 14460, broadbandHouseholds: 9914, unservedHouseholds: 4546, pctServed: 68.6 },
  { fips: "21073", name: "Franklin County", population: 55243, households: 22548, broadbandHouseholds: 14586, unservedHouseholds: 7962, pctServed: 64.7 },
  { fips: "21075", name: "Fulton County", population: 6110, households: 2494, broadbandHouseholds: 1304, unservedHouseholds: 1190, pctServed: 52.3 },
  { fips: "21077", name: "Gallatin County", population: 7963, households: 3250, broadbandHouseholds: 2206, unservedHouseholds: 1044, pctServed: 67.9 },
  { fips: "21079", name: "Garrard County", population: 16231, households: 6625, broadbandHouseholds: 4093, unservedHouseholds: 2532, pctServed: 61.8 },
  { fips: "21081", name: "Grant County", population: 22626, households: 9235, broadbandHouseholds: 6497, unservedHouseholds: 2738, pctServed: 70.4 },
  { fips: "21083", name: "Graves County", population: 34672, households: 14152, broadbandHouseholds: 7647, unservedHouseholds: 6505, pctServed: 54.0 },
  { fips: "21085", name: "Grayson County", population: 23941, households: 9772, broadbandHouseholds: 5824, unservedHouseholds: 3948, pctServed: 59.6 },
  { fips: "21087", name: "Green County", population: 10765, households: 4394, broadbandHouseholds: 2640, unservedHouseholds: 1754, pctServed: 60.1 },
  { fips: "21089", name: "Greenup County", population: 35770, households: 14600, broadbandHouseholds: 9919, unservedHouseholds: 4681, pctServed: 67.9 },
  { fips: "21091", name: "Hancock County", population: 8666, households: 3537, broadbandHouseholds: 1680, unservedHouseholds: 1857, pctServed: 47.5 },
  { fips: "21093", name: "Hardin County", population: 106538, households: 43485, broadbandHouseholds: 32449, unservedHouseholds: 11036, pctServed: 74.6 },
  { fips: "21095", name: "Harlan County", population: 25725, households: 10500, broadbandHouseholds: 7233, unservedHouseholds: 3267, pctServed: 68.9 },
  { fips: "21097", name: "Harrison County", population: 17736, households: 7239, broadbandHouseholds: 2903, unservedHouseholds: 4336, pctServed: 40.1 },
  { fips: "21099", name: "Hart County", population: 17694, households: 7222, broadbandHouseholds: 4867, unservedHouseholds: 2355, pctServed: 67.4 },
  { fips: "21101", name: "Henderson County", population: 45222, households: 18458, broadbandHouseholds: 12333, unservedHouseholds: 6125, pctServed: 66.8 },
  { fips: "21103", name: "Henry County", population: 15060, households: 6147, broadbandHouseholds: 3110, unservedHouseholds: 3037, pctServed: 50.6 },
  { fips: "21105", name: "Hickman County", population: 4018, households: 1640, broadbandHouseholds: 793, unservedHouseholds: 847, pctServed: 48.4 },
  { fips: "21107", name: "Hopkins County", population: 44514, households: 18169, broadbandHouseholds: 11624, unservedHouseholds: 6545, pctServed: 64.0 },
  { fips: "21109", name: "Jackson County", population: 12287, households: 5015, broadbandHouseholds: 3603, unservedHouseholds: 1412, pctServed: 71.8 },
  { fips: "21111", name: "Jefferson County", population: 807010, households: 329392, broadbandHouseholds: 244381, unservedHouseholds: 85011, pctServed: 74.2 },
  { fips: "21113", name: "Jessamine County", population: 48130, households: 19645, broadbandHouseholds: 14948, unservedHouseholds: 4697, pctServed: 76.1 },
  { fips: "21115", name: "Johnson County", population: 21665, households: 8843, broadbandHouseholds: 6835, unservedHouseholds: 2008, pctServed: 77.3 },
  { fips: "21117", name: "Kenton County", population: 165603, households: 67593, broadbandHouseholds: 54635, unservedHouseholds: 12958, pctServed: 80.8 },
  { fips: "21119", name: "Knott County", population: 13348, households: 5448, broadbandHouseholds: 3964, unservedHouseholds: 1484, pctServed: 72.8 },
  { fips: "21121", name: "Knox County", population: 27749, households: 11326, broadbandHouseholds: 8226, unservedHouseholds: 3100, pctServed: 72.6 },
  { fips: "21123", name: "Larue County", population: 14617, households: 5966, broadbandHouseholds: 4067, unservedHouseholds: 1899, pctServed: 68.2 },
  { fips: "21125", name: "Laurel County", population: 58396, households: 23835, broadbandHouseholds: 17797, unservedHouseholds: 6038, pctServed: 74.7 },
  { fips: "21127", name: "Lawrence County", population: 15068, households: 6150, broadbandHouseholds: 4488, unservedHouseholds: 1662, pctServed: 73.0 },
  { fips: "21129", name: "Lee County", population: 6385, households: 2606, broadbandHouseholds: 1109, unservedHouseholds: 1497, pctServed: 42.6 },
  { fips: "21131", name: "Leslie County", population: 9577, households: 3909, broadbandHouseholds: 2716, unservedHouseholds: 1193, pctServed: 69.5 },
  { fips: "21133", name: "Letcher County", population: 20499, households: 8367, broadbandHouseholds: 5934, unservedHouseholds: 2433, pctServed: 70.9 },
  { fips: "21135", name: "Lewis County", population: 12017, households: 4905, broadbandHouseholds: 3122, unservedHouseholds: 1783, pctServed: 63.6 },
  { fips: "21137", name: "Lincoln County", population: 23726, households: 9684, broadbandHouseholds: 4753, unservedHouseholds: 4931, pctServed: 49.1 },
  { fips: "21139", name: "Livingston County", population: 8580, households: 3502, broadbandHouseholds: 1796, unservedHouseholds: 1706, pctServed: 51.3 },
  { fips: "21141", name: "Logan County", population: 26759, households: 10922, broadbandHouseholds: 6354, unservedHouseholds: 4568, pctServed: 58.2 },
  { fips: "21143", name: "Lyon County", population: 8122, households: 3315, broadbandHouseholds: 1539, unservedHouseholds: 1776, pctServed: 46.4 },
  { fips: "21151", name: "Madison County", population: 89969, households: 36722, broadbandHouseholds: 25366, unservedHouseholds: 11356, pctServed: 69.1 },
  { fips: "21153", name: "Magoffin County", population: 11182, households: 4564, broadbandHouseholds: 3557, unservedHouseholds: 1007, pctServed: 77.9 },
  { fips: "21155", name: "Marion County", population: 18596, households: 7590, broadbandHouseholds: 4988, unservedHouseholds: 2602, pctServed: 65.7 },
  { fips: "21157", name: "Marshall County", population: 32218, households: 13150, broadbandHouseholds: 8377, unservedHouseholds: 4773, pctServed: 63.7 },
  { fips: "21159", name: "Martin County", population: 9641, households: 3935, broadbandHouseholds: 2528, unservedHouseholds: 1407, pctServed: 64.2 },
  { fips: "21161", name: "Mason County", population: 16971, households: 6927, broadbandHouseholds: 4150, unservedHouseholds: 2777, pctServed: 59.9 },
  { fips: "21145", name: "McCracken County", population: 66853, households: 27287, broadbandHouseholds: 18290, unservedHouseholds: 8997, pctServed: 67.0 },
  { fips: "21147", name: "McCreary County", population: 13708, households: 5595, broadbandHouseholds: 4047, unservedHouseholds: 1548, pctServed: 72.3 },
  { fips: "21149", name: "McLean County", population: 8840, households: 3608, broadbandHouseholds: 1935, unservedHouseholds: 1673, pctServed: 53.6 },
  { fips: "21163", name: "Meade County", population: 26455, households: 10798, broadbandHouseholds: 8039, unservedHouseholds: 2759, pctServed: 74.4 },
  { fips: "21165", name: "Menifee County", population: 5848, households: 2387, broadbandHouseholds: 1413, unservedHouseholds: 974, pctServed: 59.2 },
  { fips: "21167", name: "Mercer County", population: 22386, households: 9137, broadbandHouseholds: 5755, unservedHouseholds: 3382, pctServed: 63.0 },
  { fips: "21169", name: "Metcalfe County", population: 10400, households: 4245, broadbandHouseholds: 3071, unservedHouseholds: 1174, pctServed: 72.3 },
  { fips: "21171", name: "Monroe County", population: 11236, households: 4586, broadbandHouseholds: 2931, unservedHouseholds: 1655, pctServed: 63.9 },
  { fips: "21173", name: "Montgomery County", population: 26828, households: 10950, broadbandHouseholds: 6661, unservedHouseholds: 4289, pctServed: 60.8 },
  { fips: "21175", name: "Morgan County", population: 11630, households: 4747, broadbandHouseholds: 3355, unservedHouseholds: 1392, pctServed: 70.7 },
  { fips: "21177", name: "Muhlenberg County", population: 29246, households: 11937, broadbandHouseholds: 7175, unservedHouseholds: 4762, pctServed: 60.1 },
  { fips: "21179", name: "Nelson County", population: 46028, households: 18787, broadbandHouseholds: 12714, unservedHouseholds: 6073, pctServed: 67.7 },
  { fips: "21181", name: "Nicholas County", population: 6725, households: 2745, broadbandHouseholds: 900, unservedHouseholds: 1845, pctServed: 32.8 },
  { fips: "21183", name: "Ohio County", population: 22430, households: 9155, broadbandHouseholds: 4306, unservedHouseholds: 4849, pctServed: 47.0 },
  { fips: "21185", name: "Oldham County", population: 55020, households: 22457, broadbandHouseholds: 18970, unservedHouseholds: 3487, pctServed: 84.5 },
  { fips: "21187", name: "Owen County", population: 10439, households: 4261, broadbandHouseholds: 1863, unservedHouseholds: 2398, pctServed: 43.7 },
  { fips: "21189", name: "Owsley County", population: 3690, households: 1506, broadbandHouseholds: 991, unservedHouseholds: 515, pctServed: 65.8 },
  { fips: "21191", name: "Pendleton County", population: 13066, households: 5333, broadbandHouseholds: 3064, unservedHouseholds: 2269, pctServed: 57.5 },
  { fips: "21193", name: "Perry County", population: 27668, households: 11293, broadbandHouseholds: 8510, unservedHouseholds: 2783, pctServed: 75.4 },
  { fips: "21195", name: "Pike County", population: 59900, households: 24449, broadbandHouseholds: 16401, unservedHouseholds: 8048, pctServed: 67.1 },
  { fips: "21197", name: "Powell County", population: 11341, households: 4629, broadbandHouseholds: 1959, unservedHouseholds: 2670, pctServed: 42.3 },
  { fips: "21199", name: "Pulaski County", population: 63504, households: 25920, broadbandHouseholds: 17927, unservedHouseholds: 7993, pctServed: 69.2 },
  { fips: "21201", name: "Robertson County", population: 1938, households: 791, broadbandHouseholds: 247, unservedHouseholds: 544, pctServed: 31.2 },
  { fips: "21203", name: "Rockcastle County", population: 15749, households: 6428, broadbandHouseholds: 4016, unservedHouseholds: 2412, pctServed: 62.5 },
  { fips: "21205", name: "Rowan County", population: 22895, households: 9345, broadbandHouseholds: 7006, unservedHouseholds: 2339, pctServed: 75.0 },
  { fips: "21207", name: "Russell County", population: 17664, households: 7210, broadbandHouseholds: 4945, unservedHouseholds: 2265, pctServed: 68.6 },
  { fips: "21209", name: "Scott County", population: 54192, households: 22119, broadbandHouseholds: 15198, unservedHouseholds: 6921, pctServed: 68.7 },
  { fips: "21211", name: "Shelby County", population: 43732, households: 17850, broadbandHouseholds: 12006, unservedHouseholds: 5844, pctServed: 67.3 },
  { fips: "21213", name: "Simpson County", population: 18838, households: 7689, broadbandHouseholds: 5080, unservedHouseholds: 2609, pctServed: 66.1 },
  { fips: "21215", name: "Spencer County", population: 17302, households: 7062, broadbandHouseholds: 4534, unservedHouseholds: 2528, pctServed: 64.2 },
  { fips: "21217", name: "Taylor County", population: 24610, households: 10045, broadbandHouseholds: 6692, unservedHouseholds: 3353, pctServed: 66.6 },
  { fips: "21219", name: "Todd County", population: 10863, households: 4434, broadbandHouseholds: 2099, unservedHouseholds: 2335, pctServed: 47.3 },
  { fips: "21221", name: "Trigg County", population: 14729, households: 6012, broadbandHouseholds: 2689, unservedHouseholds: 3323, pctServed: 44.7 },
  { fips: "21223", name: "Trimble County", population: 8029, households: 3277, broadbandHouseholds: 1578, unservedHouseholds: 1699, pctServed: 48.2 },
  { fips: "21225", name: "Union County", population: 12564, households: 5128, broadbandHouseholds: 3040, unservedHouseholds: 2088, pctServed: 59.3 },
  { fips: "21227", name: "Warren County", population: 132810, households: 54208, broadbandHouseholds: 39353, unservedHouseholds: 14855, pctServed: 72.6 },
  { fips: "21229", name: "Washington County", population: 11392, households: 4650, broadbandHouseholds: 2146, unservedHouseholds: 2504, pctServed: 46.2 },
  { fips: "21231", name: "Wayne County", population: 19669, households: 8028, broadbandHouseholds: 5322, unservedHouseholds: 2706, pctServed: 66.3 },
  { fips: "21233", name: "Webster County", population: 12054, households: 4920, broadbandHouseholds: 2661, unservedHouseholds: 2259, pctServed: 54.1 },
  { fips: "21235", name: "Whitley County", population: 33246, households: 13570, broadbandHouseholds: 8799, unservedHouseholds: 4771, pctServed: 64.8 },
  { fips: "21237", name: "Wolfe County", population: 6235, households: 2545, broadbandHouseholds: 1834, unservedHouseholds: 711, pctServed: 72.1 },
  { fips: "21239", name: "Woodford County", population: 26320, households: 10743, broadbandHouseholds: 7744, unservedHouseholds: 2999, pctServed: 72.1 },
];

/* ------------------------------------------------------------------ */
/*  Summary function (matches existing page interface)                  */
/* ------------------------------------------------------------------ */

export function getKYBroadbandSummary() {
  const totalUnserved = KY_COUNTY_BROADBAND.reduce((s, c) => s + c.unservedHouseholds, 0);
  const totalHouseholds = KY_COUNTY_BROADBAND.reduce((s, c) => s + c.households, 0);
  const totalBroadband = KY_COUNTY_BROADBAND.reduce((s, c) => s + c.broadbandHouseholds, 0);
  const totalPop = KY_COUNTY_BROADBAND.reduce((s, c) => s + c.population, 0);
  const avgServedPct = Math.round((totalBroadband / totalHouseholds) * 100);

  return {
    countiesTracked: KY_COUNTY_BROADBAND.length,
    avgServedPct,
    totalUnserved: totalUnserved,
    totalHouseholds,
    totalPop,
    source: "U.S. Census Bureau, ACS 2023 5-Year Estimates, Table B28002",
  };
}

/**
 * Lookup broadband data by county FIPS code.
 * Use this for the choropleth map — join to GeoJSON GEOID property.
 */
export function getCountyByFips(fips: string): KYCountyBroadband | undefined {
  return KY_COUNTY_BROADBAND.find((c) => c.fips === fips);
}
