/**
 * Kentucky Satellite Coverage Map (Enhanced)
 *
 * Features:
 * - County boundary choropleth (colored by broadband coverage %)
 * - Healthcare facility markers (color-coded by broadband status)
 * - Placed terminal markers with coverage radius circles
 * - Click-to-place interaction for manual terminals
 * - County hover popups with population and broadband data
 *
 * REQUIRES: npm install leaflet react-leaflet @types/leaflet
 */

"use client";

import {
  Circle,
  GeoJSON,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo } from "react";

import type { KYFacility } from "@/data/kentucky-config";
import { FACILITY_TYPE_LABELS } from "@/data/kentucky-config";
import { KY_COUNTY_DATA } from "@/data/kentucky-facilities";
import type { PlacedTerminal } from "@/app/kentucky/satellite-planner/page";

// Import the county boundaries GeoJSON
// eslint-disable-next-line @typescript-eslint/no-require-imports
const countyGeo = require("@/data/kentucky-counties.json");

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

const SERVED_ICON = createCircleIcon("#0f7c86", 10);
const UNSERVED_ICON = createCircleIcon("#c46128", 12);
const TERMINAL_ICON = createCircleIcon("#6b5a8a", 16, "#ffffff");

/* ------------------------------------------------------------------ */
/*  Choropleth color scale                                             */
/* ------------------------------------------------------------------ */

function getBroadbandColor(pct: number): string {
  if (pct >= 90) return "#0f7c86";
  if (pct >= 75) return "#3a9da5";
  if (pct >= 60) return "#7ebfc4";
  if (pct >= 45) return "#e8c78a";
  if (pct >= 30) return "#d4945a";
  return "#c46128";
}

function getBroadbandOpacity(pct: number): number {
  if (pct >= 80) return 0.15;
  if (pct >= 60) return 0.25;
  if (pct >= 40) return 0.4;
  return 0.55;
}

/* ------------------------------------------------------------------ */
/*  Map click handler                                                  */
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
/*  Lookup helper                                                      */
/* ------------------------------------------------------------------ */

function getCountyData(geoid: string) {
  return KY_COUNTY_DATA.find((c) => c.fips === geoid);
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

const milesToMeters = (miles: number) => miles * 1609.34;

export default function SatelliteMapComponent({
  facilities,
  terminals,
  onMapClick,
  coverageRadiusMiles,
}: SatelliteMapProps) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const KY_CENTER: [number, number] = [37.84, -84.27];
  const KY_ZOOM = 7;
  const radiusMeters = milesToMeters(coverageRadiusMiles);

  /* County choropleth style */
  const countyStyle = useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (feature: any) => {
        const geoid = feature?.properties?.GEOID;
        const data = geoid ? getCountyData(geoid) : null;
        const pct = data?.pctServed25_3 ?? 70;
        return {
          fillColor: getBroadbandColor(pct),
          fillOpacity: getBroadbandOpacity(pct),
          color: "#8a7e6e",
          weight: 1,
          opacity: 0.5,
        };
      },
    [],
  );

  /* County hover + popup */
  const onEachCounty = useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (feature: any, layer: L.Layer) => {
        const geoid = feature?.properties?.GEOID;
        const name = feature?.properties?.NAME;
        const data = geoid ? getCountyData(geoid) : null;

        if (data) {
          (layer as L.Path).bindPopup(
            `<div style="min-width:180px;font-family:system-ui,sans-serif">
              <p style="font-weight:600;margin:0 0 4px;font-size:14px">${name} County</p>
              <p style="font-size:11px;color:#666;margin:0">
                Pop: ${data.population.toLocaleString()} &middot; 
                HH: ${data.households.toLocaleString()}
              </p>
              <p style="font-size:13px;font-weight:500;margin:6px 0 0;color:${getBroadbandColor(data.pctServed25_3)}">
                ${data.pctServed25_3}% broadband coverage
              </p>
              <p style="font-size:11px;color:#999;margin:2px 0 0">
                ${data.unservedHouseholds.toLocaleString()} unserved households
              </p>
            </div>`,
          );
        }

        (layer as L.Path).on({
          mouseover: (e) => {
            const l = e.target as L.Path;
            l.setStyle({ weight: 2.5, opacity: 0.9, fillOpacity: 0.65 });
            l.bringToFront();
          },
          mouseout: (e) => {
            const l = e.target as L.Path;
            const pct = data?.pctServed25_3 ?? 70;
            l.setStyle({
              weight: 1,
              opacity: 0.5,
              fillOpacity: getBroadbandOpacity(pct),
            });
          },
        });
      },
    [],
  );

  return (
    <MapContainer
      center={KY_CENTER}
      zoom={KY_ZOOM}
      className="h-full w-full"
      zoomControl={true}
      scrollWheelZoom={true}
      style={{ background: "#e8e4dc" }}
    >
      {/* Base tiles (no labels so choropleth reads clearly) */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
      />

      {/* County boundary choropleth */}
      <GeoJSON
        data={countyGeo}
        style={countyStyle}
        onEachFeature={onEachCounty}
      />

      {/* Labels on top of choropleth */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
        pane="tooltipPane"
      />

      {/* Click handler for placing terminals */}
      <ClickHandler onClick={onMapClick} />

      {/* Facility markers */}
      {facilities.map((f) => (
        <Marker
          key={f.id}
          position={[f.lat, f.lng]}
          icon={f.hasBroadband ? SERVED_ICON : UNSERVED_ICON}
        >
          <Popup>
            <div style={{ minWidth: 180, fontFamily: "system-ui, sans-serif" }}>
              <p style={{ fontWeight: 600, margin: "0 0 4px" }}>{f.name}</p>
              <p style={{ fontSize: 12, color: "#666", margin: 0 }}>
                {FACILITY_TYPE_LABELS[f.type]} &middot; {f.county} Co.
              </p>
              {f.beds && (
                <p style={{ fontSize: 12, color: "#666", margin: 0 }}>{f.beds} beds</p>
              )}
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  margin: "4px 0 0",
                  color: f.hasBroadband ? "#0f7c86" : "#c46128",
                }}
              >
                {f.hasBroadband ? "\u2713 Broadband" : "\u2717 No broadband"}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Terminal markers + coverage circles */}
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
              <div style={{ minWidth: 160, fontFamily: "system-ui, sans-serif" }}>
                <p style={{ fontWeight: 600, margin: "0 0 4px" }}>{t.label}</p>
                <p style={{ fontSize: 12, color: "#666", margin: 0 }}>
                  {coverageRadiusMiles}-mi radius
                </p>
                <p style={{ fontSize: 12, color: "#666", margin: 0 }}>
                  ~{t.householdsReached} households
                </p>
                {t.facilitiesConnected.length > 0 && (
                  <p style={{ fontSize: 12, color: "#666", margin: 0 }}>
                    {t.facilitiesConnected.length} facilities
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
