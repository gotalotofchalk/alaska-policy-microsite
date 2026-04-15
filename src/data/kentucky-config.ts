/**
 * Kentucky RHT-NAV Configuration
 *
 * All Kentucky-specific constants live here so they can be tuned
 * in one place. The satellite-planner UI reads from this file and
 * recalculates automatically when values change.
 *
 * Sources are noted inline. Where government/bulk pricing is not
 * publicly documented, a configurable discount is applied to retail.
 */

/* ------------------------------------------------------------------ */
/*  RHTP Allocation                                                    */
/* ------------------------------------------------------------------ */

export const KY_RHTP = {
  annualAllocation: 212_900_000,          // $212.9M — CMS FY2026 announcement
  fiveYearProjected: 1_065_000_000,       // ~$1.065B assuming stable annual awards
  beadAllocation: 1_100_000_000,          // $1.1B NTIA BEAD
  beadLeoSatellitePct: 0.25,             // 25% of BEAD designated for LEO satellite
  beadLeoLocations: 21_600,              // ~21,600 locations in KY BEAD satellite plan
  source: "CMS awards announcement, Dec 29 2025; KY BEAD Draft Final Proposal, Aug 2025",
} as const;

/* ------------------------------------------------------------------ */
/*  Starlink Pricing                                                   */
/* ------------------------------------------------------------------ */

export const STARLINK_PRICING = {
  residential: {
    plans: [
      { name: "Residential 100 Mbps", monthlyRetail: 50, hardwareRetail: 299, speedDown: 100 },
      { name: "Residential 200 Mbps", monthlyRetail: 80, hardwareRetail: 499, speedDown: 200 },
      { name: "Residential Max",      monthlyRetail: 120, hardwareRetail: 499, speedDown: 300 },
    ],
    source: "Starlink.com, Jan 2026 restructure",
  },
  business: {
    plans: [
      { name: "Business Standard",        monthlyRetail: 250,  hardwareRetail: 2500, priorityDataTB: 1 },
      { name: "Business Priority (2 TB)",  monthlyRetail: 500,  hardwareRetail: 2500, priorityDataTB: 2 },
      { name: "Business Priority (6 TB)",  monthlyRetail: 1500, hardwareRetail: 2500, priorityDataTB: 6 },
    ],
    source: "Starlink.com business pricing, current as of Apr 2026",
  },

  /**
   * Bulk/government discount assumption.
   * No public government pricing tier exists. This is a configurable
   * placeholder. Set to 0.10 = "pay 10% of retail" (i.e. 90% discount).
   * Adjust as Rhew provides better estimates.
   */
  bulkDiscountMultiplier: 0.10,

  /**
   * Default plan used for cost calculations.
   * IMPORTANT: Residential plans PROHIBIT redistribution per Starlink ToS.
   * Community distribution hubs MUST use Business plans.
   * For facility-only (no redistribution), residential is fine.
   * The planner uses Business Standard as default for hub deployments.
   */
  defaultResidentialPlanIndex: 1, // Residential 200 Mbps — for facility-only
  defaultBusinessPlanIndex: 0,    // Business Standard — for community hubs

  /** Year-one calculation includes hardware + 12 months service */
  getEffectiveCosts(planType: "residential" | "business" = "business", planIndex?: number) {
    const plans = planType === "residential" ? this.residential.plans : this.business.plans;
    const defaultIdx = planType === "residential" ? this.defaultResidentialPlanIndex : this.defaultBusinessPlanIndex;
    const plan = plans[planIndex ?? defaultIdx];
    const mult = this.bulkDiscountMultiplier;
    return {
      planName: plan.name,
      hardwarePerUnit: Math.round(plan.hardwareRetail * mult * 100) / 100,
      monthlyPerUnit: Math.round(plan.monthlyRetail * mult * 100) / 100,
      annualServicePerUnit: Math.round(plan.monthlyRetail * mult * 12 * 100) / 100,
      yearOneTotalPerUnit: Math.round((plan.hardwareRetail * mult + plan.monthlyRetail * mult * 12) * 100) / 100,
      retailHardware: plan.hardwareRetail,
      retailMonthly: plan.monthlyRetail,
      discountPct: Math.round((1 - mult) * 100),
    };
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Coverage Model Parameters                                          */
/* ------------------------------------------------------------------ */

export const COVERAGE_MODEL = {
  /**
   * Starlink is point-to-point: one terminal serves one location.
   * Community coverage requires a local distribution model
   * (Wi-Fi mesh, fixed wireless backhaul, etc).
   *
   * For the demo, we model two scenarios:
   * 1. Facility-only: one terminal per unserved healthcare facility
   * 2. Community distribution: terminal + local Wi-Fi covers a radius
   */
  facilityTerminalModel: {
    terminalsPerFacility: 1,
    description: "One Starlink terminal per healthcare facility",
  },

  communityDistributionModel: {
    /**
     * Estimated radius (miles) of local fixed-wireless redistribution.
     * Research basis: Ubiquiti PtMP on 5 GHz achieves 4-5 mi line-of-sight;
     * Kentucky Appalachian terrain (hills, hollows, canopy) reduces to 50-70%
     * of theoretical max. 3 miles is the conservative, defensible planning
     * radius per the data gaps research.
     * Equipment: Starlink Business terminal + PtMP sector antenna + CPEs.
     */
    coverageRadiusMiles: 3,
    /**
     * Cost of local distribution equipment per hub site.
     * Based on WISP standard config: Ubiquiti airMAX sector antenna ($300-500),
     * mounting hardware ($200-400), network gateway ($200-300), installation.
     * Karibu/WELCOME project reference: $826-$2,911 per site.
     * Using mid-range estimate for rural KY deployment.
     */
    localDistributionCostPerSite: 2_500,
    /**
     * Max households supportable per hub at 100/20 Mbps.
     * Vernonburg Group analysis: ~7 BSLs per sq mi for reliable 100/20.
     * At 3-mi radius (~28 sq mi), theoretical max ~196 households,
     * but rural density is far lower.
     */
    maxHouseholdsPerHub: 196,
    description: "Starlink Business terminal + PtMP fixed-wireless redistribution hub (5 GHz unlicensed)",
  },

  /** FCC broadband threshold for 'served' classification */
  broadbandThreshold: { download: 25, upload: 3, label: "25/3 Mbps" },
  /** BEAD threshold (more ambitious) */
  beadThreshold: { download: 100, upload: 20, label: "100/20 Mbps" },
} as const;

/* ------------------------------------------------------------------ */
/*  Kentucky State Context                                             */
/* ------------------------------------------------------------------ */

export const KY_CONTEXT = {
  totalPopulation: 4_534_824,             // Census ACS 2020-2024 5-year
  ruralPopulation: 1_886_487,             // ~41.6% per CMS allocation formula
  ruralPct: 0.416,
  totalCounties: 120,
  totalHouseholds: 1_814_469,             // Census ACS 2020-2024 5-year
  maternityDesertCounties: 40,            // from KY RHTP narrative
  primaryCareHPSACounties: 98,            // estimate — verify
  mentalHealthHPSACounties: 110,          // estimate — verify

  rhtpInitiatives: [
    "Chronic care hubs for obesity/diabetes prevention",
    "Telehealth-enabled maternal care in maternity deserts",
    "EmPATH-model behavioral health crisis response",
    "Expanded rural dental access",
    "Integrated EMS treat-in-place protocols",
  ],

  planWebsite: "https://ruralhealthplan.ky.gov",
  contactEmail: "ruralhealthplan@ky.gov",
  source: "KY Cabinet for Health and Family Services; CMS RHTP announcement",
} as const;

/* ------------------------------------------------------------------ */
/*  Facility Type Definitions                                          */
/* ------------------------------------------------------------------ */

export type BroadbandStatus = "served" | "underserved" | "unserved";

export type FacilityType = "hospital" | "cah" | "fqhc" | "rhc";

export interface KYFacility {
  id: string;
  name: string;
  type: FacilityType;
  county: string;
  countyFips: string;
  lat: number;
  lng: number;
  beds?: number;
  broadbandStatus: BroadbandStatus;  // "served" | "underserved" | "unserved"
  usacSubsidy?: { totalCommitted: number; latestYear: number; entities: number };
  broadbandSource?: string;     // how we determined broadband status
}

export const FACILITY_TYPE_LABELS: Record<FacilityType, string> = {
  hospital: "Hospital",
  cah: "Critical Access Hospital",
  fqhc: "Federally Qualified Health Center",
  rhc: "Rural Health Clinic",
};

export const FACILITY_TYPE_COLORS: Record<FacilityType, string> = {
  hospital: "#102235",
  cah: "#c46128",
  fqhc: "#0f7c86",
  rhc: "#6b5a8a",
};
