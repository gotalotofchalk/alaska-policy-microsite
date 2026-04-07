#!/bin/bash
# RHT-NAV v2 Integration Script
# Run from the root of alaska-policy-microsite repo
# Usage: bash install-rht-nav.sh

set -e

echo "🏥 RHT-NAV v2 Integration Starting..."
echo ""

# Verify we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src/app" ]; then
  echo "❌ ERROR: Run this script from the root of the alaska-policy-microsite repo."
  echo "   cd ~/Desktop/alaska-policy-microsite && bash install-rht-nav.sh"
  exit 1
fi

echo "📁 Creating new directories..."
mkdir -p src/app/assess src/app/map src/app/portfolio-builder

echo "💾 Backing up files being replaced..."
[ -f src/app/page.tsx ] && cp src/app/page.tsx src/app/page.tsx.backup
[ -f src/components/site-header.tsx ] && cp src/components/site-header.tsx src/components/site-header.tsx.backup
[ -f src/components/site-footer.tsx ] && cp src/components/site-footer.tsx src/components/site-footer.tsx.backup

# ============================================================
# FILE 1: src/types/rht-nav.ts
# ============================================================
echo "📝 Writing src/types/rht-nav.ts..."
cat > src/types/rht-nav.ts << 'ENDOFFILE'
export type EvidenceTier = "source-backed" | "literature-backed" | "synthetic";

export interface BurdenSeverityIndicators {
  diabetesPrevalencePct: number;
  copdPrevalencePct: number;
  heartDiseasePrevalencePct: number;
  hypertensionPrevalencePct: number;
  suicideRatePer100k: number;
  overdoseMortalityPer100k: number;
  maternityDesertDesignation: boolean;
  maternalMorbidityRate: number;
  infantMortalityRate: number;
  preventableMortalityRate: number;
}

export interface AccessGapIndicators {
  avgTravelMinPrimaryCare: number;
  avgTravelMinSpecialty: number;
  avgTravelMinEmergency: number;
  avgTravelMinMaternity: number;
  hpsaScorePrimary: number;
  hpsaScoreMental: number;
  hpsaScoreDental: number;
  avoidableHospitalizationRate: number;
  broadbandAccessPct: number;
  ambulanceDesertDesignation: boolean;
}

export interface CapacityIndicators {
  physiciansPerCapita: number;
  nursesPerCapita: number;
  behavioralHealthProvidersPerCapita: number;
  emsVolunteerSharePct: number;
  vacancyRate: number;
  retirementProjectionPct: number;
  cahCount: number;
  fqhcCount: number;
  rhrCount: number;
  tribalFacilityCount: number;
  operatingMarginPct: number;
  closureVulnerabilityScore: number;
  edUtilizationRate: number;
  outOfStateReferralPct: number;
}

export interface ReadinessIndicators {
  broadbandSpeedMbps: number;
  hieParticipationPct: number;
  fhirCapablePct: number;
  cybersecurityBaselineScore: number;
  telehealthUtilizationRate: number;
  rpmExperienceLevel: "none" | "pilot" | "operational";
  changeManagementCapacity: "low" | "moderate" | "high";
  telehealthParityLaw: boolean;
  interstateCompactMember: boolean;
  medicaidRemoteReimbursement: boolean;
  scopeOfPracticeBarriers: "none" | "moderate" | "severe";
  baselineMetricsAvailable: boolean;
  cmsReportingCadenceEstablished: boolean;
  countyLevelOutcomeDataAvailable: boolean;
}

export interface RegionScores {
  deficitSeverityScore: number;
  populationImpactSubScore: number;
  systemImpactSubScore: number;
  equityImpactSubScore: number;
  executionReadinessScore: number;
  digitalReadinessSubScore: number;
  operationalReadinessSubScore: number;
  policyReadinessSubScore: number;
  measurementReadinessSubScore: number;
}

export type TierClassification = "green" | "red";
export type PathwayType = "fast-start" | "build-first" | "coordination-hub";

export interface RegionAssessment {
  slug: string;
  name: string;
  state: string;
  population: number;
  ruralPopulation: number;
  scores: RegionScores;
  tier: TierClassification;
  pathway: PathwayType;
  topDeficits: string[];
  recommendedInitiatives: string[];
  expectedTimeToSignalMonths: number;
  cmsCategories: CMSCategory[];
}

export type CMSCategory =
  | "prevention_chronic_disease"
  | "workforce_development"
  | "health_it"
  | "consumer_health_tech"
  | "behavioral_health"
  | "innovative_care_delivery";

export const CMS_CATEGORY_LABELS: Record<CMSCategory, string> = {
  prevention_chronic_disease: "Evidence-Based Prevention & Chronic Disease Management",
  workforce_development: "Workforce Development",
  health_it: "Health Information Technology",
  consumer_health_tech: "Consumer Health Technologies",
  behavioral_health: "Behavioral Health Expansion",
  innovative_care_delivery: "Innovative Care Delivery Models",
};

export interface CMSComplianceCheck {
  meetsMinimumCategories: boolean;
  adminCostWithinCap: boolean;
  providerPaymentWithinCap: boolean;
  ehrUpgradeWithinCap: boolean;
  noProhibitedUses: boolean;
  broadbandWorkaround: boolean;
}

export type InterventionType =
  | "telehealth_virtual_care"
  | "remote_patient_monitoring"
  | "cybersecurity_interoperability"
  | "workforce_development"
  | "ai_clinical_tools"
  | "ehr_integration"
  | "behavioral_health_platform"
  | "maternal_health_monitoring"
  | "emergency_transport_coordination"
  | "community_health_worker_network";

export interface InterventionOption {
  type: InterventionType;
  label: string;
  description: string;
  cmsCategories: CMSCategory[];
  prerequisites: string[];
  estimatedTimeToSignalMonths: number;
  estimatedCostRange: { low: number; high: number };
  rhtCollaborativePartner?: string;
  rhtCollaborativeTool?: string;
  synergyWith: InterventionType[];
  evidenceTier: EvidenceTier;
}

export interface PortfolioSelection {
  regionSlug: string;
  selectedInterventions: InterventionType[];
  totalEstimatedCost: { low: number; base: number; high: number };
  cmsComplianceStatus: CMSComplianceCheck;
  synergyScore: number;
  timeToSignalDistribution: {
    quickWin: number;
    mediumTerm: number;
    longHorizon: number;
  };
  projectedOutcomes: ProjectedOutcome[];
}

export interface ProjectedOutcome {
  metric: string;
  baseline: number;
  projected: number;
  timeframeMonths: number;
  confidenceLevel: "high" | "moderate" | "indicative";
  cmsReportable: boolean;
}

export interface ArcGISLayerConfig {
  id: string;
  label: string;
  url: string;
  type: "feature" | "tile" | "webmap";
  visible: boolean;
  domain: "need" | "capacity" | "readiness";
  opacity: number;
}

export interface StateConfig {
  stateCode: string;
  stateName: string;
  geoUnit: "health_region" | "county" | "health_service_area";
  geoUnitLabel: string;
  rhtpAwardAmount: number;
  rhtpAwardPerYear: number;
  arcgisWebMapId?: string;
  arcgisPortalUrl: string;
  regions: RegionAssessment[];
}
ENDOFFILE

# ============================================================
# FILE 2: src/data/intervention-catalog.ts
# ============================================================
echo "📝 Writing src/data/intervention-catalog.ts..."
cat > src/data/intervention-catalog.ts << 'ENDOFFILE'
import type { InterventionOption } from "@/types/rht-nav";

export const INTERVENTION_CATALOG: InterventionOption[] = [
  {
    type: "cybersecurity_interoperability",
    label: "Cybersecurity & Data Infrastructure",
    description: "Enterprise-grade cybersecurity, FHIR-enabled interoperability, and secure cloud migration. The foundational layer that every other intervention depends on.",
    cmsCategories: ["health_it"],
    prerequisites: [],
    estimatedTimeToSignalMonths: 3,
    estimatedCostRange: { low: 80000, high: 250000 },
    rhtCollaborativePartner: "Microsoft",
    rhtCollaborativeTool: "Azure Health Data Services, Enterprise Cybersecurity",
    synergyWith: ["telehealth_virtual_care", "remote_patient_monitoring", "ehr_integration", "ai_clinical_tools"],
    evidenceTier: "source-backed",
  },
  {
    type: "ehr_integration",
    label: "EHR Integration & HIE Connectivity",
    description: "Connect fragmented EHR systems into a shared data backbone via FHIR APIs and state HIE participation.",
    cmsCategories: ["health_it", "innovative_care_delivery"],
    prerequisites: ["cybersecurity_interoperability"],
    estimatedTimeToSignalMonths: 6,
    estimatedCostRange: { low: 120000, high: 400000 },
    rhtCollaborativePartner: "Microsoft",
    rhtCollaborativeTool: "Azure Health Data Services (FHIR)",
    synergyWith: ["cybersecurity_interoperability", "telehealth_virtual_care", "ai_clinical_tools", "remote_patient_monitoring"],
    evidenceTier: "literature-backed",
  },
  {
    type: "telehealth_virtual_care",
    label: "Telehealth & Virtual Specialty Access",
    description: "Video and store-and-forward telehealth connecting rural patients to specialists. Includes eConsult platforms that resolve 45-65% of referrals without in-person visits.",
    cmsCategories: ["innovative_care_delivery", "health_it"],
    prerequisites: ["cybersecurity_interoperability"],
    estimatedTimeToSignalMonths: 4,
    estimatedCostRange: { low: 150000, high: 500000 },
    rhtCollaborativePartner: "Avel eCare / Teladoc / Cibolo Health",
    rhtCollaborativeTool: "Telehealth delivery platforms",
    synergyWith: ["ehr_integration", "behavioral_health_platform", "ai_clinical_tools", "workforce_development"],
    evidenceTier: "literature-backed",
  },
  {
    type: "remote_patient_monitoring",
    label: "Remote Patient Monitoring",
    description: "FDA-cleared continuous monitoring for chronic conditions (diabetes, heart failure, COPD).",
    cmsCategories: ["consumer_health_tech", "prevention_chronic_disease"],
    prerequisites: ["cybersecurity_interoperability", "ehr_integration"],
    estimatedTimeToSignalMonths: 6,
    estimatedCostRange: { low: 200000, high: 600000 },
    rhtCollaborativePartner: "BioIntelliSense",
    rhtCollaborativeTool: "BioButton, BioHub continuous monitoring",
    synergyWith: ["telehealth_virtual_care", "ai_clinical_tools", "community_health_worker_network"],
    evidenceTier: "literature-backed",
  },
  {
    type: "ai_clinical_tools",
    label: "AI Clinical Decision Support",
    description: "AI-powered documentation, clinical triage, and diagnostic screening including ambient clinical AI and autonomous retinal screening.",
    cmsCategories: ["health_it", "innovative_care_delivery"],
    prerequisites: ["cybersecurity_interoperability", "ehr_integration"],
    estimatedTimeToSignalMonths: 6,
    estimatedCostRange: { low: 100000, high: 350000 },
    rhtCollaborativePartner: "Microsoft",
    rhtCollaborativeTool: "Dragon Copilot, AI Retinal Screening (Topcon)",
    synergyWith: ["telehealth_virtual_care", "remote_patient_monitoring", "workforce_development"],
    evidenceTier: "literature-backed",
  },
  {
    type: "workforce_development",
    label: "Workforce Training & Pipeline",
    description: "Digital skills training, VR-based clinical simulation, community health worker certification, and top-of-license practice enablement.",
    cmsCategories: ["workforce_development"],
    prerequisites: [],
    estimatedTimeToSignalMonths: 9,
    estimatedCostRange: { low: 100000, high: 400000 },
    rhtCollaborativePartner: "Accenture / KPMG / PwC / AVIA",
    rhtCollaborativeTool: "Training platforms, change management",
    synergyWith: ["telehealth_virtual_care", "ai_clinical_tools", "community_health_worker_network"],
    evidenceTier: "literature-backed",
  },
  {
    type: "behavioral_health_platform",
    label: "Behavioral Health & Crisis Access",
    description: "Telebehavioral health for communities where anonymity and distance barriers prevent in-person help-seeking.",
    cmsCategories: ["behavioral_health", "innovative_care_delivery"],
    prerequisites: ["telehealth_virtual_care"],
    estimatedTimeToSignalMonths: 6,
    estimatedCostRange: { low: 120000, high: 350000 },
    rhtCollaborativePartner: "Avel eCare / Cibolo Health",
    rhtCollaborativeTool: "Telebehavioral health platforms",
    synergyWith: ["telehealth_virtual_care", "community_health_worker_network", "workforce_development"],
    evidenceTier: "literature-backed",
  },
  {
    type: "maternal_health_monitoring",
    label: "Maternal & Prenatal Care Access",
    description: "Remote prenatal monitoring, teleconsult OB access, and risk stratification for maternity care desert communities.",
    cmsCategories: ["consumer_health_tech", "innovative_care_delivery"],
    prerequisites: ["telehealth_virtual_care", "remote_patient_monitoring"],
    estimatedTimeToSignalMonths: 8,
    estimatedCostRange: { low: 150000, high: 450000 },
    rhtCollaborativePartner: "BioIntelliSense / Telehealth Partners",
    synergyWith: ["remote_patient_monitoring", "telehealth_virtual_care", "community_health_worker_network"],
    evidenceTier: "literature-backed",
  },
  {
    type: "emergency_transport_coordination",
    label: "Emergency & Transport Coordination",
    description: "Digital dispatch coordination, telehealth-enabled triage to reduce unnecessary transports, and EMS system modernization.",
    cmsCategories: ["innovative_care_delivery", "health_it"],
    prerequisites: ["cybersecurity_interoperability"],
    estimatedTimeToSignalMonths: 5,
    estimatedCostRange: { low: 80000, high: 300000 },
    rhtCollaborativePartner: "Microsoft / Connectivity Partners",
    rhtCollaborativeTool: "Azure-based coordination systems",
    synergyWith: ["telehealth_virtual_care", "cybersecurity_interoperability"],
    evidenceTier: "synthetic",
  },
  {
    type: "community_health_worker_network",
    label: "Community Health Worker Network",
    description: "Training and equipping local residents as frontline health workers with digital tools. Proven model via Alaska CHA/P program.",
    cmsCategories: ["workforce_development", "prevention_chronic_disease"],
    prerequisites: [],
    estimatedTimeToSignalMonths: 9,
    estimatedCostRange: { low: 80000, high: 250000 },
    rhtCollaborativePartner: "AVIA / State Programs",
    synergyWith: ["remote_patient_monitoring", "behavioral_health_platform", "workforce_development"],
    evidenceTier: "literature-backed",
  },
];

export function getInterventionByType(type: string) {
  return INTERVENTION_CATALOG.find((i) => i.type === type);
}

export function calculateSynergyScore(selectedTypes: string[]): number {
  if (selectedTypes.length <= 1) return 0;
  let synergyLinks = 0;
  let maxPossibleLinks = 0;
  for (const intervention of INTERVENTION_CATALOG) {
    if (!selectedTypes.includes(intervention.type)) continue;
    for (const synergyType of intervention.synergyWith) {
      maxPossibleLinks++;
      if (selectedTypes.includes(synergyType)) synergyLinks++;
    }
  }
  return maxPossibleLinks > 0 ? Math.round((synergyLinks / maxPossibleLinks) * 100) : 0;
}

export function checkCMSCompliance(selectedTypes: string[]) {
  const categories = new Set<string>();
  for (const intervention of INTERVENTION_CATALOG) {
    if (!selectedTypes.includes(intervention.type)) continue;
    for (const cat of intervention.cmsCategories) categories.add(cat);
  }
  return { categories, meetsMinimum: categories.size >= 3, categoryCount: categories.size };
}

export function getUnmetPrerequisites(selectedTypes: string[]): Map<string, string[]> {
  const unmet = new Map<string, string[]>();
  for (const intervention of INTERVENTION_CATALOG) {
    if (!selectedTypes.includes(intervention.type)) continue;
    const missing = intervention.prerequisites.filter((p) => !selectedTypes.includes(p));
    if (missing.length > 0) unmet.set(intervention.type, missing);
  }
  return unmet;
}
ENDOFFILE

# ============================================================
# FILE 3: src/data/alaska-assessment.ts
# ============================================================
echo "📝 Writing src/data/alaska-assessment.ts..."
cat > src/data/alaska-assessment.ts << 'ENDOFFILE'
import type { RegionAssessment, StateConfig } from "@/types/rht-nav";

const alaskaRegions: RegionAssessment[] = [
  { slug: "anchorage", name: "Anchorage", state: "AK", population: 289069, ruralPopulation: 14450, scores: { deficitSeverityScore: 39.7, populationImpactSubScore: 52, systemImpactSubScore: 28, equityImpactSubScore: 38, executionReadinessScore: 81.9, digitalReadinessSubScore: 88, operationalReadinessSubScore: 82, policyReadinessSubScore: 76, measurementReadinessSubScore: 80 }, tier: "green", pathway: "coordination-hub", topDeficits: ["Statewide specialist referral bottleneck", "Out-of-state referral dependency", "Behavioral health capacity constraints"], recommendedInitiatives: ["cybersecurity_interoperability", "ehr_integration", "ai_clinical_tools", "telehealth_virtual_care"], expectedTimeToSignalMonths: 4, cmsCategories: ["health_it", "innovative_care_delivery", "workforce_development"] },
  { slug: "gulf-coast", name: "Gulf Coast", state: "AK", population: 82311, ruralPopulation: 41155, scores: { deficitSeverityScore: 35.4, populationImpactSubScore: 38, systemImpactSubScore: 34, equityImpactSubScore: 33, executionReadinessScore: 58.0, digitalReadinessSubScore: 61, operationalReadinessSubScore: 58, policyReadinessSubScore: 56, measurementReadinessSubScore: 55 }, tier: "green", pathway: "fast-start", topDeficits: ["Limited specialty access beyond primary care", "Referral completion barriers", "Chronic disease management gaps"], recommendedInitiatives: ["cybersecurity_interoperability", "telehealth_virtual_care", "remote_patient_monitoring", "workforce_development"], expectedTimeToSignalMonths: 6, cmsCategories: ["health_it", "innovative_care_delivery", "consumer_health_tech", "workforce_development"] },
  { slug: "interior", name: "Interior", state: "AK", population: 109791, ruralPopulation: 54895, scores: { deficitSeverityScore: 31.2, populationImpactSubScore: 36, systemImpactSubScore: 30, equityImpactSubScore: 28, executionReadinessScore: 57.3, digitalReadinessSubScore: 56, operationalReadinessSubScore: 60, policyReadinessSubScore: 56, measurementReadinessSubScore: 56 }, tier: "green", pathway: "fast-start", topDeficits: ["Sparse spoke communities beyond Fairbanks hub", "Mixed broadband reliability", "Workforce aging and turnover"], recommendedInitiatives: ["cybersecurity_interoperability", "telehealth_virtual_care", "ai_clinical_tools", "workforce_development"], expectedTimeToSignalMonths: 6, cmsCategories: ["health_it", "innovative_care_delivery", "workforce_development"] },
  { slug: "mat-su", name: "Mat-Su", state: "AK", population: 110677, ruralPopulation: 55338, scores: { deficitSeverityScore: 30.5, populationImpactSubScore: 40, systemImpactSubScore: 26, equityImpactSubScore: 25, executionReadinessScore: 63.4, digitalReadinessSubScore: 69, operationalReadinessSubScore: 64, policyReadinessSubScore: 60, measurementReadinessSubScore: 58 }, tier: "green", pathway: "fast-start", topDeficits: ["Growing population outpacing provider supply", "Specialty follow-up dependent on Anchorage", "Chronic disease burden rising with population"], recommendedInitiatives: ["cybersecurity_interoperability", "telehealth_virtual_care", "remote_patient_monitoring", "community_health_worker_network"], expectedTimeToSignalMonths: 5, cmsCategories: ["health_it", "innovative_care_delivery", "consumer_health_tech", "prevention_chronic_disease"] },
  { slug: "northern", name: "Northern", state: "AK", population: 28427, ruralPopulation: 27005, scores: { deficitSeverityScore: 61.4, populationImpactSubScore: 68, systemImpactSubScore: 62, equityImpactSubScore: 72, executionReadinessScore: 36.0, digitalReadinessSubScore: 32, operationalReadinessSubScore: 34, policyReadinessSubScore: 42, measurementReadinessSubScore: 30 }, tier: "red", pathway: "build-first", topDeficits: ["Extreme geographic isolation (air access only)", "Sparse workforce with no specialty presence", "Fragile broadband and connectivity", "Highest diabetes prevalence in state", "Elevated behavioral health burden"], recommendedInitiatives: ["cybersecurity_interoperability", "workforce_development", "community_health_worker_network", "emergency_transport_coordination", "behavioral_health_platform"], expectedTimeToSignalMonths: 9, cmsCategories: ["health_it", "workforce_development", "behavioral_health", "innovative_care_delivery", "prevention_chronic_disease"] },
  { slug: "southeast", name: "Southeast", state: "AK", population: 71666, ruralPopulation: 35833, scores: { deficitSeverityScore: 33.7, populationImpactSubScore: 35, systemImpactSubScore: 32, equityImpactSubScore: 34, executionReadinessScore: 57.5, digitalReadinessSubScore: 58, operationalReadinessSubScore: 60, policyReadinessSubScore: 56, measurementReadinessSubScore: 54 }, tier: "green", pathway: "fast-start", topDeficits: ["Island and marine geography complicating referrals", "Mixed connectivity across coastal communities", "Distance to specialist care beyond Juneau"], recommendedInitiatives: ["cybersecurity_interoperability", "telehealth_virtual_care", "ehr_integration", "workforce_development"], expectedTimeToSignalMonths: 6, cmsCategories: ["health_it", "innovative_care_delivery", "workforce_development"] },
  { slug: "southwest", name: "Southwest", state: "AK", population: 42030, ruralPopulation: 39928, scores: { deficitSeverityScore: 72.8, populationImpactSubScore: 76, systemImpactSubScore: 70, equityImpactSubScore: 80, executionReadinessScore: 39.2, digitalReadinessSubScore: 35, operationalReadinessSubScore: 38, policyReadinessSubScore: 44, measurementReadinessSubScore: 34 }, tier: "red", pathway: "build-first", topDeficits: ["Highest deficit severity score in state", "Frontier geography with dispersed population", "Highest diabetes and access gap prevalence", "Patchy remote connectivity", "Limited measurement infrastructure"], recommendedInitiatives: ["cybersecurity_interoperability", "workforce_development", "community_health_worker_network", "emergency_transport_coordination", "telehealth_virtual_care", "behavioral_health_platform"], expectedTimeToSignalMonths: 10, cmsCategories: ["health_it", "workforce_development", "behavioral_health", "innovative_care_delivery", "prevention_chronic_disease"] },
];

export const ALASKA_CONFIG: StateConfig = { stateCode: "AK", stateName: "Alaska", geoUnit: "health_region", geoUnitLabel: "Public Health Region", rhtpAwardAmount: 272174856, rhtpAwardPerYear: 272174856, arcgisPortalUrl: "https://stanford.maps.arcgis.com", regions: alaskaRegions };

export function getAlaskaRegion(slug: string) { return alaskaRegions.find((r) => r.slug === slug); }
export function getGreenRegions() { return alaskaRegions.filter((r) => r.tier === "green"); }
export function getRedRegions() { return alaskaRegions.filter((r) => r.tier === "red"); }
ENDOFFILE

# ============================================================
# FILE 4: src/app/assess/page.tsx
# ============================================================
echo "📝 Writing src/app/assess/page.tsx..."
cat > src/app/assess/page.tsx << 'ENDOFFILE'
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ALASKA_CONFIG } from "@/data/alaska-assessment";
import { INTERVENTION_CATALOG } from "@/data/intervention-catalog";
import { CMS_CATEGORY_LABELS } from "@/types/rht-nav";

export default function AssessPage() {
  const regions = ALASKA_CONFIG.regions;
  return (
    <>
      <PageHero eyebrow="Regional Assessment" title="Severity, capacity, readiness, and tier classification for each Alaska region." lede="Each region is scored across three domains and classified as Green (fast-start) or Red (build-first). Drill into any region to see the deficit breakdown and recommended portfolio." compact />
      <Reveal>
        <section className="grid gap-4 lg:grid-cols-2">
          {regions.map((region) => {
            const tierColor = region.tier === "green" ? "border-[color:rgba(15,124,134,0.2)] bg-[linear-gradient(180deg,rgba(15,124,134,0.04),rgba(255,255,255,0.96))]" : "border-[color:rgba(196,97,42,0.2)] bg-[linear-gradient(180deg,rgba(196,97,42,0.04),rgba(255,255,255,0.96))]";
            const tierLabel = region.pathway === "coordination-hub" ? "Coordination Hub" : region.tier === "green" ? "Fast-Start" : "Build-First";
            return (
              <article key={region.slug} className={`rounded-[1.9rem] border p-6 shadow-[var(--shadow-soft)] ${tierColor}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${region.tier === "green" ? "bg-[color:var(--teal)]" : "bg-[color:var(--accent)]"}`} />
                      <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">{tierLabel}</span>
                    </div>
                    <h2 className="mt-2 font-display text-3xl text-[color:var(--foreground)]">{region.name}</h2>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">Population: {region.population.toLocaleString()} &middot; Signal: {region.expectedTimeToSignalMonths} months</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-[color:var(--muted)]">Severity / Readiness</p>
                    <p className="mt-1 font-display text-2xl text-[color:var(--foreground)]">{region.scores.deficitSeverityScore.toFixed(0)} / {region.scores.executionReadinessScore.toFixed(0)}</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <ScoreBar label="Deficit Severity" score={region.scores.deficitSeverityScore} color="var(--accent)" subScores={[{label:"Population",value:region.scores.populationImpactSubScore},{label:"System",value:region.scores.systemImpactSubScore},{label:"Equity",value:region.scores.equityImpactSubScore}]} />
                  <ScoreBar label="Execution Readiness" score={region.scores.executionReadinessScore} color="var(--teal)" subScores={[{label:"Digital",value:region.scores.digitalReadinessSubScore},{label:"Operational",value:region.scores.operationalReadinessSubScore},{label:"Policy",value:region.scores.policyReadinessSubScore},{label:"Measurement",value:region.scores.measurementReadinessSubScore}]} />
                </div>
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-wider text-[color:var(--muted)]">Top deficits</p>
                  <ul className="mt-2 space-y-1">{region.topDeficits.map((d) => (<li key={d} className="rounded-lg border border-[color:var(--line)] bg-white/60 px-3 py-2 text-sm text-[color:var(--foreground)]">{d}</li>))}</ul>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-wider text-[color:var(--muted)]">Recommended portfolio</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">{region.recommendedInitiatives.map((type) => { const i = INTERVENTION_CATALOG.find((x) => x.type === type); return (<span key={type} className="rounded-full border border-[color:var(--line)] bg-white/80 px-2.5 py-1 text-[11px] text-[color:var(--foreground)]">{i?.label ?? type}</span>);})}</div>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-wider text-[color:var(--muted)]">CMS categories covered ({region.cmsCategories.length}/6)</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">{region.cmsCategories.map((cat) => (<span key={cat} className="rounded-full bg-[color:rgba(15,124,134,0.1)] px-2.5 py-1 text-[10px] text-[color:var(--teal)]">{CMS_CATEGORY_LABELS[cat].split("&")[0].trim()}</span>))}</div>
                </div>
                <div className="mt-5"><Link href={`/portfolio-builder?region=${region.slug}`} className="inline-flex rounded-full border border-[color:var(--line)] bg-white px-4 py-2.5 text-sm text-[color:var(--foreground)] transition-colors hover:bg-[color:#f9f5ee]">Build portfolio for {region.name}</Link></div>
              </article>
            );
          })}
        </section>
      </Reveal>
    </>
  );
}

function ScoreBar({label,score,color,subScores}:{label:string;score:number;color:string;subScores:Array<{label:string;value:number}>}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm"><span className="font-medium text-[color:var(--foreground)]">{label}</span><span className="font-display text-lg text-[color:var(--foreground)]">{score.toFixed(1)}</span></div>
      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[color:#efe8db]"><div className="h-full rounded-full transition-all duration-500" style={{width:`${Math.min(score,100)}%`,backgroundColor:color}} /></div>
      <div className="mt-2 flex gap-2">{subScores.map((sub) => (<div key={sub.label} className="flex-1"><div className="flex items-center justify-between text-[10px] text-[color:var(--muted)]"><span>{sub.label}</span><span>{sub.value}</span></div><div className="mt-0.5 h-1 overflow-hidden rounded-full bg-[color:#efe8db]"><div className="h-full rounded-full opacity-60 transition-all duration-500" style={{width:`${Math.min(sub.value,100)}%`,backgroundColor:color}} /></div></div>))}</div>
    </div>
  );
}
ENDOFFILE

# ============================================================
# FILE 5: src/app/map/page.tsx
# ============================================================
echo "📝 Writing src/app/map/page.tsx..."
cat > src/app/map/page.tsx << 'ENDOFFILE'
"use client";
import { useState } from "react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

const MAP_VIEWS = [
  { id: "hub-full", label: "Full RHT-NAV Hub", description: "Complete ArcGIS Hub site with all data layers.", url: "https://rht-nav-stanford.hub.arcgis.com/", domain: "all" as const },
  { id: "svi", label: "Social Vulnerability Index", description: "CDC/ATSDR Social Vulnerability Index.", url: "https://rht-nav-stanford.hub.arcgis.com/", domain: "need" as const },
  { id: "disease-burden", label: "Disease Burden", description: "Chronic disease prevalence and behavioral health indicators.", url: "https://rht-nav-stanford.hub.arcgis.com/", domain: "need" as const },
  { id: "provider-access", label: "Provider & Facility Access", description: "Healthcare provider density, HPSA designations, facility locations.", url: "https://rht-nav-stanford.hub.arcgis.com/", domain: "capacity" as const },
  { id: "broadband", label: "Broadband & Connectivity", description: "FCC broadband availability and digital infrastructure.", url: "https://rht-nav-stanford.hub.arcgis.com/", domain: "readiness" as const },
];

const DOMAIN_COLORS = { all: "bg-[color:var(--foreground)] text-white", need: "bg-[color:rgba(196,97,42,0.12)] text-[color:var(--accent)]", capacity: "bg-[color:rgba(16,34,53,0.1)] text-[color:var(--foreground)]", readiness: "bg-[color:rgba(15,124,134,0.12)] text-[color:var(--teal)]" };

export default function MapPage() {
  const [activeView, setActiveView] = useState(MAP_VIEWS[0]);
  return (
    <>
      <PageHero eyebrow="Interactive Map" title="Explore the data layers that feed severity and readiness scoring." lede="Each layer maps to one of the three RHT-NAV assessment domains." compact />
      <Reveal>
        <section className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className="space-y-2">
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">Map layers</p>
            {MAP_VIEWS.map((view) => (
              <button key={view.id} type="button" onClick={() => setActiveView(view)} className={`w-full rounded-[1.2rem] border p-3 text-left transition-all ${activeView.id === view.id ? "border-[color:var(--foreground)] bg-[color:#102235] text-white shadow-lg" : "border-[color:var(--line)] bg-white/80 text-[color:var(--foreground)] hover:bg-white"}`}>
                <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${activeView.id === view.id ? "bg-white/15 text-white/80" : DOMAIN_COLORS[view.domain]}`}>{view.domain === "all" ? "All" : `Domain: ${view.domain}`}</span>
                <p className="mt-1.5 text-sm font-medium">{view.label}</p>
                <p className={`mt-1 text-xs leading-5 ${activeView.id === view.id ? "text-white/65" : "text-[color:var(--muted)]"}`}>{view.description}</p>
              </button>
            ))}
          </aside>
          <div className="surface-card overflow-hidden rounded-[2rem] border">
            <div className="flex items-center justify-between border-b border-[color:var(--line)] px-5 py-3">
              <div><p className="font-medium text-[color:var(--foreground)]">{activeView.label}</p><p className="text-xs text-[color:var(--muted)]">{activeView.description}</p></div>
              <a href={activeView.url} target="_blank" rel="noreferrer" className="rounded-full border border-[color:var(--line)] bg-white px-3 py-1.5 text-xs text-[color:var(--foreground)] transition-colors hover:bg-[color:#f9f5ee]">Open in ArcGIS Hub</a>
            </div>
            <div className="relative h-[600px] w-full bg-[color:#e8e4dc]"><iframe src={activeView.url} className="absolute inset-0 h-full w-full border-0" title={`RHT-NAV Map: ${activeView.label}`} loading="lazy" allow="geolocation" /></div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
ENDOFFILE

# ============================================================
# FILE 6: src/app/portfolio-builder/page.tsx
# ============================================================
echo "📝 Writing src/app/portfolio-builder/page.tsx..."
cat > src/app/portfolio-builder/page.tsx << 'ENDOFFILE'
"use client";
import { motion } from "framer-motion";
import { AlertTriangle, Check, CheckCircle2, Clock, LinkIcon, Shield, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ALASKA_CONFIG } from "@/data/alaska-assessment";
import { calculateSynergyScore, checkCMSCompliance, getUnmetPrerequisites, INTERVENTION_CATALOG } from "@/data/intervention-catalog";
import { CMS_CATEGORY_LABELS } from "@/types/rht-nav";

function PortfolioBuilderInner() {
  const searchParams = useSearchParams();
  const initialRegion = searchParams.get("region") ?? ALASKA_CONFIG.regions[0].slug;
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [selectedInterventions, setSelectedInterventions] = useState<Set<string>>(() => { const region = ALASKA_CONFIG.regions.find((r) => r.slug === initialRegion); return new Set(region?.recommendedInitiatives ?? []); });
  const region = ALASKA_CONFIG.regions.find((r) => r.slug === selectedRegion) ?? ALASKA_CONFIG.regions[0];
  const selected = Array.from(selectedInterventions);
  const synergyScore = calculateSynergyScore(selected);
  const compliance = checkCMSCompliance(selected);
  const unmetPrereqs = getUnmetPrerequisites(selected);
  const totalCostLow = INTERVENTION_CATALOG.filter((i) => selected.includes(i.type)).reduce((s, i) => s + i.estimatedCostRange.low, 0);
  const totalCostHigh = INTERVENTION_CATALOG.filter((i) => selected.includes(i.type)).reduce((s, i) => s + i.estimatedCostRange.high, 0);
  const timeDistribution = { quickWin: INTERVENTION_CATALOG.filter((i) => selected.includes(i.type) && i.estimatedTimeToSignalMonths <= 5).length, mediumTerm: INTERVENTION_CATALOG.filter((i) => selected.includes(i.type) && i.estimatedTimeToSignalMonths > 5 && i.estimatedTimeToSignalMonths <= 9).length, longHorizon: INTERVENTION_CATALOG.filter((i) => selected.includes(i.type) && i.estimatedTimeToSignalMonths > 9).length };

  function toggleIntervention(type: string) { setSelectedInterventions((prev) => { const next = new Set(prev); if (next.has(type)) next.delete(type); else next.add(type); return next; }); }
  function handleRegionChange(slug: string) { setSelectedRegion(slug); const r = ALASKA_CONFIG.regions.find((x) => x.slug === slug); if (r) setSelectedInterventions(new Set(r.recommendedInitiatives)); }

  return (
    <>
      <PageHero eyebrow="Portfolio Builder" title="Select interventions. Check compliance. Score synergy. Sequence deployment." lede="Build a CMS-compliant technology portfolio for any Alaska region." compact />
      <Reveal>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <section className="space-y-4">
            <div className="surface-card rounded-[1.8rem] border p-5">
              <label className="block space-y-2"><span className="text-sm font-medium text-[color:var(--foreground)]">Region</span>
                <select className="field-shell" value={selectedRegion} onChange={(e) => handleRegionChange(e.target.value)}>{ALASKA_CONFIG.regions.map((r) => (<option key={r.slug} value={r.slug}>{r.name} ({r.tier === "green" ? "Fast-Start" : "Build-First"})</option>))}</select>
              </label>
            </div>
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">Select interventions ({selected.length} of {INTERVENTION_CATALOG.length})</p>
            <div className="space-y-2">
              {INTERVENTION_CATALOG.map((intervention) => { const isSelected = selectedInterventions.has(intervention.type); const isRecommended = region.recommendedInitiatives.includes(intervention.type); const hasUnmet = isSelected && unmetPrereqs.has(intervention.type);
                return (
                  <motion.button key={intervention.type} type="button" onClick={() => toggleIntervention(intervention.type)} className={`w-full rounded-[1.4rem] border p-4 text-left transition-all ${isSelected ? "border-[color:var(--foreground)] bg-[color:#102235] text-white shadow-lg" : "border-[color:var(--line)] bg-white/80 text-[color:var(--foreground)] hover:bg-white"}`} whileHover={{y:-1}} transition={{type:"spring",stiffness:300,damping:25}}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">{intervention.label}</p>
                          {isRecommended && <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${isSelected ? "bg-white/15 text-white/70" : "bg-[color:rgba(15,124,134,0.12)] text-[color:var(--teal)]"}`}>Recommended</span>}
                          {hasUnmet && <span className="flex items-center gap-1 rounded-full bg-[color:rgba(196,97,42,0.12)] px-2 py-0.5 text-[10px] text-[color:var(--accent)]"><AlertTriangle className="h-3 w-3" /> Prerequisites needed</span>}
                        </div>
                        <p className={`mt-1 text-xs leading-5 ${isSelected ? "text-white/65" : "text-[color:var(--muted)]"}`}>{intervention.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {intervention.rhtCollaborativePartner && <span className={`rounded-full px-2 py-0.5 text-[10px] ${isSelected ? "bg-white/10 text-white/60" : "bg-[color:var(--line)] text-[color:var(--muted)]"}`}>{intervention.rhtCollaborativePartner.split("/")[0].trim()}</span>}
                          <span className={`rounded-full px-2 py-0.5 text-[10px] ${isSelected ? "bg-white/10 text-white/60" : "bg-[color:var(--line)] text-[color:var(--muted)]"}`}>{intervention.estimatedTimeToSignalMonths}mo signal</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] ${isSelected ? "bg-white/10 text-white/60" : "bg-[color:var(--line)] text-[color:var(--muted)]"}`}>${(intervention.estimatedCostRange.low/1000).toFixed(0)}K-${(intervention.estimatedCostRange.high/1000).toFixed(0)}K</span>
                        </div>
                      </div>
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${isSelected ? "border-white/30 bg-white/20" : "border-[color:var(--line)] bg-white"}`}>{isSelected && <Check className="h-4 w-4 text-white" />}</div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>

          <section className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <div className={`rounded-[1.8rem] border p-5 ${compliance.meetsMinimum ? "border-[color:rgba(15,124,134,0.2)] bg-[linear-gradient(180deg,rgba(15,124,134,0.06),rgba(255,255,255,0.96))]" : "border-[color:rgba(196,97,42,0.2)] bg-[linear-gradient(180deg,rgba(196,97,42,0.06),rgba(255,255,255,0.96))]"}`}>
              <div className="flex items-center gap-2">{compliance.meetsMinimum ? <CheckCircle2 className="h-5 w-5 text-[color:var(--teal)]" /> : <XCircle className="h-5 w-5 text-[color:var(--accent)]" />}<p className="text-sm font-medium text-[color:var(--foreground)]">CMS Compliance: {compliance.categoryCount}/6 categories{compliance.meetsMinimum ? " (meets 3+ minimum)" : " (needs 3+)"}</p></div>
              <div className="mt-3 flex flex-wrap gap-1.5">{Object.entries(CMS_CATEGORY_LABELS).map(([key, label]) => { const active = compliance.categories.has(key); return (<span key={key} className={`rounded-full px-2.5 py-1 text-[10px] ${active ? "bg-[color:var(--teal)] text-white" : "bg-[color:var(--line)] text-[color:var(--muted)]"}`}>{label.split("&")[0].trim()}</span>);})}</div>
            </div>
            <div className="surface-card rounded-[1.8rem] border p-5">
              <div className="flex items-center gap-2"><LinkIcon className="h-4 w-4 text-[color:var(--teal)]" /><p className="text-sm font-medium text-[color:var(--foreground)]">Synergy Score</p></div>
              <p className="mt-2 font-display text-4xl text-[color:var(--foreground)]">{synergyScore}<span className="text-lg text-[color:var(--muted)]">/100</span></p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[color:#efe8db]"><div className="h-full rounded-full bg-[linear-gradient(90deg,#0f7c86,#6dc3c2)] transition-all duration-500" style={{width:`${synergyScore}%`}} /></div>
            </div>
            <div className="surface-card rounded-[1.8rem] border p-5">
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-[color:var(--foreground)]" /><p className="text-sm font-medium text-[color:var(--foreground)]">Time-to-Signal</p></div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-[color:var(--line)] bg-white/70 p-3 text-center"><p className="font-display text-2xl" style={{color:"var(--teal)"}}>{timeDistribution.quickWin}</p><p className="text-[10px] font-medium text-[color:var(--foreground)]">Quick-win</p></div>
                <div className="rounded-xl border border-[color:var(--line)] bg-white/70 p-3 text-center"><p className="font-display text-2xl" style={{color:"var(--foreground)"}}>{timeDistribution.mediumTerm}</p><p className="text-[10px] font-medium text-[color:var(--foreground)]">Medium</p></div>
                <div className="rounded-xl border border-[color:var(--line)] bg-white/70 p-3 text-center"><p className="font-display text-2xl" style={{color:"var(--accent)"}}>{timeDistribution.longHorizon}</p><p className="text-[10px] font-medium text-[color:var(--foreground)]">Long</p></div>
              </div>
              {timeDistribution.quickWin === 0 && selected.length > 0 && <p className="mt-2 rounded-lg bg-[color:rgba(196,97,42,0.1)] px-3 py-2 text-xs text-[color:var(--accent)]">Warning: No quick-win interventions selected.</p>}
            </div>
            {unmetPrereqs.size > 0 && <div className="rounded-[1.8rem] border border-[color:rgba(196,97,42,0.2)] bg-[color:rgba(196,97,42,0.04)] p-5"><div className="flex items-center gap-2"><Shield className="h-4 w-4 text-[color:var(--accent)]" /><p className="text-sm font-medium text-[color:var(--foreground)]">Unmet Prerequisites</p></div><div className="mt-3 space-y-2">{Array.from(unmetPrereqs.entries()).map(([type, missing]) => { const i = INTERVENTION_CATALOG.find((x) => x.type === type); return (<div key={type} className="rounded-lg border border-[color:rgba(196,97,42,0.15)] bg-white/80 px-3 py-2 text-xs"><span className="font-medium">{i?.label}</span> needs: {missing.map((m) => INTERVENTION_CATALOG.find((x) => x.type === m)?.label ?? m).join(", ")}</div>);})}</div></div>}
            <div className="rounded-[1.8rem] border border-[color:rgba(16,34,53,0.1)] bg-[linear-gradient(180deg,#102235,#17314a)] p-5 text-white">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-white/55">Estimated portfolio cost</p>
              <p className="mt-2 font-display text-3xl">${(totalCostLow/1000).toFixed(0)}K - ${(totalCostHigh/1000).toFixed(0)}K</p>
              <p className="mt-1 text-xs text-white/55">{selected.length} interventions for {region.name}</p>
              <div className="mt-4"><Link href="/calculator" className="block rounded-full bg-white/10 px-3 py-2.5 text-center text-sm text-white/90 transition-colors hover:bg-white/20">Run detailed calculator</Link></div>
            </div>
          </section>
        </div>
      </Reveal>
    </>
  );
}

export default function PortfolioBuilderPage() { return (<Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-[color:var(--muted)]">Loading...</div>}><PortfolioBuilderInner /></Suspense>); }
ENDOFFILE

# ============================================================
# FILE 7: src/app/page.tsx (REPLACES HOMEPAGE)
# ============================================================
echo "📝 Writing src/app/page.tsx (new homepage)..."
cat > src/app/page.tsx << 'ENDOFFILE'
import Link from "next/link";
import { DetailCard } from "@/components/detail-disclosure";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ALASKA_CONFIG, getGreenRegions, getRedRegions } from "@/data/alaska-assessment";
import { INTERVENTION_CATALOG } from "@/data/intervention-catalog";

export default function Home() {
  const greenCount = getGreenRegions().length;
  const redCount = getRedRegions().length;
  const totalPop = ALASKA_CONFIG.regions.reduce((s, r) => s + r.population, 0);
  const avgSeverity = ALASKA_CONFIG.regions.reduce((s, r) => s + r.scores.deficitSeverityScore, 0) / ALASKA_CONFIG.regions.length;

  return (
    <>
      <PageHero eyebrow="RHT-NAV &middot; Alaska Pilot" title="A state decision framework for sequencing technology-enabled rural health investments." lede="RHT-NAV translates severity data into sequenced, CMS-compliant technology portfolios. Assess need, confirm readiness, select coordinated interventions, and demonstrate measurable outcomes within 12 months.">
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/assess" className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm text-white transition-colors hover:bg-[color:#223a54]">View regional assessment</Link>
          <Link href="/portfolio-builder" className="rounded-full border border-[color:var(--line)] bg-white px-5 py-3 text-sm text-[color:var(--foreground)] hover:bg-[color:#f9f5ee]">Build a portfolio</Link>
          <Link href="/map" className="rounded-full border border-[color:var(--line)] bg-white px-5 py-3 text-sm text-[color:var(--foreground)] hover:bg-[color:#f9f5ee]">Explore map layers</Link>
        </div>
      </PageHero>

      <Reveal>
        <section className="grid gap-4 md:grid-cols-4">
          <DetailCard eyebrow="Step 1" title="Assess need" hoverNote="Burden Severity and Access Gap indicators quantify where deficits are most acute." detail={<p>Domain 1 captures health outcomes, disease prevalence, travel distances, and shortage area designations.</p>} tone="paper"><p className="max-w-xs text-sm leading-7 text-[color:var(--muted)]">Quantify burden and access gaps across every major health domain.</p></DetailCard>
          <DetailCard eyebrow="Step 2" title="Measure capacity" hoverNote="Workforce counts, facility financial health, and referral patterns." detail={<p>Domain 2 converts the need picture into a system impact assessment.</p>} tone="teal"><p className="max-w-xs text-sm leading-7 text-[color:var(--muted)]">Evaluate workforce, facilities, and referral infrastructure.</p></DetailCard>
          <DetailCard eyebrow="Step 3" title="Confirm readiness" hoverNote="Digital, operational, policy, and measurement readiness." detail={<p>Domain 3 governs deployment sequencing.</p>} tone="warm"><p className="max-w-xs text-sm leading-7 text-[color:var(--muted)]">Check digital, operational, policy, and measurement infrastructure.</p></DetailCard>
          <DetailCard eyebrow="Step 4" title="Select portfolio" hoverNote="Coordinated intervention bundles outperform isolated point solutions." detail={<p>The compliance gate confirms CMS alignment. The synergy analysis flags disconnected tools.</p>} tone="navy"><p className="max-w-xs text-sm leading-7 text-[color:var(--muted)]">Build CMS-compliant bundles with synergy scoring.</p></DetailCard>
        </section>
      </Reveal>

      <Reveal delay={0.06}>
        <section className="surface-card rounded-[2rem] p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[color:var(--muted)]">Alaska pilot state</p>
              <h2 className="mt-3 font-display text-4xl text-[color:var(--foreground)]">Seven regions, two tiers, one coordinated portfolio.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[color:var(--muted)]">Alaska was selected as the pilot because it represents one of the most structurally challenging rural healthcare environments in the United States.</p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MiniStat label="Population" value={totalPop.toLocaleString()} />
                <MiniStat label="RHTP/year" value={`$${Math.round(ALASKA_CONFIG.rhtpAwardPerYear / 1e6)}M`} />
                <MiniStat label="Avg severity" value={avgSeverity.toFixed(1)} />
                <MiniStat label="Regions" value={String(ALASKA_CONFIG.regions.length)} />
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <TierCard tier="green" label="Fast-Start" count={greenCount} />
                <TierCard tier="red" label="Build-First" count={redCount} />
              </div>
              <div className="rounded-[1.4rem] border border-[color:var(--line)] bg-white/75 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Severity vs. readiness</p>
                <div className="relative mt-3 h-44 rounded-xl border border-[color:var(--line)] bg-[linear-gradient(90deg,rgba(196,97,42,0.08),rgba(255,255,255,0.82)_48%,rgba(15,124,134,0.1))]">
                  {ALASKA_CONFIG.regions.map((r) => (<div key={r.slug} className="absolute flex -translate-x-1/2 translate-y-1/2 flex-col items-center gap-0.5" style={{left:`${r.scores.executionReadinessScore}%`,bottom:`${r.scores.deficitSeverityScore}%`}}><div className={`h-3.5 w-3.5 rounded-full border-2 border-white shadow-md ${r.tier === "green" ? "bg-[color:var(--teal)]" : r.pathway === "coordination-hub" ? "bg-[color:#182f4a]" : "bg-[color:var(--accent)]"}`} /><span className="rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-medium text-[color:var(--foreground)] shadow-sm">{r.name}</span></div>))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.14}>
        <section className="grid gap-4 md:grid-cols-3">
          <ContextCard label="Program" value="$50B over 5 years" note="RHTP authorized under the One Big Beautiful Bill Act. Alaska: $272M/year." />
          <ContextCard label="Accountability" value="12-month window" note="First CMS performance assessments in October 2026." />
          <ContextCard label="Constraint" value="$1.1T Medicaid cuts" note="The investment is temporary. The Medicaid reductions are permanent." />
        </section>
      </Reveal>
    </>
  );
}

function MiniStat({label,value}:{label:string;value:string}) { return (<div className="rounded-xl border border-[color:var(--line)] bg-white/75 px-3 py-2.5"><p className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</p><p className="mt-1 font-display text-xl leading-none text-[color:var(--foreground)]">{value}</p></div>); }
function TierCard({tier,label,count}:{tier:"green"|"red";label:string;count:number}) { return (<div className={`rounded-[1.3rem] border p-4 ${tier === "green" ? "border-[color:rgba(15,124,134,0.2)] bg-[linear-gradient(180deg,rgba(15,124,134,0.08),rgba(255,255,255,0.92))]" : "border-[color:rgba(196,97,42,0.2)] bg-[linear-gradient(180deg,rgba(196,97,42,0.08),rgba(255,255,255,0.92))]"}`}><div className="flex items-center gap-2"><div className={`h-3 w-3 rounded-full ${tier === "green" ? "bg-[color:var(--teal)]" : "bg-[color:var(--accent)]"}`} /><span className="text-xs font-medium uppercase tracking-wider text-[color:var(--foreground)]">{label}</span></div><p className="mt-2 font-display text-3xl text-[color:var(--foreground)]">{count}</p></div>); }
function ContextCard({label,value,note}:{label:string;value:string;note:string}) { return (<article className="surface-card rounded-[1.7rem] border p-5"><p className="text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">{label}</p><p className="mt-3 font-display text-[2.2rem] leading-none text-[color:var(--foreground)]">{value}</p><p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{note}</p></article>); }
ENDOFFILE

# ============================================================
# FILE 8: src/components/site-header.tsx (REPLACES)
# ============================================================
echo "📝 Writing src/components/site-header.tsx..."
cat > src/components/site-header.tsx << 'ENDOFFILE'
"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigationItems = [ { href: "/", label: "Overview" }, { href: "/assess", label: "Assessment" }, { href: "/map", label: "Map" }, { href: "/portfolio-builder", label: "Portfolio Builder" }, { href: "/calculator", label: "Calculator" }, { href: "/framework", label: "Framework" }, { href: "/methods", label: "Methods" } ];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[color:rgba(247,243,235,0.78)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[98rem] items-center justify-between gap-4 px-4 py-4 md:px-8 lg:px-12">
        <Link href="/" className="min-w-0" onClick={() => setMenuOpen(false)}>
          <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:#102235]"><span className="text-sm font-bold text-white">RN</span></div><div><p className="text-[0.68rem] uppercase tracking-[0.34em] text-[color:var(--muted)]">Rural Health Transformation</p><p className="font-display text-lg font-semibold leading-none text-[color:var(--foreground)] md:text-xl">RHT-NAV</p></div></div>
        </Link>
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex lg:flex-nowrap">
          {navigationItems.map((item) => { const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href); return (<Link key={item.href} href={item.href} className={cn("rounded-full px-3 py-2 text-sm whitespace-nowrap transition-colors", active ? "bg-[color:var(--foreground)] text-white shadow-[0_10px_24px_rgba(16,34,53,0.11)]" : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]")}>{item.label}</Link>); })}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/assumptions" className="hidden rounded-full border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--surface-strong)] lg:inline-flex">Admin</Link>
          <div className="hidden rounded-full bg-[color:rgba(15,124,134,0.12)] px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[color:var(--teal)] lg:block">Alaska Pilot</div>
          <button type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen((c) => !c)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface-soft)] text-[color:var(--foreground)] lg:hidden">{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>
      <AnimatePresence initial={false}>{menuOpen && (<motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.18}} className="border-t border-[color:var(--line)] bg-[color:rgba(247,243,235,0.94)] px-4 pb-5 pt-4 backdrop-blur-2xl lg:hidden"><nav className="grid gap-2">{navigationItems.map((item) => { const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href); return (<Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={cn("rounded-2xl border px-4 py-3 text-sm transition-colors", active ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-white" : "border-[color:var(--line)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]")}>{item.label}</Link>); })}</nav></motion.div>)}</AnimatePresence>
    </header>
  );
}
ENDOFFILE

# ============================================================
# FILE 9: src/components/site-footer.tsx (REPLACES)
# ============================================================
echo "📝 Writing src/components/site-footer.tsx..."
cat > src/components/site-footer.tsx << 'ENDOFFILE'
import Link from "next/link";
export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--line)] bg-[color:#102235] text-white">
      <div className="mx-auto grid max-w-[100rem] gap-8 px-4 py-10 md:grid-cols-[1.3fr_1fr_1fr] md:px-8 lg:px-12">
        <div className="space-y-3">
          <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10"><span className="text-xs font-bold text-white">RN</span></div><div><p className="text-[0.68rem] uppercase tracking-[0.34em] text-white/45">Rural Health Transformation</p><p className="font-display text-lg font-semibold text-white">RHT-NAV</p></div></div>
          <p className="max-w-xl text-sm leading-7 text-white/60">A state decision framework for sequencing technology-enabled rural health investments under the Rural Health Transformation Program. Developed at Stanford University in collaboration with the RHT Collaborative.</p>
          <p className="text-xs text-white/35">Prepared for academic purposes. Not an official policy document of CMS, Microsoft, or the RHT Collaborative.</p>
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">Navigate</p>
          <div className="flex flex-wrap gap-2 text-sm text-white/70">
            <Link href="/assess" className="rounded-full border border-white/12 px-3 py-1 hover:bg-white/8">Assessment</Link>
            <Link href="/map" className="rounded-full border border-white/12 px-3 py-1 hover:bg-white/8">Map</Link>
            <Link href="/portfolio-builder" className="rounded-full border border-white/12 px-3 py-1 hover:bg-white/8">Portfolio Builder</Link>
            <Link href="/calculator" className="rounded-full border border-white/12 px-3 py-1 hover:bg-white/8">Calculator</Link>
            <Link href="/assumptions" className="rounded-full border border-white/12 px-3 py-1 hover:bg-white/8">Admin</Link>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">Framework</p>
          <ul className="space-y-2 text-sm text-white/60">
            <li>Need / Capacity / Readiness scoring</li>
            <li>Green (fast-start) / Red (build-first) tiering</li>
            <li>CMS compliance gate with 3+ category minimum</li>
            <li>Synergy analysis across intervention bundles</li>
            <li>12-month time-to-signal feasibility filter</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
ENDOFFILE

echo ""
echo "✅ All 10 files written successfully."
echo ""
echo "🔨 Running build to verify..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Build succeeded! Ready to push."
  echo ""
  echo "Run these commands to deploy:"
  echo "  git add -A"
  echo "  git commit -m 'Add RHT-NAV framework: assessment, portfolio builder, ArcGIS map, multi-intervention scoring'"
  echo "  git push origin main"
else
  echo ""
  echo "⚠️  Build had errors. Send the error output to Claude for fixes."
fi
