/**
 * State Configuration
 *
 * Central registry for all active and coming-soon states.
 * The VALID_STATES array is used for route validation — any
 * /[state]/ route not in this list returns 404.
 */

export const VALID_STATES = ["kentucky", "alaska", "texas"] as const;
export type ValidState = (typeof VALID_STATES)[number];

export function isValidState(s: string): s is ValidState {
  return VALID_STATES.includes(s as ValidState);
}

export interface StateConfig {
  slug: ValidState;
  name: string;
  abbreviation: string;
  rhtpAllocation: number;
  rhtpSource: string;
  accentColor: string;
  /** Extra sidebar items specific to this state, inserted after Need Assessment */
  extraSidebarItems?: Array<{
    href: string;
    label: string;
    icon: string;
  }>;
}

export const STATE_CONFIGS: Record<ValidState, StateConfig> = {
  kentucky: {
    slug: "kentucky",
    name: "Kentucky",
    abbreviation: "KY",
    rhtpAllocation: 212_900_000,
    rhtpSource: "CMS RHTP awards announcement, Dec 29, 2025",
    accentColor: "#c4612a",
  },
  alaska: {
    slug: "alaska",
    name: "Alaska",
    abbreviation: "AK",
    rhtpAllocation: 272_170_000,
    rhtpSource: "CMS RHTP awards announcement, Dec 29, 2025",
    accentColor: "#0f7c86",
    extraSidebarItems: [
      { href: "/alaska/tribal-health", label: "Tribal Health", icon: "HeartHandshake" },
    ],
  },
  texas: {
    slug: "texas",
    name: "Texas",
    abbreviation: "TX",
    rhtpAllocation: 281_320_000,
    rhtpSource: "CMS RHTP awards announcement, Dec 29, 2025",
    accentColor: "#1a3a52",
    extraSidebarItems: [
      { href: "/texas/east-texas-pilot", label: "East Texas Pilot Zone", icon: "MapPin" },
    ],
  },
};

/** States shown as "coming soon" tiles on the landing page */
export const COMING_SOON_STATES = [
  { name: "West Virginia", abbreviation: "WV" },
  { name: "Nebraska", abbreviation: "NE" },
  { name: "Mississippi", abbreviation: "MS" },
  { name: "California", abbreviation: "CA" },
  { name: "Montana", abbreviation: "MT" },
  { name: "New Mexico", abbreviation: "NM" },
];

/** RHTP program-level context (not state-specific) */
export const RHTP_PROGRAM = {
  totalFunding: "~$50B over FY2026–2030",
  statutoryBasis: "Public Law 119-21 (One Big Beautiful Bill Act / OBBBA)",
  adminBody: "CMS Office of Rural Health Transformation",
  formulaBreakdown:
    "50% equal split across approved states, 25% need-weighted, 5% rural-population-weighted, balance other factors",
  formulaSource: "KFF analysis of CMS Dec 2025 allocations",
  nationalHospitalClosures: 109,
  nationalClosuresSource: "Cecil G. Sheps Center for Health Services Research, rural hospital closures since 2005",
};
