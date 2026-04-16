/**
 * Kentucky Pyramid Configuration
 *
 * Drives the three-tab pyramid framework for Kentucky's state page.
 * Imports real data where available; uses "Assessment pending" placeholders
 * for sections still in development.
 */

import { getKYBDCSummary } from "@/data/kentucky-broadband-availability";
import { getKYFacilitySummary } from "@/data/kentucky-facilities";
import { KY_RHTP } from "@/data/kentucky-config";
import type { StatePyramidConfig } from "@/types/state-pyramid";

/* ------------------------------------------------------------------ */
/*  Compute real values from existing data                             */
/* ------------------------------------------------------------------ */

const bdcSummary = getKYBDCSummary();
const facilitySummary = getKYFacilitySummary();

const pctUnserved = Math.round((bdcSummary.unserved / bdcSummary.totalBSLs) * 1000) / 10;

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

export const KENTUCKY_PYRAMID: StatePyramidConfig = {
  stateCode: "KY",
  stateName: "Kentucky",
  rhtpAwardPerYear: KY_RHTP.annualAllocation,

  /* ── Infrastructure (Layer 1) ──────────────────────────────────── */
  infrastructure: [
    {
      category: "broadband_satellite",
      label: "Broadband & Satellite",
      statusSummary: `${pctUnserved}% unserved · ${facilitySummary.total} facilities tracked · Satellite planner available`,
      hasInteractiveTool: true,
      toolRoute: "/kentucky/satellite-planner",
      toolLabel: "Open Satellite Planner",
      content: "broadband",
    },
    {
      category: "ehr",
      label: "Electronic Health Records",
      statusSummary: "Assessment pending",
      content: "ehr",
    },
    {
      category: "interoperability",
      label: "Interoperability",
      statusSummary: "Assessment pending",
      content: "interop",
    },
    {
      category: "cloud_ai",
      label: "Cloud & AI",
      statusSummary: "Assessment pending",
      content: "cloud",
    },
    {
      category: "cybersecurity",
      label: "Cybersecurity",
      statusSummary: `0 of ${facilitySummary.total} facilities assessed`,
      content: "cyber",
    },
  ],

  /* ── Ecosystem (Layer 2) ───────────────────────────────────────── */
  ecosystem: [
    {
      category: "technology",
      label: "Technology Partners",
      partners: [
        { name: "Microsoft", role: "Cloud, AI, and cybersecurity platform" },
        { name: "BioIntelliSense", role: "Remote patient monitoring" },
        { name: "Avel eCare", role: "Telehealth services" },
        { name: "Teladoc", role: "Virtual care platform" },
        { name: "Topcon", role: "Retinal screening robotics" },
        { name: "Samsung", role: "Consumer health devices" },
        { name: "Viz.ai", role: "AI stroke detection" },
        { name: "eClinicalWorks", role: "Electronic health records" },
      ],
    },
    {
      category: "advisors",
      label: "Advisors & System Integrators",
      partners: [
        { name: "Accenture", role: "System integration" },
        { name: "AVIA Health", role: "Innovation network" },
        { name: "KPMG", role: "Advisory services" },
        { name: "PwC", role: "Advisory services" },
        { name: "Manatt Health", role: "Policy and regulatory advisory" },
      ],
    },
    {
      category: "providers",
      label: "Healthcare Providers",
      partners: [
        { name: "CVS Health", role: "Retail health services" },
        { name: "Walgreens", role: "Pharmacy services" },
        { name: "Walmart", role: "Retail health services" },
        { name: "Kroger Health", role: "Pharmacy and wellness" },
        { name: "Cibolo Health", role: "Rural health networks" },
        { name: "NACHC", role: "Community health center advocacy" },
      ],
    },
    {
      category: "other",
      label: "Other Partners",
      partners: [
        { name: "American Heart Association", role: "Cardiovascular health programs" },
        { name: "Labcorp", role: "Diagnostic laboratory services" },
        { name: "AUVSI", role: "Drone and autonomous delivery" },
      ],
    },
  ],

  /* ── Solutions (Layer 3) ───────────────────────────────────────── */
  solutions: [
    {
      goal: "healthy_again",
      goalNumber: 1,
      label: "Make Rural America Healthy Again",
      statusSummary: "Infrastructure assessment in progress",
      interventions: [
        { name: "Broadband gap analysis", status: "available", partner: "FCC/Microsoft" },
        { name: "Facility connectivity assessment", status: "available" },
        { name: "Chronic care hub planning", status: "planned" },
      ],
    },
    {
      goal: "sustainable_access",
      goalNumber: 2,
      label: "Sustainable Access",
      statusSummary: "Broadband analysis active · Satellite planner available",
      interventions: [
        { name: "Satellite coverage planner", status: "available", partner: "SpaceX/Starlink" },
        { name: "Telehealth-enabled maternal care", status: "planned" },
        { name: "Rural dental access expansion", status: "planned" },
      ],
    },
    {
      goal: "workforce",
      goalNumber: 3,
      label: "Workforce Development",
      statusSummary: "Planned",
      interventions: [
        { name: "Telehealth training programs", status: "planned" },
        { name: "Remote monitoring workforce", status: "future" },
      ],
    },
    {
      goal: "innovative_care",
      goalNumber: 4,
      label: "Innovative Care",
      statusSummary: "Planned",
      interventions: [
        { name: "Remote patient monitoring", status: "planned", partner: "BioIntelliSense" },
        { name: "AI diagnostic screening", status: "future", partner: "Viz.ai/Topcon" },
        { name: "EmPATH behavioral health", status: "planned" },
      ],
    },
    {
      goal: "tech_innovation",
      goalNumber: 5,
      label: "Tech Innovation",
      statusSummary: "Satellite planner deployed · Cybersecurity assessment planned",
      interventions: [
        { name: "Satellite planning tool", status: "available" },
        { name: "Cybersecurity assessment program", status: "planned", partner: "Microsoft" },
        { name: "AI vulnerability detection", status: "future", partner: "Anthropic" },
      ],
    },
  ],
};
