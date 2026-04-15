/**
 * Kentucky Satellite Coverage Map (Enhanced — Three-Tier Broadband)
 *
 * Features:
 * - County boundary choropleth (colored by broadband coverage %)
 * - Healthcare facility markers with THREE broadband statuses:
 *     Served (white border), Underserved (amber border+glow), Unserved (red border+glow)
 * - Placed terminal markers with coverage radius circles
 * - Click-to-place interaction for manual terminals
 * - County hover popups with population and broadband data
 * - Filter support: facilities filtered before rendering
 */

"use client";

import { Circle, GeoJSON, MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo } from "react";

import type { KYFacility, BroadbandStatus } from "@/data/kentucky-config";
import { FACILITY_TYPE_COLORS, FACILITY_TYPE_LABELS } from "@/data/kentucky-config";
import { KY_COUNTY_BROADBAND, getCountyByFips } from "@/data/kentucky-broadband-data";
import type { PlacedTerminal } from "@/app/kentucky/satellite-planner/page";

/* ------------------------------------------------------------------ */
/*  Custom marker icons — per facility type + broadband status         */
/* ------------------------------------------------------------------ */

const BROADBAND_BORDER_COLORS: Record<BroadbandStatus, string> = {
  served: "white",
  underserved: "#c49a2e",
  unserved: "#ef4444",
};

function createFacilityIcon(
  fillColor: string,
  broadbandStatus: BroadbandStatus,
  size: number = 12,
): L.DivIcon {
  const borderColor = BROADBAND_BORDER_COLORS[broadbandStatus];
  const isServed = broadbandStatus === "served";
  const actualSize = isServed ? size : size + 2;

  let shadow: string;
  if (broadbandStatus === "unserved") {
    shadow = "0 0 0 2px rgba(239,68,68,0.3), 0 2px 6px rgba(0,0,0,0.25)";
  } else if (broadbandStatus === "underserved") {
    shadow = "0 0 0 2px rgba(196,154,46,0.3), 0 2px 6px rgba(0,0,0,0.25)";
  } else {
    shadow = "0 1px 4px rgba(0,0,0,0.2)";
  }

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
function getFacilityIcon(type: KYFacility["type"], broadbandStatus: BroadbandStatus): L.DivIcon {
  const key = `${type}-${broadbandStatus}`;
  if (!iconCache.has(key)) {
    iconCache.set(key, createFacilityIcon(FACILITY_TYPE_COLORS[type], broadbandStatus));
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

function getCountyData(geoid: string) {
  return KY_COUNTY_BROADBAND.find((c) => c.fips === geoid);
}

/* ------------------------------------------------------------------ */
/*  Broadband status label + color for popups                          */
/* ------------------------------------------------------------------ */

const POPUP_STATUS: Record<BroadbandStatus, { label: string; color: string }> = {
  served: { label: "✓ Broadband served", color: "#0f7c86" },
  underserved: { label: "⚠ Underserved", color: "#c49a2e" },
  unserved: { label: "✗ Unserved", color: "#c46128" },
};

/* ------------------------------------------------------------------ */
/*  County GeoJSON layer                                               */
/* ------------------------------------------------------------------ */

let countyGeoJson: GeoJSON.FeatureCollection | null = null;

function CountyChoropleth() {
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
      data={countyGeoJson}
      style={(feature) => {
        const geoid = feature?.properties?.GEOID || "";
        const data = getCountyData(geoid);
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
        const data = getCountyData(geoid);
        if (data) {
          layer.bindPopup(`
            <div style="min-width:160px">
              <p style="font-weight:600;font-size:14px;margin:0">${data.name}</p>
              <p style="font-size:12px;color:#666;margin:4px 0 0">
                Pop: ~${(data.households * 2.45).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                &ensp;|&ensp;
                HH: ${data.households.toLocaleString()}
              </p>
              <p style="font-size:13px;font-weight:500;margin:6px 0 0;color:${getBroadbandColor(data.pctServed)}">
                ${data.pctServed}% broadband coverage
              </p>
              <p style="font-size:11px;color:#999;margin:2px 0 0">
                ${data.unservedHouseholds.toLocaleString()} unserved households
              </p>
            </div>
          `);
        }
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Main Map Component                                                 */
/* ------------------------------------------------------------------ */

interface SatelliteMapProps {
  facilities: KYFacility[];
  terminals: PlacedTerminal[];
  onMapClick: (lat: number, lng: number) => void;
  coverageRadiusMiles: number;
}

/** Convert miles to meters for Leaflet Circle radius */
const milesToMeters = (miles: number) => miles * 1609.34;

export default function SatelliteMapComponent({
  facilities,
  terminals,
  onMapClick,
  coverageRadiusMiles,
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
      <CountyChoropleth />

      {/* ── Click handler ──────────────────────────────────── */}
      <ClickHandler onClick={onMapClick} />

      {/* ── Facility markers (already filtered by parent) ──── */}
      {facilities.map((f) => {
        const status = POPUP_STATUS[f.broadbandStatus];
        return (
          <Marker
            key={f.id}
            position={[f.lat, f.lng]}
            icon={getFacilityIcon(f.type, f.broadbandStatus)}
          >
            <Popup>
              <div className="min-w-[180px]">
                <p className="font-semibold">{f.name}</p>
                <p className="text-xs text-gray-500">
                  {FACILITY_TYPE_LABELS[f.type]} &middot; {f.county} County
                </p>
                {f.beds && <p className="text-xs text-gray-500">{f.beds} beds</p>}
                <p className="mt-1 text-xs font-medium" style={{ color: status.color }}>
                  {status.label}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}

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
