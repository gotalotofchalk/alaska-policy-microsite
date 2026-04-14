"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  Download,
  Minus,
  Plus,
  RotateCcw,
  Satellite,
  Settings2,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";

import {
  COVERAGE_MODEL,
  KY_CONTEXT,
  KY_RHTP,
  STARLINK_PRICING,
  type KYFacility,
} from "@/data/kentucky-config";
import {
  getKYFacilitySummary,
  KY_FACILITIES,
} from "@/data/kentucky-facilities";
import {
  getKYBroadbandSummary,
  KY_COUNTY_BROADBAND,
} from "@/data/kentucky-broadband-data";

/* ------------------------------------------------------------------ */
/*  Lazy-load the Leaflet map (client-only, no SSR)                    */
/* ------------------------------------------------------------------ */

const SatelliteMap = dynamic(() => import("@/components/kentucky/satellite-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center rounded-[1.8rem] border border-[color:var(--line)] bg-[color:#e8e4dc]">
      <p className="text-sm text-[color:var(--muted)]">Loading map...</p>
    </div>
  ),
});

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PlacedTerminal {
  id: string;
  lat: number;
  lng: number;
  label: string;
  /** Estimated households reached by this terminal's distribution radius */
  householdsReached: number;
  /** Facilities within range */
  facilitiesConnected: string[];
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SatellitePlannerPage() {
  const fSummary = getKYFacilitySummary();
  const bSummary = getKYBroadbandSummary();

  /* ── Pricing config (editable in sidebar) ────────────────── */
  const [discountPct, setDiscountPct] = useState(
    Math.round((1 - STARLINK_PRICING.bulkDiscountMultiplier) * 100),
  );
  const [showSettings, setShowSettings] = useState(false);

  const discountMult = 1 - discountPct / 100;
  const plan = STARLINK_PRICING.business.plans[STARLINK_PRICING.defaultBusinessPlanIndex];
  const effectiveHardware = Math.round(plan.hardwareRetail * discountMult * 100) / 100;
  const effectiveMonthly = Math.round(plan.monthlyRetail * discountMult * 100) / 100;
  const yearOnePerUnit = effectiveHardware + effectiveMonthly * 12;
  const localEquipCost = COVERAGE_MODEL.communityDistributionModel.localDistributionCostPerSite;

  /* ── Auto-connect mode: pre-populate with all unserved facilities ── */
  const [autoConnectFacilities, setAutoConnectFacilities] = useState(true);

  const autoTerminals: PlacedTerminal[] = useMemo(() => {
    if (!autoConnectFacilities) return [];
    return KY_FACILITIES.filter((f) => !f.hasBroadband).map((f) => ({
      id: `auto-${f.id}`,
      lat: f.lat,
      lng: f.lng,
      label: f.name,
      householdsReached: estimateHouseholdsNear(f),
      facilitiesConnected: [f.id],
    }));
  }, [autoConnectFacilities]);

  /* ── Manual placements ──────────────────────────────────── */
  const [manualTerminals, setManualTerminals] = useState<PlacedTerminal[]>([]);

  const allTerminals = [...autoTerminals, ...manualTerminals];
  const totalTerminals = allTerminals.length;

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      const id = `manual-${Date.now()}`;
      const nearby = KY_FACILITIES.filter(
        (f) =>
          !f.hasBroadband &&
          haversineDistMiles(lat, lng, f.lat, f.lng) <=
            COVERAGE_MODEL.communityDistributionModel.coverageRadiusMiles,
      );
      const hh = estimateHouseholdsAtPoint(lat, lng);
      setManualTerminals((prev) => [
        ...prev,
        {
          id,
          lat,
          lng,
          label: `Manual terminal #${prev.length + 1}`,
          householdsReached: hh,
          facilitiesConnected: nearby.map((f) => f.id),
        },
      ]);
    },
    [],
  );

  const removeManualTerminal = (id: string) => {
    setManualTerminals((prev) => prev.filter((t) => t.id !== id));
  };

  const resetManual = () => setManualTerminals([]);

  /* ── Cost calculations ──────────────────────────────────── */
  const totalHardwareCost = totalTerminals * effectiveHardware;
  const totalMonthlyCost = totalTerminals * effectiveMonthly;
  const totalAnnualService = totalTerminals * effectiveMonthly * 12;
  const totalLocalEquip = totalTerminals * localEquipCost;
  const totalYearOneCost = totalTerminals * yearOnePerUnit + totalLocalEquip;
  const pctOfRhtp = ((totalYearOneCost / KY_RHTP.annualAllocation) * 100).toFixed(2);

  /* ── Coverage calculations ──────────────────────────────── */
  const facilitiesConnected =
    fSummary.served +
    new Set(allTerminals.flatMap((t) => t.facilitiesConnected)).size;
  const householdsReached = allTerminals.reduce(
    (s, t) => s + t.householdsReached,
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[color:var(--muted)]">
          Kentucky Satellite Deployment Planner
        </p>
        <h1 className="mt-2 max-w-2xl font-display text-3xl text-[color:var(--foreground)] md:text-4xl">
          Model broadband coverage. Calculate costs.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--muted)]">
          Click on the map to place Starlink terminals. Each terminal provides
          broadband to the installation site and, with local distribution
          equipment, extends Wi-Fi coverage to a{" "}
          {COVERAGE_MODEL.communityDistributionModel.coverageRadiusMiles}-mile radius.
        </p>
      </motion.div>

      {/* ── Main Layout: Map + Sidebar ────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        {/* Map */}
        <div className="relative h-[520px] overflow-hidden rounded-[1.8rem] border border-[color:var(--line)] md:h-[620px]">
          <SatelliteMap
            facilities={KY_FACILITIES}
            terminals={allTerminals}
            onMapClick={handleMapClick}
            coverageRadiusMiles={COVERAGE_MODEL.communityDistributionModel.coverageRadiusMiles}
          />

          {/* Map overlay controls */}
          <div className="absolute left-4 top-4 z-[1000] flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setAutoConnectFacilities((p) => !p)}
              className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium shadow-lg transition-all ${
                autoConnectFacilities
                  ? "bg-[color:var(--teal)] text-white"
                  : "bg-white text-[color:var(--foreground)]"
              }`}
            >
              <Satellite className="h-3.5 w-3.5" />
              {autoConnectFacilities ? "Facility coverage ON" : "Show facility coverage"}
            </button>
            {manualTerminals.length > 0 && (
              <button
                type="button"
                onClick={resetManual}
                className="flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs text-[color:var(--foreground)] shadow-lg"
              >
                <RotateCcw className="h-3 w-3" />
                Clear manual ({manualTerminals.length})
              </button>
            )}
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-[1000] rounded-xl bg-white/90 px-3 py-2 text-[10px] shadow-lg backdrop-blur-sm">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[color:var(--teal)]" />
                Broadband served
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" />
                No broadband
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[color:#6b5a8a]" />
                Placed terminal
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-[color:#6b5a8a] bg-[color:rgba(107,90,138,0.15)]" />
                Coverage radius
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Coverage Stats */}
          <div className="surface-card rounded-[1.6rem] border p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
              Coverage impact
            </p>
            <div className="mt-4 space-y-3">
              <SidebarStat
                icon={<Satellite className="h-4 w-4" />}
                label="Terminals deployed"
                value={totalTerminals}
              />
              <SidebarStat
                icon={<Wifi className="h-4 w-4" />}
                label="Facilities connected"
                value={`${facilitiesConnected} / ${fSummary.total}`}
              />
              <SidebarStat
                icon={<Users className="h-4 w-4" />}
                label="Est. households reached"
                value={householdsReached.toLocaleString()}
              />
            </div>
          </div>

          {/* Cost Summary */}
          <div className="surface-card rounded-[1.6rem] border p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
                Cost estimate
              </p>
              <button
                type="button"
                onClick={() => setShowSettings((p) => !p)}
                className="rounded-lg p-1 text-[color:var(--muted)] hover:bg-white hover:text-[color:var(--foreground)]"
                title="Adjust pricing"
              >
                <Settings2 className="h-4 w-4" />
              </button>
            </div>

            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mt-3 space-y-2 rounded-xl border border-[color:var(--line)] bg-white/60 p-3"
              >
                <label className="block text-xs text-[color:var(--muted)]">
                  Bulk discount: {discountPct}%
                  <div className="mt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDiscountPct((p) => Math.max(0, p - 5))}
                      className="rounded bg-[color:var(--surface-soft)] p-1"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={95}
                      step={5}
                      value={discountPct}
                      onChange={(e) => setDiscountPct(Number(e.target.value))}
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => setDiscountPct((p) => Math.min(95, p + 5))}
                      className="rounded bg-[color:var(--surface-soft)] p-1"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </label>
                <p className="text-[10px] text-[color:var(--muted)]">
                  Hardware: ${effectiveHardware}/unit
                  &ensp;|&ensp; Monthly: ${effectiveMonthly}/unit
                </p>
              </motion.div>
            )}

            <div className="mt-4 space-y-2">
              <CostLine label="Hardware" value={totalHardwareCost} />
              <CostLine label="Annual service" value={totalAnnualService} />
              <CostLine label="Distribution equipment" value={totalLocalEquip} />
              <div className="border-t border-[color:var(--line)] pt-2">
                <CostLine label="Year-one total" value={totalYearOneCost} bold />
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-[color:rgba(15,124,134,0.08)] p-3">
              <p className="text-xs text-[color:var(--teal)]">
                {pctOfRhtp}% of Kentucky&apos;s annual RHTP allocation
              </p>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[color:rgba(15,124,134,0.15)]">
                <div
                  className="h-full rounded-full bg-[color:var(--teal)] transition-all duration-300"
                  style={{ width: `${Math.min(parseFloat(pctOfRhtp), 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Manual Terminals List */}
          {manualTerminals.length > 0 && (
            <div className="surface-card max-h-48 space-y-1 overflow-y-auto rounded-[1.6rem] border p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
                Manual placements
              </p>
              {manualTerminals.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-lg bg-white/60 px-2 py-1.5 text-xs"
                >
                  <span className="text-[color:var(--foreground)]">{t.label}</span>
                  <button
                    type="button"
                    onClick={() => removeManualTerminal(t.id)}
                    className="text-[color:var(--muted)] hover:text-[color:var(--accent)]"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Haversine distance in miles between two lat/lng points */
function haversineDistMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Rough estimate of households near a facility,
 * based on the facility's county broadband data.
 * [development note: replace with actual population density grid]
 */
function estimateHouseholdsNear(facility: KYFacility): number {
  const county = KY_COUNTY_BROADBAND.find((c) => c.fips === facility.countyFips);
  if (!county) return 50;
  const unservedDensity = county.unservedHouseholds / (county.households || 1);
  const radiusSq =
    COVERAGE_MODEL.communityDistributionModel.coverageRadiusMiles ** 2 * Math.PI;
  // Very rough: assume county is ~400 sq mi average, distribute unserved proportionally
  const countyAreaSqMi = 400;
  return Math.round((radiusSq / countyAreaSqMi) * county.unservedHouseholds * unservedDensity);
}

/** Estimate households near an arbitrary map point */
function estimateHouseholdsAtPoint(lat: number, lng: number): number {
  // Find nearest county by checking facilities
  let nearest = KY_COUNTY_BROADBAND[0];
  let minDist = Infinity;
  for (const county of KY_COUNTY_BROADBAND) {
    const f = KY_FACILITIES.find((fac) => fac.countyFips === county.fips);
    if (f) {
      const d = haversineDistMiles(lat, lng, f.lat, f.lng);
      if (d < minDist) {
        minDist = d;
        nearest = county;
      }
    }
  }
  const radiusSq = COVERAGE_MODEL.communityDistributionModel.coverageRadiusMiles ** 2 * Math.PI;
  return Math.round((radiusSq / 400) * nearest.unservedHouseholds);
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function SidebarStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color:var(--foreground)] text-white">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-[color:var(--muted)]">{label}</p>
        <p className="font-display text-lg text-[color:var(--foreground)]">{String(value)}</p>
      </div>
    </div>
  );
}

function CostLine({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={bold ? "font-medium text-[color:var(--foreground)]" : "text-[color:var(--muted)]"}>
        {label}
      </span>
      <span className={bold ? "font-display text-lg text-[color:var(--foreground)]" : "text-[color:var(--foreground)]"}>
        ${Math.round(value).toLocaleString()}
      </span>
    </div>
  );
}
