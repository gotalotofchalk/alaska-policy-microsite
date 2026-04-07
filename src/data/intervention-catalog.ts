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
