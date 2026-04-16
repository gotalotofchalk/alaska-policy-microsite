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
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import type { KYFacility, BroadbandStatus, CyberStatus } from "@/data/kentucky-config";
import { FACILITY_TYPE_COLORS, FACILITY_TYPE_LABELS, CYBER_STATUS_LABELS, CYBER_STATUS_COLORS } from "@/data/kentucky-config";
import { KY_COUNTY_BROADBAND } from "@/data/kentucky-broadband-data";
import { KY_COUNTY_BDC } from "@/data/kentucky-broadband-availability";
import type { PlacedTerminal } from "@/app/kentucky/satellite-planner/page";

type ChoroplethMode = "availability" | "adoption";

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
  cyberStatus: CyberStatus = "unknown",
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

  const shieldColor = CYBER_STATUS_COLORS[cyberStatus];
  // Small shield badge offset to bottom-right
  const shieldBadge = `<div style="
    position:absolute; bottom:-3px; right:-3px;
    width:8px; height:8px;
    background:${shieldColor};
    border:1px solid white;
    border-radius:2px;
    clip-path: polygon(50% 0%, 100% 25%, 100% 65%, 50% 100%, 0% 65%, 0% 25%);
  "></div>`;

  return L.divIcon({
    className: "",
    iconSize: [actualSize + 4, actualSize + 4],
    iconAnchor: [(actualSize + 4) / 2, (actualSize + 4) / 2],
    html: `<div style="position:relative; width:${actualSize + 4}px; height:${actualSize + 4}px;">
      <div style="
        position:absolute; top:2px; left:2px;
        width: ${actualSize}px;
        height: ${actualSize}px;
        border-radius: 50%;
        background: ${fillColor};
        border: 2px solid ${borderColor};
        box-shadow: ${shadow};
      "></div>
      ${shieldBadge}
    </div>`,
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

// Cache icons per type+broadband+cyber to avoid recreating on every render
const iconCache = new Map<string, L.DivIcon>();
function getFacilityIcon(type: KYFacility["type"], broadbandStatus: BroadbandStatus, cyberStatus: CyberStatus = "unknown"): L.DivIcon {
  const key = `${type}-${broadbandStatus}-${cyberStatus}`;
  if (!iconCache.has(key)) {
    iconCache.set(key, createFacilityIcon(FACILITY_TYPE_COLORS[type], broadbandStatus, cyberStatus));
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

const COLOR_STOPS = [
  { min: 80, color: "#0f7c86", label: "80%+" },
  { min: 70, color: "#3a9ca5", label: "70–80%" },
  { min: 60, color: "#7ebfc5", label: "60–70%" },
  { min: 50, color: "#c9a54e", label: "50–60%" },
  { min: 40, color: "#c46128", label: "40–50%" },
  { min: 0,  color: "#9e3a1a", label: "<40%" },
];

function getBroadbandColor(pct: number): string {
  for (const stop of COLOR_STOPS) {
    if (pct >= stop.min) return stop.color;
  }
  return "#9e3a1a";
}

function getCountyPct(geoid: string, mode: ChoroplethMode): number | null {
  if (mode === "adoption") {
    const c = KY_COUNTY_BROADBAND.find((c) => c.fips === geoid);
    return c ? c.pctServed : null;
  }
  const c = KY_COUNTY_BDC.find((c) => c.fips === geoid);
  return c ? c.pctServed : null;
}

function getCountyPopupHtml(geoid: string, mode: ChoroplethMode): string | null {
  if (mode === "adoption") {
    const d = KY_COUNTY_BROADBAND.find((c) => c.fips === geoid);
    if (!d) return null;
    return `<div style="min-width:160px">
      <p style="font-weight:600;font-size:14px;margin:0">${d.name.replace(", Kentucky", "")}</p>
      <p style="font-size:12px;color:#666;margin:4px 0 0">HH: ${d.households.toLocaleString()}</p>
      <p style="font-size:13px;font-weight:500;margin:6px 0 0;color:${getBroadbandColor(d.pctServed)}">${d.pctServed}% adoption</p>
      <p style="font-size:11px;color:#999;margin:2px 0 0">${d.unservedHouseholds.toLocaleString()} without broadband</p>
    </div>`;
  }
  const d = KY_COUNTY_BDC.find((c) => c.fips === geoid);
  if (!d) return null;
  return `<div style="min-width:160px">
    <p style="font-weight:600;font-size:14px;margin:0">${d.name}</p>
    <p style="font-size:12px;color:#666;margin:4px 0 0">BSLs: ${d.totalBSLs.toLocaleString()}</p>
    <p style="font-size:13px;font-weight:500;margin:6px 0 0;color:${getBroadbandColor(d.pctServed)}">${d.pctServed}% served (100/20)</p>
    <p style="font-size:11px;color:#999;margin:2px 0 0">${d.unservedBSLs.toLocaleString()} unserved · ${d.underservedBSLs.toLocaleString()} underserved</p>
  </div>`;
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

function CountyChoropleth({ mode }: { mode: ChoroplethMode }) {
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
      key={mode}
      data={countyGeoJson}
      style={(feature) => {
        const geoid = feature?.properties?.GEOID || "";
        const pct = getCountyPct(geoid, mode) ?? 70;
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
        const html = getCountyPopupHtml(geoid, mode);
        if (html) layer.bindPopup(html);
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
  const [choroplethMode, setChoroplethMode] = useState<ChoroplethMode>("availability");

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
    <div className="relative h-full w-full">
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
      <CountyChoropleth mode={choroplethMode} />

      {/* ── Click handler ──────────────────────────────────── */}
      <ClickHandler onClick={onMapClick} />

      {/* ── Facility markers (already filtered by parent) ──── */}
      {facilities.map((f) => {
        const status = POPUP_STATUS[f.broadbandStatus];
        const cyberColor = CYBER_STATUS_COLORS[f.cyberStatus];
        const cyberLabel = CYBER_STATUS_LABELS[f.cyberStatus];
        return (
          <Marker
            key={f.id}
            position={[f.lat, f.lng]}
            icon={getFacilityIcon(f.type, f.broadbandStatus, f.cyberStatus)}
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
                <p className="text-xs" style={{ color: cyberColor }}>
                  🛡 {cyberLabel}
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

    {/* ── Bottom-right: Availability / Adoption toggle + legend ── */}
    <div className="absolute bottom-3 right-3 z-[1000] flex flex-col items-end gap-2">
      {/* Toggle — iOS-style segmented control */}
      <div className="relative flex overflow-hidden rounded-lg bg-white/95 shadow-lg backdrop-blur-sm">
        {(["availability", "adoption"] as ChoroplethMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setChoroplethMode(m)}
            className={`relative z-10 px-3 py-1.5 text-[10px] font-medium transition-colors ${
              choroplethMode === m ? "text-white" : "text-[color:var(--muted)]"
            }`}
            title={m === "availability" ? "FCC BDC supply-side (100/20 Mbps)" : "Census ACS demand-side (subscriptions)"}
          >
            {choroplethMode === m && (
              <motion.div
                layoutId="choropleth-toggle-bg"
                className="absolute inset-0 rounded-lg bg-[color:var(--foreground)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{m === "availability" ? "Availability" : "Adoption"}</span>
          </button>
        ))}
      </div>
      {/* Gradient legend */}
      <div className="rounded-lg bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
        <p className="mb-1 text-[9px] uppercase tracking-wider text-[color:var(--muted)]">
          {choroplethMode === "availability" ? "FCC BDC served %" : "ACS adoption %"}
        </p>
        <div className="flex gap-0.5">
          {COLOR_STOPS.map((stop) => (
            <div key={stop.label} className="flex flex-col items-center">
              <div
                className="h-2 w-6 first:rounded-l last:rounded-r"
                style={{ background: stop.color }}
              />
              <span className="mt-0.5 text-[8px] text-[color:var(--muted)]">{stop.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}
