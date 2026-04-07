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
