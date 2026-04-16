"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Globe,
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
import { useCallback, useMemo, useRef, useState } from "react";

import {
  COVERAGE_MODEL,
  FACILITY_TYPE_COLORS,
  FACILITY_TYPE_LABELS,
  KY_RHTP,
  STARLINK_PRICING,
  type BroadbandStatus,
  type FacilityType,
  type KYFacility,
} from "@/data/kentucky-config";
import {
  getKYFacilitySummary,
  KY_FACILITIES,
} from "@/data/kentucky-facilities";
import { KY_COUNTY_BROADBAND } from "@/data/kentucky-broadband-data";
import { getBDCByFips, getKYBDCSummary, KY_COUNTY_BDC } from "@/data/kentucky-broadband-availability";

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
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const BROADBAND_STATUS_COLORS: Record<BroadbandStatus, string> = {
  served: "#0f7c86",
  underserved: "#c49a2e",
  unserved: "#c46128",
};

const BROADBAND_STATUS_LABELS: Record<BroadbandStatus, string> = {
  served: "Served",
  underserved: "Underserved",
  unserved: "Unserved",
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SatellitePlannerPage() {
  const fSummary = getKYFacilitySummary();

  /* ── Facility filters ────────────────────────────────────── */
  const [typeFilters, setTypeFilters] = useState<Record<FacilityType, boolean>>({
    hospital: true,
    cah: true,
    fqhc: true,
    rhc: true,
  });
  const [broadbandFilter, setBroadbandFilter] = useState<"all" | BroadbandStatus | "needs-coverage">("all");
  const [showFilters, setShowFilters] = useState(true);
  const [tierToast, setTierToast] = useState<string | null>(null);
  const [placementFeedback, setPlacementFeedback] = useState<{ x: number; y: number; hh: number } | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const costCardRef = useRef<HTMLDivElement>(null);
  const costCardInView = useInView(costCardRef, { margin: "-100px" });

  const toggleType = (type: FacilityType) =>
    setTypeFilters((prev) => ({ ...prev, [type]: !prev[type] }));

  const filteredFacilities = useMemo(
    () =>
      KY_FACILITIES.filter(
        (f) =>
          typeFilters[f.type] &&
          (broadbandFilter === "all" ||
            (broadbandFilter === "needs-coverage" && f.broadbandStatus !== "served") ||
            broadbandFilter === f.broadbandStatus),
      ),
    [typeFilters, broadbandFilter],
  );

  /** Facilities that need satellite coverage: underserved + unserved */
  const filteredNeedsCoverage = useMemo(
    () => filteredFacilities.filter((f) => f.broadbandStatus !== "served"),
    [filteredFacilities],
  );

  const filteredUnserved = useMemo(
    () => filteredFacilities.filter((f) => f.broadbandStatus === "unserved"),
    [filteredFacilities],
  );

  const filteredUnderserved = useMemo(
    () => filteredFacilities.filter((f) => f.broadbandStatus === "underserved"),
    [filteredFacilities],
  );

  /* ── Cost parameters (all editable) ──────────────────────── */
  const defaultPlan = STARLINK_PRICING.residential.plans[0];
  const defaultDiscount = Math.round((1 - STARLINK_PRICING.bulkDiscountMultiplier) * 100);

  const [discountPct, setDiscountPct] = useState(defaultDiscount);
  const [hardwareCost, setHardwareCost] = useState(
    Math.round(defaultPlan.hardwareRetail * STARLINK_PRICING.bulkDiscountMultiplier * 100) / 100,
  );
  const [monthlyCost, setMonthlyCost] = useState(
    Math.round(defaultPlan.monthlyRetail * STARLINK_PRICING.bulkDiscountMultiplier * 100) / 100,
  );
  const [localEquipCost, setLocalEquipCost] = useState<number>(
    COVERAGE_MODEL.communityDistributionModel.localDistributionCostPerSite,
  );
  const [coverageRadius, setCoverageRadius] = useState<number>(
    COVERAGE_MODEL.communityDistributionModel.coverageRadiusMiles,
  );
  const [showSettings, setShowSettings] = useState(false);

  // When discount slider changes, recalculate hardware + monthly from retail
  const handleDiscountChange = (newPct: number) => {
    setDiscountPct(newPct);
    const mult = 1 - newPct / 100;
    setHardwareCost(Math.round(defaultPlan.hardwareRetail * mult * 100) / 100);
    setMonthlyCost(Math.round(defaultPlan.monthlyRetail * mult * 100) / 100);
  };

  const yearOnePerUnit = hardwareCost + monthlyCost * 12;

  /* ── Auto-connect: terminals at all filtered needs-coverage facilities ── */
  const [autoConnectFacilities, setAutoConnectFacilities] = useState(true);

  const autoTerminals: PlacedTerminal[] = useMemo(() => {
    if (!autoConnectFacilities) return [];
    return filteredNeedsCoverage.map((f) => ({
      id: `auto-${f.id}`,
      lat: f.lat,
      lng: f.lng,
      label: f.name,
      householdsReached: estimateHouseholdsNear(f),
      facilitiesConnected: [f.id],
    }));
  }, [autoConnectFacilities, filteredNeedsCoverage]);

  /* ── Manual placements ──────────────────────────────────── */
  const [manualTerminals, setManualTerminals] = useState<PlacedTerminal[]>([]);

  const allTerminals = [...autoTerminals, ...manualTerminals];
  const totalTerminals = allTerminals.length;

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      const id = `manual-${Date.now()}`;
      const nearby = KY_FACILITIES.filter(
        (f) =>
          f.broadbandStatus !== "served" &&
          haversineDistMiles(lat, lng, f.lat, f.lng) <= coverageRadius,
      );
      const hh = estimateHouseholdsNearCoords(lat, lng, coverageRadius);
      // Find nearest facility for county name
      const nearestForCounty = findNearestFacility(lat, lng);
      const countyLabel = nearestForCounty?.county ?? "";
      const termLabel = nearby.length > 0
        ? `Near ${nearby[0].name}`
        : countyLabel
          ? `${countyLabel} County (${lat.toFixed(3)}, ${lng.toFixed(3)})`
          : `Manual (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
      setManualTerminals((prev) => [
        ...prev,
        {
          id,
          lat,
          lng,
          label: termLabel,
          householdsReached: hh,
          facilitiesConnected: nearby.map((f) => f.id),
        },
      ]);
      // Floating feedback — approximate pixel position from map container
      if (mapContainerRef.current) {
        const rect = mapContainerRef.current.getBoundingClientRect();
        // Use a rough lat/lng → pixel approximation for the feedback position
        // KY bounds: lat 36.5-39.1, lng -89.6 to -81.9
        const px = ((lng - (-89.6)) / ((-81.9) - (-89.6))) * rect.width;
        const py = ((39.1 - lat) / (39.1 - 36.5)) * rect.height;
        setPlacementFeedback({ x: px, y: py, hh });
        setTimeout(() => setPlacementFeedback(null), 1800);
      }
      // Tier upgrade toast
      if (nearestForCounty) {
        const bdc = getBDCByFips(nearestForCounty.countyFips);
        if (bdc) {
          const oldTier = bdc.pctServed >= 80 ? "Served" : bdc.pctServed >= 25 ? "Underserved" : "Unserved";
          const coverageAreaSqMi = Math.PI * coverageRadius * coverageRadius;
          const bslsUpgraded = Math.round(bdc.unservedBSLs * (coverageAreaSqMi / 340));
          const newServedPct = Math.min(100, bdc.pctServed + (bslsUpgraded / bdc.totalBSLs) * 100);
          const newTier = newServedPct >= 80 ? "Served" : newServedPct >= 25 ? "Underserved" : "Unserved";
          if (newTier !== oldTier) {
            setTierToast(`${nearestForCounty.county} County: ${oldTier} → ${newTier}`);
            setTimeout(() => setTierToast(null), 4000);
          }
        }
      }
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
  const householdsReached = allTerminals.reduce(
    (s, t) => s + t.householdsReached,
    0,
  );
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
          Kentucky Broadband Infrastructure
        </p>
        <h1 className="mt-2 font-display text-3xl text-[color:var(--foreground)] md:text-4xl">
          Satellite Terminal Planner
        </h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Click the map to place terminals. Each extends Wi-Fi to a {coverageRadius}-mile radius. Auto-placed at underserved and unserved facilities.
        </p>
      </motion.div>

      {/* ── Main Layout: Map + Sidebar ────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        {/* Map */}
        <div ref={mapContainerRef} className="relative h-[520px] overflow-hidden rounded-[1.8rem] border border-[color:var(--line)] md:h-[620px]">
          <SatelliteMap
            facilities={filteredFacilities}
            terminals={allTerminals}
            onMapClick={handleMapClick}
            coverageRadiusMiles={coverageRadius}
          />

          {/* Tier upgrade toast */}
          {tierToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute left-1/2 top-4 z-[1100] -translate-x-1/2 rounded-full bg-[color:var(--teal)] px-4 py-2 text-xs font-semibold text-white shadow-lg"
            >
              {tierToast}
            </motion.div>
          )}

          {/* Placement feedback — ripple + floating number */}
          <AnimatePresence>
            {placementFeedback && (
              <>
                {/* Ripple rings */}
                {[0, 1, 2].map((ring) => (
                  <motion.div
                    key={`ripple-${ring}`}
                    className="pointer-events-none absolute z-[1050] rounded-full border-2 border-[color:#6b5a8a]"
                    style={{ left: placementFeedback.x, top: placementFeedback.y, translate: "-50% -50%" }}
                    initial={{ width: 0, height: 0, opacity: 0.5 }}
                    animate={{ width: 120, height: 120, opacity: 0 }}
                    transition={{ duration: 0.8, delay: ring * 0.1, ease: "easeOut" }}
                  />
                ))}
                {/* Floating household count */}
                <motion.div
                  className="pointer-events-none absolute z-[1050] whitespace-nowrap rounded-full bg-[color:var(--foreground)] px-3 py-1 text-xs font-semibold text-white shadow-lg"
                  style={{ left: placementFeedback.x, top: placementFeedback.y, translate: "-50% -100%" }}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -40 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  +{placementFeedback.hh} households
                </motion.div>
              </>
            )}
          </AnimatePresence>

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
              {autoConnectFacilities ? "Auto-coverage ON" : "Show auto-coverage"}
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
          <div className="absolute bottom-4 left-4 z-[1000] max-w-[340px] rounded-xl bg-white/95 shadow-lg backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setShowFilters((p) => !p)}
              className="flex w-full items-center justify-between px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-[color:var(--foreground)]"
            >
              <span className="flex items-center gap-1.5">
                <Sliders className="h-3 w-3" />
                Filters
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

                {/* Broadband status filter — three-tier */}
                <p className="mb-1.5 mt-3 text-[9px] uppercase tracking-widest text-[color:var(--muted)]">
                  Broadband status
                </p>
                <div className="flex flex-wrap gap-1">
                  {([
                    { key: "all" as const, label: "All", color: "var(--foreground)" },
                    { key: "needs-coverage" as const, label: "Needs coverage", color: "#c46128" },
                    { key: "served" as const, label: "Served", color: "#0f7c86" },
                    { key: "underserved" as const, label: "Underserved", color: "#c49a2e" },
                    { key: "unserved" as const, label: "Unserved", color: "#c46128" },
                  ]).map(({ key, label, color }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setBroadbandFilter(key)}
                      className={`rounded-lg px-2 py-1.5 text-[10px] transition-all ${
                        broadbandFilter === key
                          ? "text-white"
                          : "bg-[color:var(--surface-soft)] text-[color:var(--muted)]"
                      }`}
                      style={broadbandFilter === key ? { background: color } : undefined}
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
                    <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-[#c46128] bg-[color:var(--foreground)]" />
                    Unserved
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-[color:var(--muted)]">
                    <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-[#c49a2e] bg-[color:var(--foreground)]" />
                    Underserved
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
            <div className="mt-4 space-y-4">
              <SidebarStat
                icon={<Satellite className="h-5 w-5" />}
                label="Terminals"
                value={totalTerminals}
              />
              <SidebarStat
                icon={<Wifi className="h-5 w-5" />}
                label="Facilities connected"
                value={facilitiesConnected}
                sub={`of ${filteredNeedsCoverage.length} needing coverage`}
              />
              <SidebarStat
                icon={<Users className="h-5 w-5" />}
                label="Households reached"
                value={householdsReached.toLocaleString()}
              />
            </div>

            {/* Three-tier breakdown */}
            <div className="mt-4 space-y-1.5 rounded-xl bg-[color:var(--surface-soft)] p-3">
              <p className="text-[9px] uppercase tracking-widest text-[color:var(--muted)]">
                Facility broadband status
              </p>
              <StatusBar
                label="Served"
                count={fSummary.served}
                total={fSummary.total}
                color="#0f7c86"
              />
              <StatusBar
                label="Underserved"
                count={fSummary.underserved}
                total={fSummary.total}
                color="#c49a2e"
              />
              <StatusBar
                label="Unserved"
                count={fSummary.unserved}
                total={fSummary.total}
                color="#c46128"
              />
            </div>
          </div>

          {/* Cost Calculator */}
          <div ref={costCardRef} className="surface-card rounded-[1.6rem] border p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-[color:var(--foreground)]">
                Cost estimate
              </p>
              <button
                type="button"
                onClick={() => setShowSettings((p) => !p)}
                title="Adjust pricing assumptions"
                className={`rounded-full p-2 transition-all ${
                  showSettings
                    ? "bg-[color:var(--foreground)] text-white"
                    : "bg-[color:var(--surface-soft)] text-[color:var(--muted)] hover:bg-[color:var(--foreground)] hover:text-white"
                }`}
              >
                <Settings2 className="h-4 w-4" />
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

            {/* RHTP context — enhanced budget bar */}
            <div className="mt-4 rounded-xl bg-[color:rgba(15,124,134,0.08)] p-3">
              <p className="text-xs font-medium" style={{ color: parseFloat(pctOfRhtp) > 50 ? "#c46128" : parseFloat(pctOfRhtp) > 25 ? "#c49a2e" : "#0f7c86" }}>
                {pctOfRhtp}% of Kentucky&apos;s annual state allocation
              </p>
              <div className="relative mt-1.5 h-3 overflow-hidden rounded-full bg-[color:rgba(15,124,134,0.12)]">
                {/* Threshold markers */}
                {[25, 50, 100].map((t) => (
                  <div key={t} className="absolute top-0 h-full" style={{ left: `${t}%` }}>
                    <div className="h-full w-px border-l border-dashed border-[color:rgba(16,34,53,0.15)]" />
                  </div>
                ))}
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: parseFloat(pctOfRhtp) > 50 ? "#c46128" : parseFloat(pctOfRhtp) > 25 ? "#c49a2e" : "#0f7c86",
                  }}
                  animate={{
                    width: `${Math.min(parseFloat(pctOfRhtp), 100)}%`,
                    boxShadow: parseFloat(pctOfRhtp) > 100
                      ? ["0 0 0 0 rgba(196,97,42,0)", "0 0 8px 4px rgba(196,97,42,0.3)"]
                      : "none",
                  }}
                  transition={{
                    width: { type: "spring", stiffness: 100, damping: 20 },
                    boxShadow: { repeat: Infinity, repeatType: "reverse", duration: 1 },
                  }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[8px] text-[color:var(--muted)]">
                <span>0%</span><span>25%</span><span>50%</span><span>100%</span>
              </div>
            </div>
          </div>

          {/* Statewide Coverage Calculator */}
          <StatewideCalculator coverageRadius={coverageRadius} yearOnePerUnit={yearOnePerUnit} localEquipCost={localEquipCost} />

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

      {/* ── Sticky Cost Bar — appears when cost calculator scrolls out ── */}
      <AnimatePresence>
        {totalTerminals > 0 && !costCardInView && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[2000] border-t border-[color:var(--line)] bg-[color:rgba(245,241,233,0.85)] px-6 py-3 backdrop-blur-xl"
            style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
          >
            <div className="mx-auto flex max-w-[100rem] items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm">
                <span className="text-[color:var(--muted)]">
                  <span className="font-display text-lg font-semibold text-[color:var(--foreground)]">{totalTerminals}</span> terminals
                </span>
                <span className="text-[color:var(--muted)]">
                  <span className="font-display text-lg font-semibold text-[color:var(--foreground)]">${totalYearOneCost.toLocaleString()}</span> year-one
                </span>
                <span className="text-xs" style={{ color: parseFloat(pctOfRhtp) > 50 ? "#c46128" : "#0f7c86" }}>
                  {pctOfRhtp}% of allocation
                </span>
              </div>
              <button
                type="button"
                onClick={() => costCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
                className="rounded-full bg-[color:var(--foreground)] px-4 py-1.5 text-xs text-white transition-colors hover:bg-[color:#223a54]"
              >
                Cost details
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Statewide Coverage Calculator                                      */
/* ------------------------------------------------------------------ */

const AVG_KY_COUNTY_SQ_MI = 340;

function StatewideCalculator({
  coverageRadius,
  yearOnePerUnit,
  localEquipCost,
}: {
  coverageRadius: number;
  yearOnePerUnit: number;
  localEquipCost: number;
}) {
  const [mode, setMode] = useState<"unserved" | "all-bead">("unserved");
  const bdcSummary = getKYBDCSummary();

  const targetBSLs = mode === "unserved" ? bdcSummary.unserved : bdcSummary.beadEligible;
  const targetLabel = mode === "unserved" ? "No internet" : "Underserved + unserved";

  // Calculate terminals needed per county based on local BSL density
  const terminalsNeeded = useMemo(() => {
    const coverageAreaSqMi = Math.PI * coverageRadius * coverageRadius;
    let total = 0;
    for (const county of KY_COUNTY_BDC) {
      const countyBSLs = mode === "unserved" ? county.unservedBSLs : (county.underservedBSLs + county.unservedBSLs);
      if (countyBSLs === 0) continue;
      // BSLs per terminal: scale by coverage area / county area
      const bslsPerTerminal = Math.max(1, Math.round(countyBSLs * (coverageAreaSqMi / AVG_KY_COUNTY_SQ_MI)));
      total += Math.ceil(countyBSLs / bslsPerTerminal);
    }
    return total;
  }, [mode, coverageRadius]);

  const totalCost = terminalsNeeded * (yearOnePerUnit + localEquipCost);

  return (
    <div className="surface-card rounded-[1.6rem] border p-5">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-[color:var(--muted)]" />
        <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
          Statewide coverage
        </p>
      </div>

      {/* Toggle: Unserved only vs All underserved + unserved */}
      <div className="mt-3 flex overflow-hidden rounded-lg border border-[color:var(--line)]">
        <button
          type="button"
          onClick={() => setMode("unserved")}
          className={`flex-1 px-2 py-1.5 text-[10px] font-medium transition-colors ${
            mode === "unserved"
              ? "bg-[color:var(--foreground)] text-white"
              : "text-[color:var(--muted)]"
          }`}
        >
          No internet
        </button>
        <button
          type="button"
          onClick={() => setMode("all-bead")}
          className={`flex-1 px-2 py-1.5 text-[10px] font-medium transition-colors ${
            mode === "all-bead"
              ? "bg-[color:var(--foreground)] text-white"
              : "text-[color:var(--muted)]"
          }`}
        >
          All gaps
        </button>
      </div>

      {/* Big numbers */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-center">
        <div>
          <p className="font-display text-2xl font-semibold text-[color:var(--accent)]">
            {targetBSLs.toLocaleString()}
          </p>
          <p className="text-[10px] text-[color:var(--muted)]">{targetLabel} locations</p>
        </div>
        <div>
          <p className="font-display text-2xl font-semibold text-[color:var(--foreground)]">
            {terminalsNeeded.toLocaleString()}
          </p>
          <p className="text-[10px] text-[color:var(--muted)]">Terminals needed</p>
        </div>
      </div>

      {/* Cost estimate */}
      <div className="mt-3 rounded-xl bg-[color:var(--surface-soft)] p-3">
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] uppercase tracking-wider text-[color:var(--muted)]">Est. year-one cost</span>
          <span className="font-display text-lg font-semibold text-[color:var(--foreground)]">
            ${totalCost.toLocaleString()}
          </span>
        </div>
        <p className="mt-1 text-[10px] text-[color:var(--muted)]">
          {terminalsNeeded.toLocaleString()} terminals × ${(yearOnePerUnit + localEquipCost).toLocaleString()}/unit · {coverageRadius}-mi radius
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function SidebarStat({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--surface-soft)] text-[color:var(--muted)]">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-[color:var(--muted)]">{label}</p>
        <p className="font-display text-2xl font-semibold leading-tight text-[color:var(--foreground)]">{typeof value === "number" ? value.toLocaleString() : value}</p>
        {sub && <p className="text-[10px] text-[color:var(--muted)]">{sub}</p>}
      </div>
    </div>
  );
}

function StatusBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = Math.round((count / total) * 100);
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: color }}
      />
      <span className="w-20 text-[10px] text-[color:var(--muted)]">{label}</span>
      <div className="flex-1 overflow-hidden rounded-full bg-white/60" style={{ height: 6 }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="w-8 text-right text-[10px] font-medium text-[color:var(--foreground)]">{count}</span>
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

function estimateHouseholdsNear(f: KYFacility): number {
  const county = KY_COUNTY_BROADBAND.find((c) => c.fips === f.countyFips);
  if (!county) return 200;
  const unservedDensity = county.unservedHouseholds / (county.households || 1);
  return Math.round(unservedDensity * 500);
}

function findNearestFacility(lat: number, lng: number): KYFacility | null {
  let nearest: KYFacility | null = null;
  let minDist = Infinity;
  for (const f of KY_FACILITIES) {
    const d = haversineDistMiles(lat, lng, f.lat, f.lng);
    if (d < minDist) { minDist = d; nearest = f; }
  }
  return nearest;
}

function estimateHouseholdsNearCoords(lat: number, lng: number, radiusMiles: number): number {
  const nearest = findNearestFacility(lat, lng);
  if (!nearest) return 0;
  const county = KY_COUNTY_BROADBAND.find((c) => c.fips === nearest!.countyFips);
  if (!county) return 0;
  // Scale unserved households by coverage area relative to avg KY county (~340 sq mi)
  const coverageAreaSqMi = Math.PI * radiusMiles * radiusMiles;
  const fraction = coverageAreaSqMi / 340;
  return Math.min(
    Math.round(county.unservedHouseholds * fraction),
    COVERAGE_MODEL.communityDistributionModel.maxHouseholdsPerHub,
  );
}
