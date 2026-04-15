#!/usr/bin/env node
/**
 * fetch-ky-bsl-grid.js
 * 
 * Fetches H3 Resolution-8 hexagon BSL data for Kentucky from the
 * ArcGIS Living Atlas FCC BDC December 2024 layer, converts H3 IDs
 * to centroid coordinates, and writes a compact JSON file for use
 * in the RHT-NAV satellite planner.
 * 
 * Usage:
 *   cd ~/Documents/RHT-NAV-prototype
 *   npm install h3-js
 *   node scripts/fetch-ky-bsl-grid.js
 * 
 * Output: src/data/kentucky-bsl-grid.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Dynamically require h3-js (must be installed first)
let h3;
try {
  h3 = require('h3-js');
} catch (e) {
  console.error('ERROR: h3-js not installed. Run: npm install h3-js');
  process.exit(1);
}

// --- Configuration ---

const BASE_URL = 'https://services8.arcgis.com/peDZJliSvYims39Q/arcgis/rest/services/FCC_Broadband_Data_Collection_December_2024_View/FeatureServer';
const H3_LAYER = 5;
const PAGE_SIZE = 2000; // ArcGIS max is often 1000-2000; we'll try 2000

// Kentucky bounding box (same as used in test queries)
const KY_BBOX = '-89.57,36.50,-81.96,39.15';

// Tighter Kentucky bounds for centroid filtering (exclude neighboring state spillover)
const KY_LAT_MIN = 36.49;
const KY_LAT_MAX = 39.15;
const KY_LNG_MIN = -89.58;
const KY_LNG_MAX = -81.95;

// Output path
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'kentucky-bsl-grid.json');

// --- HTTP Helper ---

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`JSON parse error: ${e.message}\nURL: ${url}\nResponse: ${data.slice(0, 500)}`));
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

// --- Paginated Query ---

async function fetchAllHexes() {
  const allFeatures = [];
  let offset = 0;
  let page = 1;
  let hasMore = true;

  // Query: all H3 hexes in KY bounding box where UnservedBSLs > 0 OR UnderservedBSLs > 0
  const whereClause = encodeURIComponent('UnservedBSLs>0 OR UnderservedBSLs>0');
  const outFields = 'GEOID,TotalBSLs,UnservedBSLs,UnderservedBSLs,ServedBSLs';
  const geometry = encodeURIComponent(KY_BBOX);

  console.log('Fetching H3 hexes with unserved or underserved BSLs in Kentucky area...\n');

  while (hasMore) {
    const url = `${BASE_URL}/${H3_LAYER}/query?` +
      `where=${whereClause}` +
      `&geometry=${geometry}` +
      `&geometryType=esriGeometryEnvelope` +
      `&inSR=4326` +
      `&spatialRel=esriSpatialRelIntersects` +
      `&outFields=${outFields}` +
      `&returnGeometry=false` +
      `&f=json` +
      `&resultRecordCount=${PAGE_SIZE}` +
      `&resultOffset=${offset}`;

    process.stdout.write(`  Page ${page} (offset ${offset})...`);

    const response = await fetchJSON(url);

    if (response.error) {
      // If 2000 is too high, fall back to 1000
      if (page === 1 && response.error.message && response.error.message.includes('exceed')) {
        console.log(' reducing page size to 1000');
        // Will be handled below
        throw new Error(`API error: ${JSON.stringify(response.error)}`);
      }
      throw new Error(`API error: ${JSON.stringify(response.error)}`);
    }

    const features = response.features || [];
    console.log(` ${features.length} records`);

    allFeatures.push(...features);
    
    // Check if there are more records
    if (response.exceededTransferLimit || features.length === PAGE_SIZE) {
      offset += features.length;
      page++;
      // Small delay to be respectful to the API
      await new Promise(r => setTimeout(r, 200));
    } else {
      hasMore = false;
    }
  }

  console.log(`\nTotal records fetched: ${allFeatures.length}`);
  return allFeatures;
}

// --- Process and Filter ---

function processFeatures(features) {
  const grid = [];
  let skippedOutOfBounds = 0;
  let skippedInvalidH3 = 0;

  for (const feature of features) {
    const attrs = feature.attributes;
    const h3Id = attrs.GEOID;

    // Validate H3 ID
    if (!h3.isValidCell(h3Id)) {
      skippedInvalidH3++;
      continue;
    }

    // Convert H3 ID to centroid lat/lng
    const [lat, lng] = h3.cellToLatLng(h3Id);

    // Filter to Kentucky bounds (removes neighboring state spillover)
    if (lat < KY_LAT_MIN || lat > KY_LAT_MAX || lng < KY_LNG_MIN || lng > KY_LNG_MAX) {
      skippedOutOfBounds++;
      continue;
    }

    grid.push({
      id: h3Id,
      lat: Math.round(lat * 10000) / 10000,  // 4 decimal places (~11m precision)
      lng: Math.round(lng * 10000) / 10000,
      t: attrs.TotalBSLs,          // total BSLs
      s: attrs.ServedBSLs,         // served
      u: attrs.UnderservedBSLs,    // underserved
      x: attrs.UnservedBSLs        // unserved (x for "no access")
    });
  }

  console.log(`\nProcessing results:`);
  console.log(`  Valid KY hexes: ${grid.length}`);
  console.log(`  Skipped (out of KY bounds): ${skippedOutOfBounds}`);
  console.log(`  Skipped (invalid H3 ID): ${skippedInvalidH3}`);

  return grid;
}

// --- Summary Stats ---

function computeSummary(grid) {
  const summary = {
    totalHexes: grid.length,
    totalBSLs: 0,
    servedBSLs: 0,
    underservedBSLs: 0,
    unservedBSLs: 0,
    beadEligibleBSLs: 0,
    generatedAt: new Date().toISOString(),
    source: 'FCC BDC December 2024 via ArcGIS Living Atlas',
    sourceLayer: 'H3 Resolution 8',
    note: 'Only includes hexes with unserved or underserved BSLs. Served-only hexes are excluded to keep file size manageable.'
  };

  for (const cell of grid) {
    summary.totalBSLs += cell.t;
    summary.servedBSLs += cell.s;
    summary.underservedBSLs += cell.u;
    summary.unservedBSLs += cell.x;
  }
  summary.beadEligibleBSLs = summary.unservedBSLs + summary.underservedBSLs;

  return summary;
}

// --- Main ---

async function main() {
  console.log('=== Kentucky BSL Grid Generator ===\n');
  console.log(`Source: FCC BDC December 2024`);
  console.log(`Layer: H3 Resolution 8 (sublayer ${H3_LAYER})`);
  console.log(`Filter: UnservedBSLs > 0 OR UnderservedBSLs > 0`);
  console.log(`Bounding box: ${KY_BBOX}\n`);

  // Step 1: Fetch all matching H3 hexes
  let features;
  try {
    features = await fetchAllHexes();
  } catch (err) {
    console.error(`\nFetch failed: ${err.message}`);
    console.error('\nIf you see a page size error, edit PAGE_SIZE to 1000 at the top of this script.');
    process.exit(1);
  }

  // Step 2: Convert H3 IDs to centroids and filter to KY
  const grid = processFeatures(features);

  // Step 3: Compute summary
  const summary = computeSummary(grid);

  console.log(`\n--- Summary ---`);
  console.log(`  Hexes with gaps: ${summary.totalHexes.toLocaleString()}`);
  console.log(`  Total BSLs in these hexes: ${summary.totalBSLs.toLocaleString()}`);
  console.log(`  Unserved BSLs: ${summary.unservedBSLs.toLocaleString()}`);
  console.log(`  Underserved BSLs: ${summary.underservedBSLs.toLocaleString()}`);
  console.log(`  BEAD eligible: ${summary.beadEligibleBSLs.toLocaleString()}`);

  // Step 4: Write output
  const output = {
    summary,
    grid
  };

  const jsonStr = JSON.stringify(output);
  const sizeMB = (Buffer.byteLength(jsonStr) / 1024 / 1024).toFixed(2);
  
  console.log(`\nOutput file size: ${sizeMB} MB`);

  if (parseFloat(sizeMB) > 5) {
    console.warn('WARNING: File exceeds 5MB. Consider using dynamic import instead of static.');
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, jsonStr);
  console.log(`\nWritten to: ${OUTPUT_FILE}`);
  console.log('\nDone!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
