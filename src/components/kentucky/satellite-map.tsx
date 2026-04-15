/**
 * Kentucky Satellite Coverage Map (Enhanced)
 *
 * Features:
 * - County boundary choropleth (colored by broadband coverage %)
 * - Healthcare facility markers (color-coded by TYPE + broadband status)
 * - Placed terminal markers with coverage radius circles
 * - Click-to-place interaction for manual terminals
 * - County hover popups with population and broadband data
 * - Filter support: facilities filtered before rendering
 */

"use client";

import { Circle, GeoJSON, MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo } from "react";

import type { KYFacility } from "@/data/kentucky-config";
import { FACILITY_TYPE_COLORS, FACILITY_TYPE_LABELS } from "@/data/kentucky-config";
import { KY_COUNTY_BROADBAND, getCountyByFips } from "@/data/kentucky-broadband-data";
import { KY_COUNTY_BDC } from "@/data/kentucky-broadband-availability";
import type { PlacedTerminal } from "@/app/kentucky/satellite-planner/page";

/* ------------------------------------------------------------------ */
/*  Custom marker icons — per facility type + broadband status         */
/* ------------------------------------------------------------------ */

function createFacilityIcon(
  fillColor: string,
  served: boolean,
  size: number = 12,
): L.DivIcon {
  const borderColor = served ? "white" : "#ef4444";
  const actualSize = served ? size : size + 2;
  const shadow = served
    ? "0 1px 4px rgba(0,0,0,0.2)"
    : "0 0 0 2px rgba(239,68,68,0.3), 0 2px 6px rgba(0,0,0,0.25)";

  return L.divIcon({
    className: "",
    iconSize: [actualSize, actualSize],
    iconAnchor: [actualSize / 2, actualSize / 2],
    html: `<div style="
      width: ${actualSize}px;
      height: ${actualSize}px;
      border-radius: 50%;
      background: ${fillColor};
      border: 2px solid ${borderColor};
      box-shadow: ${shadow};
    "></div>`,
  });
}

const TERMINAL_ICON = L.divIcon({
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  html: `<div style="
    width: 16px; height: 16px; border-radius: 50%;
    background: #6b5a8a; border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.25);
  "></div>`,
});

// Cache icons per type+status to avoid recreating on every render
const iconCache = new Map<string, L.DivIcon>();
function getFacilityIcon(type: KYFacility["type"], served: boolean): L.DivIcon {
  const key = `${type}-${served}`;
  if (!iconCache.has(key)) {
    iconCache.set(key, createFacilityIcon(FACILITY_TYPE_COLORS[type], served));
  }
  return iconCache.get(key)!;
}

/* ------------------------------------------------------------------ */
/*  Map click handler (child of MapContainer)                          */
/* ------------------------------------------------------------------ */

function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/* ------------------------------------------------------------------ */
/*  Choropleth helpers                                                 */
/* ------------------------------------------------------------------ */

function getBroadbandColor(pct: number): string {
  if (pct >= 80) return "#0f7c86";
  if (pct >= 70) return "#3a9ca5";
  if (pct >= 60) return "#7ebfc5";
  if (pct >= 50) return "#c9a54e";
  if (pct >= 40) return "#c46128";
  return "#9e3a1a";
}

function getAdoptionData(geoid: string) {
  return KY_COUNTY_BROADBAND.find((c) => c.fips === geoid);
}

function getAvailabilityData(geoid: string) {
  return KY_COUNTY_BDC.find((c) => c.fips === geoid);
}

/* ------------------------------------------------------------------ */
/*  County GeoJSON layer                                               */
/* ------------------------------------------------------------------ */

let countyGeoJson: GeoJSON.FeatureCollection | null = null;

function CountyChoropleth({ dataView }: { dataView: BroadbandDataView }) {
  useEffect(() => {
    if (!countyGeoJson) {
      import("@/data/kentucky-counties.json").then((mod) => {
        countyGeoJson = mod.default as unknown as GeoJSON.FeatureCollection;
      });
    }
  }, []);

  if (!countyGeoJson) return null;

  return (
    <GeoJSON
      key={dataView}
      data={countyGeoJson}
      style={(feature) => {
        const geoid = feature?.properties?.GEOID || "";
        if (dataView === "availability") {
          const bdc = getAvailabilityData(geoid);
          const pct = bdc?.pctServed ?? 70;
          return {
            fillColor: getBroadbandColor(pct),
            fillOpacity: 0.25,
            color: "#888",
            weight: 1,
            opacity: 0.4,
          };
        }
        const data = getAdoptionData(geoid);
        const pct = data?.pctServed ?? 70;
        return {
          fillColor: getBroadbandColor(pct),
          fillOpacity: 0.2,
          color: "#888",
          weight: 1,
          opacity: 0.4,
        };
      }}
      onEachFeature={(feature, layer) => {
        const geoid = feature?.properties?.GEOID || "";
        if (dataView === "availability") {
          const bdc = getAvailabilityData(geoid);
          if (bdc) {
            layer.bindPopup(`
              <div style="min-width:180px">
                <p style="font-weight:600;font-size:14px;margin:0">${bdc.name}</p>
                <p style="font-size:11px;color:#888;margin:2px 0 4px;font-style:italic">FCC BDC availability (Dec 2024)</p>
                <p style="font-size:12px;color:#666;margin:4px 0 0">
                  ${bdc.totalBSLs.toLocaleString()} broadband serviceable locations
                </p>
                <p style="font-size:13px;font-weight:500;margin:6px 0 0;color:${getBroadbandColor(bdc.pctServed)}">
                  ${bdc.pctServed}% served (100/20+ Mbps)
                </p>
                <p style="font-size:11px;color:#999;margin:2px 0 0">
                  ${bdc.underservedBSLs.toLocaleString()} underserved &ensp;|&ensp; ${bdc.unservedBSLs.toLocaleString()} unserved
                </p>
                <p style="font-size:11px;color:#c46128;margin:2px 0 0">
                  ${bdc.pctBEADEligible}% BEAD-eligible
                </p>
              </div>
            `);
          }
        } else {
          const data = getAdoptionData(geoid);
          if (data) {
            layer.bindPopup(`
              <div style="min-width:160px">
                <p style="font-weight:600;font-size:14px;margin:0">${data.name}</p>
                <p style="font-size:11px;color:#888;margin:2px 0 4px;font-style:italic">Census ACS adoption (2020-2024)</p>
                <p style="font-size:12px;color:#666;margin:4px 0 0">
                  Pop: ~${data.population.toLocaleString()}
                  &ensp;|&ensp;
                  HH: ${data.households.toLocaleString()}
                </p>
                <p style="font-size:13px;font-weight:500;margin:6px 0 0;color:${getBroadbandColor(data.pctServed)}">
                  ${data.pctServed}% broadband adoption
                </p>
                <p style="font-size:11px;color:#999;margin:2px 0 0">
                  ${data.unservedHouseholds.toLocaleString()} unserved households
                </p>
              </div>
            `);
          }
        }
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Main Map Component                                                 */
/* ------------------------------------------------------------------ */

export type BroadbandDataView = "adoption" | "availability";

interface SatelliteMapProps {
  facilities: KYFacility[];
  terminals: PlacedTerminal[];
  onMapClick: (lat: number, lng: number) => void;
  coverageRadiusMiles: number;
  dataView?: BroadbandDataView;
}

/** Convert miles to meters for Leaflet Circle radius */
const milesToMeters = (miles: number) => miles * 1609.34;

export default function SatelliteMapComponent({
  facilities,
  terminals,
  onMapClick,
  coverageRadiusMiles,
  dataView = "adoption",
}: SatelliteMapProps) {
  // Fix Leaflet default icon paths in Next.js/webpack
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  /** Kentucky center coordinates */
  const KY_CENTER: [number, number] = [37.84, -84.27];
  const KY_ZOOM = 7;

  const radiusMeters = milesToMeters(coverageRadiusMiles);

  return (
    <MapContainer
      center={KY_CENTER}
      zoom={KY_ZOOM}
      className="h-full w-full"
      zoomControl={true}
      scrollWheelZoom={true}
      style={{ background: "#e8e4dc" }}
    >
      {/* ── Base tile layer ─────────────────────────────────── */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {/* ── County choropleth ──────────────────────────────── */}
      <CountyChoropleth dataView={dataView} />

      {/* ── Click handler ──────────────────────────────────── */}
      <ClickHandler onClick={onMapClick} />

      {/* ── Facility markers (already filtered by parent) ──── */}
      {facilities.map((f) => (
        <Marker
          key={f.id}
          position={[f.lat, f.lng]}
          icon={getFacilityIcon(f.type, f.hasBroadband)}
        >
          <Popup>
            <div className="min-w-[180px]">
              <p className="font-semibold">{f.name}</p>
              <p className="text-xs text-gray-500">
                {FACILITY_TYPE_LABELS[f.type]} &middot; {f.county} County
              </p>
              {f.beds && <p className="text-xs text-gray-500">{f.beds} beds</p>}
              <p className={`mt-1 text-xs font-medium ${f.hasBroadband ? "text-[#0f7c86]" : "text-[#c46128]"}`}>
                {f.hasBroadband ? "✓ Broadband available" : "✗ No broadband"}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* ── Terminal markers + coverage circles ────────────── */}
      {terminals.map((t) => (
        <span key={t.id}>
          <Circle
            center={[t.lat, t.lng]}
            radius={radiusMeters}
            pathOptions={{
              color: "#6b5a8a",
              fillColor: "rgba(107, 90, 138, 0.15)",
              fillOpacity: 0.3,
              weight: 2,
              dashArray: "6 4",
            }}
          />
          <Marker position={[t.lat, t.lng]} icon={TERMINAL_ICON}>
            <Popup>
              <div className="min-w-[160px]">
                <p className="font-semibold">{t.label}</p>
                <p className="text-xs text-gray-500">
                  Coverage: {coverageRadiusMiles}-mile radius
                </p>
                <p className="text-xs text-gray-500">
                  Est. {t.householdsReached} households reached
                </p>
                {t.facilitiesConnected.length > 0 && (
                  <p className="text-xs text-gray-500">
                    {t.facilitiesConnected.length} facilities connected
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        </span>
      ))}
    </MapContainer>
  );
}
