/**
 * Connectivity Budget — maps bandwidth (Mbps) to real-world healthcare capabilities.
 *
 * Sources:
 * - FCC Healthcare Connect Fund program guidelines
 * - USDA Distance Learning & Telemedicine grants (bandwidth requirements)
 * - ATA (American Telemedicine Association) technical standards, 2024
 * - Vendor specs: Dexcom CGM (~0.1 Mbps), Amwell/Teladoc (~2-4 Mbps),
 *   Epic/Cerner EHR (~5 Mbps sustained), store-and-forward imaging (~10+ Mbps)
 */

/* ------------------------------------------------------------------ */
/*  Individual clinical services and their bandwidth requirements       */
/* ------------------------------------------------------------------ */

export interface ClinicalService {
  id: string;
  name: string;
  /** Minimum Mbps download needed for reliable operation */
  minMbps: number;
  /** Recommended Mbps download for comfortable operation */
  recommendedMbps: number;
  /** Short description for tooltips */
  description: string;
  /** Category grouping */
  category: "telehealth" | "monitoring" | "data" | "operations";
}

export const CLINICAL_SERVICES: ClinicalService[] = [
  // Telehealth
  {
    id: "video-consult",
    name: "Video telehealth visit",
    minMbps: 2,
    recommendedMbps: 5,
    description: "Live HD video consultation between patient and provider",
    category: "telehealth",
  },
  {
    id: "group-telehealth",
    name: "Group telehealth session",
    minMbps: 5,
    recommendedMbps: 15,
    description: "Multi-participant video (e.g. care team consult, group therapy)",
    category: "telehealth",
  },
  {
    id: "store-forward",
    name: "Store-and-forward imaging",
    minMbps: 5,
    recommendedMbps: 10,
    description: "Upload radiology, dermatology, or retinal images for specialist review",
    category: "telehealth",
  },

  // Remote patient monitoring
  {
    id: "rpm-vitals",
    name: "RPM vitals (BP, glucose, SpO2)",
    minMbps: 0.5,
    recommendedMbps: 1,
    description: "Continuous or periodic transmission of basic vital signs",
    category: "monitoring",
  },
  {
    id: "rpm-cgm",
    name: "Continuous glucose monitor",
    minMbps: 0.1,
    recommendedMbps: 0.5,
    description: "Real-time CGM data stream (e.g. Dexcom, Libre)",
    category: "monitoring",
  },
  {
    id: "rpm-cardiac",
    name: "Remote cardiac monitoring",
    minMbps: 1,
    recommendedMbps: 3,
    description: "ECG/Holter monitor streaming or periodic upload",
    category: "monitoring",
  },

  // Data & records
  {
    id: "ehr-access",
    name: "EHR access (Epic, Cerner)",
    minMbps: 3,
    recommendedMbps: 5,
    description: "Electronic health record read/write with clinical workflows",
    category: "data",
  },
  {
    id: "e-prescribe",
    name: "E-prescribing",
    minMbps: 0.5,
    recommendedMbps: 1,
    description: "Electronic prescription transmission to pharmacies",
    category: "data",
  },
  {
    id: "health-info-exchange",
    name: "Health information exchange",
    minMbps: 5,
    recommendedMbps: 10,
    description: "Sharing patient records across provider networks (HIE)",
    category: "data",
  },

  // Facility operations
  {
    id: "clinical-ai",
    name: "Clinical AI tools",
    minMbps: 10,
    recommendedMbps: 25,
    description: "AI-assisted diagnostics, clinical decision support, image analysis",
    category: "operations",
  },
  {
    id: "security-cameras",
    name: "Facility security (4 cameras)",
    minMbps: 8,
    recommendedMbps: 16,
    description: "HD security camera feeds (2-4 Mbps per camera)",
    category: "operations",
  },
  {
    id: "voip",
    name: "VoIP phone system",
    minMbps: 0.1,
    recommendedMbps: 0.5,
    description: "Per-line bandwidth for internet-based phone service",
    category: "operations",
  },
];

/* ------------------------------------------------------------------ */
/*  Bandwidth tiers — what can run at each speed level                 */
/* ------------------------------------------------------------------ */

export interface BandwidthTier {
  id: string;
  label: string;
  minMbps: number;
  maxMbps: number | null;
  color: string;
  /** Services that can run reliably at this tier */
  supportedServices: string[];
  /** Plain-language summary */
  summary: string;
}

export const BANDWIDTH_TIERS: BandwidthTier[] = [
  {
    id: "full",
    label: "Full capacity",
    minMbps: 100,
    maxMbps: null,
    color: "#0f7c86",
    supportedServices: ["video-consult", "group-telehealth", "store-forward", "rpm-vitals", "rpm-cgm", "rpm-cardiac", "ehr-access", "e-prescribe", "health-info-exchange", "clinical-ai", "security-cameras", "voip"],
    summary: "All clinical services simultaneously — telehealth, AI diagnostics, RPM, EHR, and facility operations",
  },
  {
    id: "clinical",
    label: "Clinical",
    minMbps: 25,
    maxMbps: 100,
    color: "#3a9ca5",
    supportedServices: ["video-consult", "store-forward", "rpm-vitals", "rpm-cgm", "rpm-cardiac", "ehr-access", "e-prescribe", "health-info-exchange", "voip"],
    summary: "Telehealth visits, EHR, remote monitoring, and e-prescribing — no AI or multi-site video",
  },
  {
    id: "minimal",
    label: "Minimal",
    minMbps: 10,
    maxMbps: 25,
    color: "#c49a2e",
    supportedServices: ["video-consult", "rpm-vitals", "rpm-cgm", "ehr-access", "e-prescribe", "voip"],
    summary: "One telehealth session at a time, basic RPM, EHR access — no imaging or group sessions",
  },
  {
    id: "insufficient",
    label: "Insufficient",
    minMbps: 0,
    maxMbps: 10,
    color: "#c46128",
    supportedServices: ["rpm-vitals", "rpm-cgm", "e-prescribe", "voip"],
    summary: "RPM data and e-prescribing only — no reliable video, no EHR workflows",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Given a speed in Mbps, return the tier and list of supported services */
export function getCapabilitiesAtSpeed(mbps: number) {
  const tier = BANDWIDTH_TIERS.find(
    (t) => mbps >= t.minMbps && (t.maxMbps === null || mbps < t.maxMbps),
  ) ?? BANDWIDTH_TIERS[BANDWIDTH_TIERS.length - 1];

  const services = CLINICAL_SERVICES.filter((s) =>
    tier.supportedServices.includes(s.id),
  );

  const unsupported = CLINICAL_SERVICES.filter(
    (s) => !tier.supportedServices.includes(s.id),
  );

  return { tier, services, unsupported };
}

/** For a given speed, how many simultaneous telehealth sessions can run? */
export function maxSimultaneousSessions(mbps: number): number {
  const perSession = 4; // ~4 Mbps per HD video session
  return Math.max(0, Math.floor(mbps / perSession));
}

/** Category labels for display */
export const CATEGORY_LABELS: Record<ClinicalService["category"], string> = {
  telehealth: "Telehealth",
  monitoring: "Remote monitoring",
  data: "Health data",
  operations: "Facility operations",
};
