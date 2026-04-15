"use client";

import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  DollarSign,
  Download,
  Eye,
  EyeOff,
  Minus,
  Plus,
  RotateCcw,
  Satellite,
  Settings2,
  Sliders,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { BroadbandDataView } from "@/components/kentucky/satellite-map";
import {
  COVERAGE_MODEL,
  FACILITY_TYPE_COLORS,
  FACILITY_TYPE_LABELS,
  KY_RHTP,
  STARLINK_PRICING,
  type FacilityType,
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
import {
  loadBSLGrid,
  countBSLsInRadius,
  countCumulativeCoverage,
  getGridSummary,
  isBSLGridLoaded,
} from "@/lib/bsl-lookup";
import { PricingDisclaimer } from "@/components/kentucky/pricing-disclaimer";

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
  householdsReached: number;
  facilitiesConnected: string[];
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SatellitePlannerPage() {
  const fSummary = getKYFacilitySummary();
  const bSummary = getKYBroadbandSummary();

  /* ── BSL grid (loaded async for spatial coverage queries) ── */
  const [bslGridLoaded, setBslGridLoaded] = useState(false);
  useEffect(() => {
    loadBSLGrid().then(() => setBslGridLoaded(true));
  }, []);

  /* ── Facility filters ────────────────────────────────────── */
  const [typeFilters, setTypeFilters] = useState<Record<FacilityType, boolean>>({
    hospital: true,
    cah: true,
    fqhc: false, // off by default (663 sites can overwhelm)
    rhc: true,
  });
  const [broadbandFilter, setBroadbandFilter] = useState<"all" | "served" | "unserved">("all");
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [dataView, setDataView] = useState<BroadbandDataView>("adoption");

  const toggleType = (type: FacilityType) =>
    setTypeFilters((prev) => ({ ...prev, [type]: !prev[type] }));

  const filteredFacilities = useMemo(
    () =>
      KY_FACILITIES.filter(
        (f) =>
          typeFilters[f.type] &&
          (broadbandFilter === "all" ||
            (broadbandFilter === "served" && f.hasBroadband) ||
            (broadbandFilter === "unserved" && !f.hasBroadband)),
      ),
    [typeFilters, broadbandFilter],
  );

  const filteredUnserved = useMemo(
    () => filteredFacilities.filter((f) => !f.hasBroadband),
    [filteredFacilities],
  );

  /* ── Cost parameters (all editable) ──────────────────────── */
  const defaultPlan = STARLINK_PRICING.residential.plans[1];
  const defaultDiscount = Math.round((1 - STARLINK_PRICING.bulkDiscountMultiplier) * 100);

  const [discountPct, setDiscountPct] = useState<number>(defaultDiscount);
  const [hardwareCost, setHardwareCost] = useState<number>(
    Math.round(defaultPlan.hardwareRetail * STARLINK_PRICING.bulkDiscountMultiplier * 100) / 100,
  );
  const [monthlyCost, setMonthlyCost] = useState<number>(
    Math.round(defaultPlan.monthlyRetail * STARLINK_PRICING.bulkDiscountMultiplier * 100) / 100,
  );
  const [localEquipCost, setLocalEquipCost] = useState<number>(
    COVERAGE_MODEL.communityDistributionModel.localDistributionCostPerSite,
  );
  const [coverageRadius, setCoverageRadius] = useState<number>(
    COVERAGE_MODEL.communityDistributionModel.coverageRadiusMiles,
  );
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // When discount slider changes, recalculate hardware + monthly from retail
  const handleDiscountChange = (newPct: number) => {
    setDiscountPct(newPct);
    const mult = 1 - newPct / 100;
    setHardwareCost(Math.round(defaultPlan.hardwareRetail * mult * 100) / 100);
    setMonthlyCost(Math.round(defaultPlan.monthlyRetail * mult * 100) / 100);
  };

  const yearOnePerUnit = hardwareCost + monthlyCost * 12;

  /* ── Auto-connect: terminals at all filtered unserved facilities ── */
  const [autoConnectFacilities, setAutoConnectFacilities] = useState<boolean>(true);

  const autoTerminals: PlacedTerminal[] = useMemo(() => {
    if (!autoConnectFacilities) return [];
    return filteredUnserved.map((f) => ({
      id: `auto-${f.id}`,
      lat: f.lat,
      lng: f.lng,
      label: f.name,
      householdsReached: bslGridLoaded
        ? countBSLsInRadius(f.lat, f.lng, coverageRadius).unservedBSLs
        : 0,
      facilitiesConnected: [f.id],
    }));
  }, [autoConnectFacilities, filteredUnserved, bslGridLoaded, coverageRadius]);

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
          haversineDistMiles(lat, lng, f.lat, f.lng) <= coverageRadius,
      );
      const hh = bslGridLoaded
        ? countBSLsInRadius(lat, lng, coverageRadius).unservedBSLs
        : 0;
      setManualTerminals((prev) => [
        ...prev,
        {
          id,
          lat,
          lng,
          label: nearby.length > 0 ? `Near ${nearby[0].name}` : `Manual (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
          householdsReached: hh,
          facilitiesConnected: nearby.map((f) => f.id),
        },
      ]);
    },
    [coverageRadius],
  );

  const removeManualTerminal = (id: string) =>
    setManualTerminals((prev) => prev.filter((t) => t.id !== id));
  const resetManual = () => setManualTerminals([]);

  /* ── Cost totals ──────────────────────────────────────────── */
  const totalHardwareCost = totalTerminals * hardwareCost;
  const totalAnnualService = totalTerminals * monthlyCost * 12;
  const totalLocalEquip = totalTerminals * localEquipCost;
  const totalYearOneCost = totalHardwareCost + totalAnnualService + totalLocalEquip;

  const facilitiesConnected = allTerminals.reduce(
    (s, t) => s + t.facilitiesConnected.length,
    0,
  );
  const cumulativeCoverage = useMemo(
    () =>
      bslGridLoaded && allTerminals.length > 0
        ? countCumulativeCoverage(allTerminals, coverageRadius)
        : { unservedBSLs: 0, underservedBSLs: 0, servedBSLs: 0, totalBSLs: 0, hexesInRange: 0 },
    [allTerminals, coverageRadius, bslGridLoaded],
  );
  const householdsReached = cumulativeCoverage.unservedBSLs;
  const gridSummary = getGridSummary();
  const pctOfRhtp = ((totalYearOneCost / KY_RHTP.annualAllocation) * 100).toFixed(2);

  /* ── Animation ──────────────────────────────────────────── */
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[color:var(--muted)]">
          Kentucky Satellite Infrastructure Planner
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl leading-[1.15] text-[color:var(--foreground)] md:text-4xl">
          Place terminals. See coverage. Calculate costs.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--muted)]">
          Click on the map to place Starlink terminals. Each terminal provides
          broadband to the installation site and, with local distribution
          equipment, extends Wi-Fi coverage to a {coverageRadius}-mile radius.
        </p>
      </motion.div>

      {/* ── Main Layout: Map + Sidebar ────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        {/* Map */}
        <div className="relative h-[520px] overflow-hidden rounded-[1.8rem] border border-[color:var(--line)] md:h-[620px]">
          <SatelliteMap
            facilities={filteredFacilities}
            terminals={allTerminals}
            onMapClick={handleMapClick}
            coverageRadiusMiles={coverageRadius}
            dataView={dataView}
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
            <button
              type="button"
              onClick={() => setDataView((p) => p === "adoption" ? "availability" : "adoption")}
              className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium shadow-lg transition-all"
            >
              {dataView === "adoption" ? (
                <>
                  <Eye className="h-3.5 w-3.5 text-[color:var(--teal)]" />
                  Adoption (ACS)
                </>
              ) : (
                <>
                  <Wifi className="h-3.5 w-3.5 text-[color:var(--accent)]" />
                  Availability (FCC)
                </>
              )}
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

          {/* ── Toggleable Legend / Filters ─────────────────── */}
          <div className="absolute bottom-4 left-4 z-[1000] max-w-[320px] rounded-xl bg-white/95 shadow-lg backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setShowFilters((p) => !p)}
              className="flex w-full items-center justify-between px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-[color:var(--foreground)]"
            >
              <span className="flex items-center gap-1.5">
                <Sliders className="h-3 w-3" />
                Map Filters
                <span className="font-normal normal-case tracking-normal text-[color:var(--muted)]">
                  ({filteredFacilities.length} visible)
                </span>
              </span>
              {showFilters ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
            </button>

            {showFilters && (
              <div className="border-t border-[color:var(--line)] px-3 pb-3 pt-2">
                {/* Facility type toggles */}
                <p className="mb-1.5 text-[9px] uppercase tracking-widest text-[color:var(--muted)]">
                  Facility types
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {(["hospital", "cah", "fqhc", "rhc"] as FacilityType[]).map((type) => {
                    const count = KY_FACILITIES.filter((f) => f.type === type).length;
                    const active = typeFilters[type];
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleType(type)}
                        className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] transition-all ${
                          active
                            ? "bg-[color:var(--surface-soft)] text-[color:var(--foreground)]"
                            : "bg-transparent text-[color:var(--muted)] opacity-50"
                        }`}
                      >
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full border border-white"
                          style={{
                            background: active ? FACILITY_TYPE_COLORS[type] : "#ccc",
                            boxShadow: active ? "0 0 0 1px rgba(0,0,0,0.1)" : "none",
                          }}
                        />
                        <span className="truncate">{FACILITY_TYPE_LABELS[type]}</span>
                        <span className="ml-auto text-[9px] text-[color:var(--muted)]">{count}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Broadband status filter */}
                <p className="mb-1.5 mt-3 text-[9px] uppercase tracking-widest text-[color:var(--muted)]">
                  Broadband status
                </p>
                <div className="flex gap-1">
                  {([
                    { key: "all", label: "All" },
                    { key: "unserved", label: "Unserved" },
                    { key: "served", label: "Served" },
                  ] as const).map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setBroadbandFilter(key)}
                      className={`flex-1 rounded-lg px-2 py-1.5 text-[10px] transition-all ${
                        broadbandFilter === key
                          ? key === "unserved"
                            ? "bg-[color:var(--accent)] text-white"
                            : key === "served"
                              ? "bg-[color:var(--teal)] text-white"
                              : "bg-[color:var(--foreground)] text-white"
                          : "bg-[color:var(--surface-soft)] text-[color:var(--muted)]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Terminal + coverage legend */}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-[color:var(--line)] pt-2">
                  <span className="flex items-center gap-1 text-[10px] text-[color:var(--muted)]">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-[color:#6b5a8a]" />
                    Terminal
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-[color:var(--muted)]">
                    <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-[color:#6b5a8a] bg-[color:rgba(107,90,138,0.15)]" />
                    Coverage
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-[color:var(--muted)]">
                    <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-red-400 bg-[color:var(--foreground)]" />
                    No broadband
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar ──────────────────────────────────────── */}
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
                value={`${facilitiesConnected} / ${filteredFacilities.length}`}
              />
              <SidebarStat
                icon={<Users className="h-4 w-4" />}
                label={bslGridLoaded ? "Unserved BSLs covered" : "Loading BSL data…"}
                value={
                  bslGridLoaded && gridSummary
                    ? `${householdsReached.toLocaleString()} / ${gridSummary.unservedBSLs.toLocaleString()}`
                    : "—"
                }
              />
            </div>
          </div>

          {/* Cost Calculator */}
          <div className="surface-card rounded-[1.6rem] border p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
                Cost estimate
              </p>
              <button
                type="button"
                onClick={() => setShowSettings((p) => !p)}
                className={`rounded-full p-1.5 transition-colors ${
                  showSettings
                    ? "bg-[color:var(--foreground)] text-white"
                    : "bg-[color:var(--surface-soft)] text-[color:var(--muted)]"
                }`}
              >
                <Settings2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* ── Expanded Settings Panel ────────────────────── */}
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-4 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-3"
              >
                {/* Bulk discount slider */}
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-[color:var(--muted)]">
                    Bulk discount: {discountPct}%
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <button type="button" onClick={() => handleDiscountChange(Math.max(0, discountPct - 5))} className="rounded bg-white p-1">
                      <Minus className="h-3 w-3" />
                    </button>
                    <input
                      type="range" min={0} max={95} step={5} value={discountPct}
                      onChange={(e) => handleDiscountChange(Number(e.target.value))}
                      className="flex-1"
                    />
                    <button type="button" onClick={() => handleDiscountChange(Math.min(95, discountPct + 5))} className="rounded bg-white p-1">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </label>

                {/* Editable cost inputs */}
                <div className="grid grid-cols-2 gap-2">
                  <CostInput label="Hardware / unit" value={hardwareCost} onChange={setHardwareCost} prefix="$" />
                  <CostInput label="Monthly / unit" value={monthlyCost} onChange={setMonthlyCost} prefix="$" />
                  <CostInput label="Distribution equip" value={localEquipCost} onChange={setLocalEquipCost} prefix="$" />
                  <CostInput label="Coverage radius" value={coverageRadius} onChange={setCoverageRadius} suffix="mi" />
                </div>

                {/* Reset to defaults */}
                <button
                  type="button"
                  onClick={() => {
                    handleDiscountChange(defaultDiscount);
                    setLocalEquipCost(COVERAGE_MODEL.communityDistributionModel.localDistributionCostPerSite);
                    setCoverageRadius(COVERAGE_MODEL.communityDistributionModel.coverageRadiusMiles);
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[10px] text-[color:var(--muted)] transition-colors hover:text-[color:var(--foreground)]"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset to defaults
                </button>
              </motion.div>
            )}

            {/* Cost breakdown */}
            <div className="mt-4 space-y-2">
              <CostLine label="Hardware" value={totalHardwareCost} detail={`${totalTerminals} × $${hardwareCost.toLocaleString()}`} />
              <CostLine label="Annual service" value={totalAnnualService} detail={`${totalTerminals} × $${monthlyCost}/mo × 12`} />
              <CostLine label="Distribution equip" value={totalLocalEquip} detail={`${totalTerminals} × $${localEquipCost.toLocaleString()}`} />
              <div className="border-t border-[color:var(--line)] pt-2">
                <CostLine label="Year-one total" value={totalYearOneCost} bold />
              </div>
            </div>

            {/* Pricing disclaimer — always visible */}
            <div className="mt-4">
              <PricingDisclaimer
                discountPct={discountPct}
                planName={defaultPlan.name}
                retailHardware={defaultPlan.hardwareRetail}
                retailMonthly={defaultPlan.monthlyRetail}
              />
            </div>

            {/* RHTP context */}
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
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function SidebarStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--surface-soft)] text-[color:var(--muted)]">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-[color:var(--muted)]">{label}</p>
        <p className="font-display text-lg font-semibold text-[color:var(--foreground)]">{typeof value === "number" ? value.toLocaleString() : value}</p>
      </div>
    </div>
  );
}

function CostLine({ label, value, detail, bold }: { label: string; value: number; detail?: string; bold?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between text-xs ${bold ? "font-semibold text-[color:var(--foreground)]" : "text-[color:var(--muted)]"}`}>
      <span>
        {label}
        {detail && <span className="ml-1 text-[10px] opacity-60">({detail})</span>}
      </span>
      <span className={bold ? "font-display text-base" : ""}>${value.toLocaleString()}</span>
    </div>
  );
}

function CostInput({
  label, value, onChange, prefix, suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="text-[9px] uppercase tracking-wider text-[color:var(--muted)]">{label}</span>
      <div className="mt-0.5 flex items-center gap-0.5 rounded-lg border border-[color:var(--line)] bg-white px-2 py-1">
        {prefix && <span className="text-[10px] text-[color:var(--muted)]">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full bg-transparent text-xs text-[color:var(--foreground)] outline-none"
          step={prefix === "$" ? 10 : 0.5}
          min={0}
        />
        {suffix && <span className="text-[10px] text-[color:var(--muted)]">{suffix}</span>}
      </div>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

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

/* Old county-level estimation functions removed.
   BSL spatial lookup (src/lib/bsl-lookup.ts) provides real counts
   from FCC BDC December 2024 H3 Resolution-8 hexagon data. */
