/**
 * State Pyramid Configuration Types
 *
 * Typed config interfaces that drive the three-tab pyramid framework
 * for any state page. The pyramid mirrors the RHT Collaborative's
 * three-layer presentation model:
 *   Layer 1 (base): Infrastructure
 *   Layer 2 (middle): Partner Ecosystem
 *   Layer 3 (top): Solutions (mapped to 5 CMS RHT Goals)
 */

/* ------------------------------------------------------------------ */
/*  Category unions                                                    */
/* ------------------------------------------------------------------ */

export type InfraCategory =
  | "broadband_satellite"
  | "ehr"
  | "interoperability"
  | "cloud_ai"
  | "cybersecurity";

export type EcosystemCategory =
  | "technology"
  | "advisors"
  | "providers"
  | "other";

export type SolutionGoal =
  | "healthy_again"
  | "sustainable_access"
  | "workforce"
  | "innovative_care"
  | "tech_innovation";

/* ------------------------------------------------------------------ */
/*  Section interfaces                                                 */
/* ------------------------------------------------------------------ */

export interface InfraSection {
  category: InfraCategory;
  label: string;
  statusSummary: string;
  hasInteractiveTool?: boolean;
  toolRoute?: string;
  toolLabel?: string;
  content: "broadband" | "ehr" | "interop" | "cloud" | "cyber" | "placeholder";
}

export interface EcosystemSection {
  category: EcosystemCategory;
  label: string;
  partners: Array<{
    name: string;
    role: string;
    contact?: string;
  }>;
}

export interface SolutionSection {
  goal: SolutionGoal;
  goalNumber: number;
  label: string;
  statusSummary: string;
  interventions?: Array<{
    name: string;
    status: "available" | "planned" | "future";
    partner?: string;
  }>;
}

/* ------------------------------------------------------------------ */
/*  State config                                                       */
/* ------------------------------------------------------------------ */

export interface StatePyramidConfig {
  stateCode: string;
  stateName: string;
  rhtpAwardPerYear?: number;
  infrastructure: InfraSection[];
  ecosystem: EcosystemSection[];
  solutions: SolutionSection[];
}
