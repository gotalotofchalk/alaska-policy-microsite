/**
 * Kentucky Satellite Coverage Map
 *
 * This component renders a Leaflet map with:
 * - Healthcare facility markers (color-coded by broadband status)
 * - Placed terminal markers with coverage radius circles
 * - Click-to-place interaction for manual terminals
 *
 * REQUIRES: npm install leaflet react-leaflet @types/leaflet
 *
 * Leaflet CSS must also be imported. Add to layout.tsx or globals.css:
 *   import "leaflet/dist/leaflet.css";
 *
 * Or add in globals.css:
 *   @import "leaflet/dist/leaflet.css";
 */

"use client";

import { Circle, MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

import type { KYFacility } from "@/data/kentucky-config";
import { FACILITY_TYPE_COLORS, FACILITY_TYPE_LABELS } from "@/data/kentucky-config";
import type { PlacedTerminal } from "@/app/kentucky/satellite-planner/page";

/* ------------------------------------------------------------------ */
/*  Custom marker icons                                                */
/* ------------------------------------------------------------------ */

function createCircleIcon(color: string, size: number = 12, border?: string): L.DivIcon {
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color};
      border: 2px solid ${border || "white"};
      box-shadow: 0 2px 6px rgba(0,0,0,0.25);
    "></div>`,
  });
}

const SERVED_ICON = createCircleIcon("#0f7c86", 12);       // teal
const UNSERVED_ICON = createCircleIcon("#c46128", 14);     // orange/accent
const TERMINAL_ICON = createCircleIcon("#6b5a8a", 16, "#ffffff"); // purple

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

      {/* ── Click handler ──────────────────────────────────── */}
      <ClickHandler onClick={onMapClick} />

      {/* ── Facility markers ───────────────────────────────── */}
      {facilities.map((f) => (
        <Marker
          key={f.id}
          position={[f.lat, f.lng]}
          icon={f.hasBroadband ? SERVED_ICON : UNSERVED_ICON}
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
