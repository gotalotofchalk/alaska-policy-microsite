/**
 * Kentucky County Broadband Data — ALL 120 COUNTIES
 * Source: U.S. Census Bureau, ACS 2024 5-Year Estimates, Table B28002
 * B28002_001E = total households
 * B28002_007E = households with broadband (excl. cellular-only)
 * Generated: 2026-04-15
 *
 * Upgraded from ACS 2023 5-Year to ACS 2024 5-Year.
 * Population estimates derived from household count x 2.45 avg household size.
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
  { fips: "21001", name: "Adair County, Kentucky", population: 17483, households: 7136, broadbandHouseholds: 4604, unservedHouseholds: 2532, pctServed: 64.5 },
  { fips: "21003", name: "Allen County, Kentucky", population: 19686, households: 8035, broadbandHouseholds: 5280, unservedHouseholds: 2755, pctServed: 65.7 },
  { fips: "21005", name: "Anderson County, Kentucky", population: 23650, households: 9653, broadbandHouseholds: 5871, unservedHouseholds: 3782, pctServed: 60.8 },
  { fips: "21007", name: "Ballard County, Kentucky", population: 7862, households: 3209, broadbandHouseholds: 2170, unservedHouseholds: 1039, pctServed: 67.6 },
  { fips: "21009", name: "Barren County, Kentucky", population: 44142, households: 18017, broadbandHouseholds: 13478, unservedHouseholds: 4539, pctServed: 74.8 },
  { fips: "21011", name: "Bath County, Kentucky", population: 11510, households: 4698, broadbandHouseholds: 2906, unservedHouseholds: 1792, pctServed: 61.9 },
  { fips: "21013", name: "Bell County, Kentucky", population: 24351, households: 9939, broadbandHouseholds: 6522, unservedHouseholds: 3417, pctServed: 65.6 },
  { fips: "21015", name: "Boone County, Kentucky", population: 124859, households: 50963, broadbandHouseholds: 43708, unservedHouseholds: 7255, pctServed: 85.8 },
  { fips: "21017", name: "Bourbon County, Kentucky", population: 19928, households: 8134, broadbandHouseholds: 4726, unservedHouseholds: 3408, pctServed: 58.1 },
  { fips: "21019", name: "Boyd County, Kentucky", population: 47307, households: 19309, broadbandHouseholds: 13858, unservedHouseholds: 5451, pctServed: 71.8 },
  { fips: "21021", name: "Boyle County, Kentucky", population: 29510, households: 12045, broadbandHouseholds: 7404, unservedHouseholds: 4641, pctServed: 61.5 },
  { fips: "21023", name: "Bracken County, Kentucky", population: 8242, households: 3364, broadbandHouseholds: 2070, unservedHouseholds: 1294, pctServed: 61.5 },
  { fips: "21025", name: "Breathitt County, Kentucky", population: 13387, households: 5464, broadbandHouseholds: 3378, unservedHouseholds: 2086, pctServed: 61.8 },
  { fips: "21027", name: "Breckinridge County, Kentucky", population: 19769, households: 8069, broadbandHouseholds: 4797, unservedHouseholds: 3272, pctServed: 59.4 },
  { fips: "21029", name: "Bullitt County, Kentucky", population: 77780, households: 31747, broadbandHouseholds: 24321, unservedHouseholds: 7426, pctServed: 76.6 },
  { fips: "21031", name: "Butler County, Kentucky", population: 11189, households: 4567, broadbandHouseholds: 2002, unservedHouseholds: 2565, pctServed: 43.8 },
  { fips: "21033", name: "Caldwell County, Kentucky", population: 12311, households: 5025, broadbandHouseholds: 2370, unservedHouseholds: 2655, pctServed: 47.2 },
  { fips: "21035", name: "Calloway County, Kentucky", population: 37336, households: 15239, broadbandHouseholds: 8955, unservedHouseholds: 6284, pctServed: 58.8 },
  { fips: "21037", name: "Campbell County, Kentucky", population: 96118, households: 39232, broadbandHouseholds: 32160, unservedHouseholds: 7072, pctServed: 82 },
  { fips: "21039", name: "Carlisle County, Kentucky", population: 4569, households: 1865, broadbandHouseholds: 1133, unservedHouseholds: 732, pctServed: 60.8 },
  { fips: "21041", name: "Carroll County, Kentucky", population: 10236, households: 4178, broadbandHouseholds: 2382, unservedHouseholds: 1796, pctServed: 57 },
  { fips: "21043", name: "Carter County, Kentucky", population: 26445, households: 10794, broadbandHouseholds: 6540, unservedHouseholds: 4254, pctServed: 60.6 },
  { fips: "21045", name: "Casey County, Kentucky", population: 15881, households: 6482, broadbandHouseholds: 3461, unservedHouseholds: 3021, pctServed: 53.4 },
  { fips: "21047", name: "Christian County, Kentucky", population: 63026, households: 25725, broadbandHouseholds: 14568, unservedHouseholds: 11157, pctServed: 56.6 },
  { fips: "21049", name: "Clark County, Kentucky", population: 36885, households: 15055, broadbandHouseholds: 10810, unservedHouseholds: 4245, pctServed: 71.8 },
  { fips: "21051", name: "Clay County, Kentucky", population: 17856, households: 7288, broadbandHouseholds: 5201, unservedHouseholds: 2087, pctServed: 71.4 },
  { fips: "21053", name: "Clinton County, Kentucky", population: 9442, households: 3854, broadbandHouseholds: 2017, unservedHouseholds: 1837, pctServed: 52.3 },
  { fips: "21055", name: "Crittenden County, Kentucky", population: 8680, households: 3543, broadbandHouseholds: 1458, unservedHouseholds: 2085, pctServed: 41.2 },
  { fips: "21057", name: "Cumberland County, Kentucky", population: 6444, households: 2630, broadbandHouseholds: 1546, unservedHouseholds: 1084, pctServed: 58.8 },
  { fips: "21059", name: "Daviess County, Kentucky", population: 102016, households: 41639, broadbandHouseholds: 30262, unservedHouseholds: 11377, pctServed: 72.7 },
  { fips: "21061", name: "Edmonson County, Kentucky", population: 12493, households: 5099, broadbandHouseholds: 3068, unservedHouseholds: 2031, pctServed: 60.2 },
  { fips: "21063", name: "Elliott County, Kentucky", population: 5978, households: 2440, broadbandHouseholds: 1926, unservedHouseholds: 514, pctServed: 78.9 },
  { fips: "21065", name: "Estill County, Kentucky", population: 14639, households: 5975, broadbandHouseholds: 3823, unservedHouseholds: 2152, pctServed: 64 },
  { fips: "21067", name: "Fayette County, Kentucky", population: 342302, households: 139715, broadbandHouseholds: 111473, unservedHouseholds: 28242, pctServed: 79.8 },
  { fips: "21069", name: "Fleming County, Kentucky", population: 14355, households: 5859, broadbandHouseholds: 3337, unservedHouseholds: 2522, pctServed: 57 },
  { fips: "21071", name: "Floyd County, Kentucky", population: 36015, households: 14700, broadbandHouseholds: 9932, unservedHouseholds: 4768, pctServed: 67.6 },
  { fips: "21073", name: "Franklin County, Kentucky", population: 55659, households: 22718, broadbandHouseholds: 14765, unservedHouseholds: 7953, pctServed: 65 },
  { fips: "21075", name: "Fulton County, Kentucky", population: 6248, households: 2550, broadbandHouseholds: 1537, unservedHouseholds: 1013, pctServed: 60.3 },
  { fips: "21077", name: "Gallatin County, Kentucky", population: 7999, households: 3265, broadbandHouseholds: 2377, unservedHouseholds: 888, pctServed: 72.8 },
  { fips: "21079", name: "Garrard County, Kentucky", population: 16403, households: 6695, broadbandHouseholds: 4120, unservedHouseholds: 2575, pctServed: 61.5 },
  { fips: "21081", name: "Grant County, Kentucky", population: 22599, households: 9224, broadbandHouseholds: 6613, unservedHouseholds: 2611, pctServed: 71.7 },
  { fips: "21083", name: "Graves County, Kentucky", population: 34641, households: 14139, broadbandHouseholds: 8236, unservedHouseholds: 5903, pctServed: 58.3 },
  { fips: "21085", name: "Grayson County, Kentucky", population: 24816, households: 10129, broadbandHouseholds: 6499, unservedHouseholds: 3630, pctServed: 64.2 },
  { fips: "21087", name: "Green County, Kentucky", population: 10831, households: 4421, broadbandHouseholds: 2961, unservedHouseholds: 1460, pctServed: 67 },
  { fips: "21089", name: "Greenup County, Kentucky", population: 36111, households: 14739, broadbandHouseholds: 10278, unservedHouseholds: 4461, pctServed: 69.7 },
  { fips: "21091", name: "Hancock County, Kentucky", population: 8913, households: 3638, broadbandHouseholds: 1814, unservedHouseholds: 1824, pctServed: 49.9 },
  { fips: "21093", name: "Hardin County, Kentucky", population: 109324, households: 44622, broadbandHouseholds: 33493, unservedHouseholds: 11129, pctServed: 75.1 },
  { fips: "21095", name: "Harlan County, Kentucky", population: 26291, households: 10731, broadbandHouseholds: 7482, unservedHouseholds: 3249, pctServed: 69.7 },
  { fips: "21097", name: "Harrison County, Kentucky", population: 17868, households: 7293, broadbandHouseholds: 3198, unservedHouseholds: 4095, pctServed: 43.9 },
  { fips: "21099", name: "Hart County, Kentucky", population: 18071, households: 7376, broadbandHouseholds: 4980, unservedHouseholds: 2396, pctServed: 67.5 },
  { fips: "21101", name: "Henderson County, Kentucky", population: 45379, households: 18522, broadbandHouseholds: 12681, unservedHouseholds: 5841, pctServed: 68.5 },
  { fips: "21103", name: "Henry County, Kentucky", population: 15060, households: 6147, broadbandHouseholds: 3274, unservedHouseholds: 2873, pctServed: 53.3 },
  { fips: "21105", name: "Hickman County, Kentucky", population: 4241, households: 1731, broadbandHouseholds: 981, unservedHouseholds: 750, pctServed: 56.7 },
  { fips: "21107", name: "Hopkins County, Kentucky", population: 45073, households: 18397, broadbandHouseholds: 11983, unservedHouseholds: 6414, pctServed: 65.1 },
  { fips: "21109", name: "Jackson County, Kentucky", population: 12549, households: 5122, broadbandHouseholds: 3554, unservedHouseholds: 1568, pctServed: 69.4 },
  { fips: "21111", name: "Jefferson County, Kentucky", population: 812307, households: 331554, broadbandHouseholds: 250015, unservedHouseholds: 81539, pctServed: 75.4 },
  { fips: "21113", name: "Jessamine County, Kentucky", population: 48787, households: 19913, broadbandHouseholds: 14944, unservedHouseholds: 4969, pctServed: 75 },
  { fips: "21115", name: "Johnson County, Kentucky", population: 22148, households: 9040, broadbandHouseholds: 7180, unservedHouseholds: 1860, pctServed: 79.4 },
  { fips: "21117", name: "Kenton County, Kentucky", population: 165049, households: 67367, broadbandHouseholds: 55289, unservedHouseholds: 12078, pctServed: 82.1 },
  { fips: "21119", name: "Knott County, Kentucky", population: 13526, households: 5521, broadbandHouseholds: 4097, unservedHouseholds: 1424, pctServed: 74.2 },
  { fips: "21121", name: "Knox County, Kentucky", population: 28692, households: 11711, broadbandHouseholds: 8744, unservedHouseholds: 2967, pctServed: 74.7 },
  { fips: "21123", name: "Larue County, Kentucky", population: 14690, households: 5996, broadbandHouseholds: 3995, unservedHouseholds: 2001, pctServed: 66.6 },
  { fips: "21125", name: "Laurel County, Kentucky", population: 58790, households: 23996, broadbandHouseholds: 18469, unservedHouseholds: 5527, pctServed: 77 },
  { fips: "21127", name: "Lawrence County, Kentucky", population: 15538, households: 6342, broadbandHouseholds: 4825, unservedHouseholds: 1517, pctServed: 76.1 },
  { fips: "21129", name: "Lee County, Kentucky", population: 6358, households: 2595, broadbandHouseholds: 1242, unservedHouseholds: 1353, pctServed: 47.9 },
  { fips: "21131", name: "Leslie County, Kentucky", population: 10366, households: 4231, broadbandHouseholds: 3152, unservedHouseholds: 1079, pctServed: 74.5 },
  { fips: "21133", name: "Letcher County, Kentucky", population: 20734, households: 8463, broadbandHouseholds: 6142, unservedHouseholds: 2321, pctServed: 72.6 },
  { fips: "21135", name: "Lewis County, Kentucky", population: 12297, households: 5019, broadbandHouseholds: 3373, unservedHouseholds: 1646, pctServed: 67.2 },
  { fips: "21137", name: "Lincoln County, Kentucky", population: 23777, households: 9705, broadbandHouseholds: 4626, unservedHouseholds: 5079, pctServed: 47.7 },
  { fips: "21139", name: "Livingston County, Kentucky", population: 8827, households: 3603, broadbandHouseholds: 1971, unservedHouseholds: 1632, pctServed: 54.7 },
  { fips: "21141", name: "Logan County, Kentucky", population: 26962, households: 11005, broadbandHouseholds: 6809, unservedHouseholds: 4196, pctServed: 61.9 },
  { fips: "21143", name: "Lyon County, Kentucky", population: 8377, households: 3419, broadbandHouseholds: 1561, unservedHouseholds: 1858, pctServed: 45.7 },
  { fips: "21145", name: "McCracken County, Kentucky", population: 67622, households: 27601, broadbandHouseholds: 18399, unservedHouseholds: 9202, pctServed: 66.7 },
  { fips: "21147", name: "McCreary County, Kentucky", population: 14359, households: 5861, broadbandHouseholds: 4348, unservedHouseholds: 1513, pctServed: 74.2 },
  { fips: "21149", name: "McLean County, Kentucky", population: 8920, households: 3641, broadbandHouseholds: 2132, unservedHouseholds: 1509, pctServed: 58.6 },
  { fips: "21151", name: "Madison County, Kentucky", population: 90775, households: 37051, broadbandHouseholds: 25933, unservedHouseholds: 11118, pctServed: 70 },
  { fips: "21153", name: "Magoffin County, Kentucky", population: 11598, households: 4734, broadbandHouseholds: 3521, unservedHouseholds: 1213, pctServed: 74.4 },
  { fips: "21155", name: "Marion County, Kentucky", population: 18924, households: 7724, broadbandHouseholds: 5195, unservedHouseholds: 2529, pctServed: 67.3 },
  { fips: "21157", name: "Marshall County, Kentucky", population: 32362, households: 13209, broadbandHouseholds: 8530, unservedHouseholds: 4679, pctServed: 64.6 },
  { fips: "21159", name: "Martin County, Kentucky", population: 9442, households: 3854, broadbandHouseholds: 2559, unservedHouseholds: 1295, pctServed: 66.4 },
  { fips: "21161", name: "Mason County, Kentucky", population: 17471, households: 7131, broadbandHouseholds: 4279, unservedHouseholds: 2852, pctServed: 60 },
  { fips: "21163", name: "Meade County, Kentucky", population: 26967, households: 11007, broadbandHouseholds: 8525, unservedHouseholds: 2482, pctServed: 77.5 },
  { fips: "21165", name: "Menifee County, Kentucky", population: 6071, households: 2478, broadbandHouseholds: 1571, unservedHouseholds: 907, pctServed: 63.4 },
  { fips: "21167", name: "Mercer County, Kentucky", population: 22493, households: 9181, broadbandHouseholds: 5729, unservedHouseholds: 3452, pctServed: 62.4 },
  { fips: "21169", name: "Metcalfe County, Kentucky", population: 10045, households: 4100, broadbandHouseholds: 2993, unservedHouseholds: 1107, pctServed: 73 },
  { fips: "21171", name: "Monroe County, Kentucky", population: 11380, households: 4645, broadbandHouseholds: 3024, unservedHouseholds: 1621, pctServed: 65.1 },
  { fips: "21173", name: "Montgomery County, Kentucky", population: 26962, households: 11005, broadbandHouseholds: 6891, unservedHouseholds: 4114, pctServed: 62.6 },
  { fips: "21175", name: "Morgan County, Kentucky", population: 11961, households: 4882, broadbandHouseholds: 3607, unservedHouseholds: 1275, pctServed: 73.9 },
  { fips: "21177", name: "Muhlenberg County, Kentucky", population: 29701, households: 12123, broadbandHouseholds: 7351, unservedHouseholds: 4772, pctServed: 60.6 },
  { fips: "21179", name: "Nelson County, Kentucky", population: 46918, households: 19150, broadbandHouseholds: 12961, unservedHouseholds: 6189, pctServed: 67.7 },
  { fips: "21181", name: "Nicholas County, Kentucky", population: 6801, households: 2776, broadbandHouseholds: 1010, unservedHouseholds: 1766, pctServed: 36.4 },
  { fips: "21183", name: "Ohio County, Kentucky", population: 22312, households: 9107, broadbandHouseholds: 4544, unservedHouseholds: 4563, pctServed: 49.9 },
  { fips: "21185", name: "Oldham County, Kentucky", population: 56411, households: 23025, broadbandHouseholds: 19456, unservedHouseholds: 3569, pctServed: 84.5 },
  { fips: "21187", name: "Owen County, Kentucky", population: 10417, households: 4252, broadbandHouseholds: 2146, unservedHouseholds: 2106, pctServed: 50.5 },
  { fips: "21189", name: "Owsley County, Kentucky", population: 3839, households: 1567, broadbandHouseholds: 995, unservedHouseholds: 572, pctServed: 63.5 },
  { fips: "21191", name: "Pendleton County, Kentucky", population: 13333, households: 5442, broadbandHouseholds: 3632, unservedHouseholds: 1810, pctServed: 66.7 },
  { fips: "21193", name: "Perry County, Kentucky", population: 27141, households: 11078, broadbandHouseholds: 8511, unservedHouseholds: 2567, pctServed: 76.8 },
  { fips: "21195", name: "Pike County, Kentucky", population: 59496, households: 24284, broadbandHouseholds: 16447, unservedHouseholds: 7837, pctServed: 67.7 },
  { fips: "21197", name: "Powell County, Kentucky", population: 11736, households: 4790, broadbandHouseholds: 2317, unservedHouseholds: 2473, pctServed: 48.4 },
  { fips: "21199", name: "Pulaski County, Kentucky", population: 64215, households: 26210, broadbandHouseholds: 18199, unservedHouseholds: 8011, pctServed: 69.4 },
  { fips: "21201", name: "Robertson County, Kentucky", population: 1985, households: 810, broadbandHouseholds: 313, unservedHouseholds: 497, pctServed: 38.6 },
  { fips: "21203", name: "Rockcastle County, Kentucky", population: 16008, households: 6534, broadbandHouseholds: 4064, unservedHouseholds: 2470, pctServed: 62.2 },
  { fips: "21205", name: "Rowan County, Kentucky", population: 23500, households: 9592, broadbandHouseholds: 7372, unservedHouseholds: 2220, pctServed: 76.9 },
  { fips: "21207", name: "Russell County, Kentucky", population: 18527, households: 7562, broadbandHouseholds: 5341, unservedHouseholds: 2221, pctServed: 70.6 },
  { fips: "21209", name: "Scott County, Kentucky", population: 55473, households: 22642, broadbandHouseholds: 15977, unservedHouseholds: 6665, pctServed: 70.6 },
  { fips: "21211", name: "Shelby County, Kentucky", population: 45286, households: 18484, broadbandHouseholds: 12476, unservedHouseholds: 6008, pctServed: 67.5 },
  { fips: "21213", name: "Simpson County, Kentucky", population: 19661, households: 8025, broadbandHouseholds: 5549, unservedHouseholds: 2476, pctServed: 69.1 },
  { fips: "21215", name: "Spencer County, Kentucky", population: 17905, households: 7308, broadbandHouseholds: 4996, unservedHouseholds: 2312, pctServed: 68.4 },
  { fips: "21217", name: "Taylor County, Kentucky", population: 25137, households: 10260, broadbandHouseholds: 7045, unservedHouseholds: 3215, pctServed: 68.7 },
  { fips: "21219", name: "Todd County, Kentucky", population: 11170, households: 4559, broadbandHouseholds: 2269, unservedHouseholds: 2290, pctServed: 49.8 },
  { fips: "21221", name: "Trigg County, Kentucky", population: 14847, households: 6060, broadbandHouseholds: 2758, unservedHouseholds: 3302, pctServed: 45.5 },
  { fips: "21223", name: "Trimble County, Kentucky", population: 8286, households: 3382, broadbandHouseholds: 1670, unservedHouseholds: 1712, pctServed: 49.4 },
  { fips: "21225", name: "Union County, Kentucky", population: 12735, households: 5198, broadbandHouseholds: 3249, unservedHouseholds: 1949, pctServed: 62.5 },
  { fips: "21227", name: "Warren County, Kentucky", population: 136325, households: 55643, broadbandHouseholds: 41742, unservedHouseholds: 13901, pctServed: 75 },
  { fips: "21229", name: "Washington County, Kentucky", population: 11887, households: 4852, broadbandHouseholds: 2343, unservedHouseholds: 2509, pctServed: 48.3 },
  { fips: "21231", name: "Wayne County, Kentucky", population: 19781, households: 8074, broadbandHouseholds: 5608, unservedHouseholds: 2466, pctServed: 69.5 },
  { fips: "21233", name: "Webster County, Kentucky", population: 12061, households: 4923, broadbandHouseholds: 2630, unservedHouseholds: 2293, pctServed: 53.4 },
  { fips: "21235", name: "Whitley County, Kentucky", population: 33175, households: 13541, broadbandHouseholds: 9322, unservedHouseholds: 4219, pctServed: 68.8 },
  { fips: "21237", name: "Wolfe County, Kentucky", population: 6549, households: 2673, broadbandHouseholds: 2199, unservedHouseholds: 474, pctServed: 82.3 },
  { fips: "21239", name: "Woodford County, Kentucky", population: 26494, households: 10814, broadbandHouseholds: 7882, unservedHouseholds: 2932, pctServed: 72.9 },
];

// State totals: 1,814,469 households, 1,290,387 with broadband, 524,082 unserved (71.1% adoption rate)
// Counties: 120

export const KY_BROADBAND_SUMMARY = {
  totalCounties: 120,
  totalHouseholds: 1814469,
  broadbandHouseholds: 1290387,
  unservedHouseholds: 524082,
  stateAvgBroadbandPct: 71.1,
  source: "U.S. Census Bureau, ACS 2024 5-Year Estimates, Table B28002",
  metric: "Broadband adoption (households with broadband subscription excluding cellular-only)",
  note: "Measures adoption (does the household subscribe?), not availability (is service offered?). Actual broadband availability gaps are likely larger.",
} as const;

/* Helper functions */

export function getKYBroadbandSummary() {
  const totalPop = KY_COUNTY_BROADBAND.reduce((s, c) => s + c.population, 0);
  return {
    ...KY_BROADBAND_SUMMARY,
    countiesTracked: KY_BROADBAND_SUMMARY.totalCounties,
    avgServedPct: KY_BROADBAND_SUMMARY.stateAvgBroadbandPct,
    totalUnserved: KY_BROADBAND_SUMMARY.unservedHouseholds,
    totalPop,
  };
}

export function getCountyByFips(fips: string): KYCountyBroadband | undefined {
  return KY_COUNTY_BROADBAND.find((c) => c.fips === fips);
}
