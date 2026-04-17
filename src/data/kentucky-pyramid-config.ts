/**
 * Kentucky Pyramid Configuration
 *
 * Drives the three-tab pyramid framework for Kentucky's state page.
 * Infrastructure = what physical/digital systems exist or need building.
 * Ecosystem = partners, vendors, advisors enabling the transformation.
 * Solutions = clinical technologies & programs that save lives once
 *             infrastructure is in place.
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
      statusSummary: `${pctUnserved}% unserved · ${facilitySummary.total} facilities tracked · Broadband Map available`,
      hasInteractiveTool: true,
      toolRoute: "/kentucky/satellite-planner",
      toolLabel: "Open Broadband Map",
      content: "broadband",
    },
    {
      category: "cybersecurity",
      label: "Cybersecurity",
      statusSummary: `0 of ${facilitySummary.total} facilities assessed`,
      hasInteractiveTool: true,
      toolRoute: "/kentucky/cybersecurity",
      toolLabel: "View Cybersecurity Program",
      content: "cyber",
    },
    {
      category: "ehr",
      label: "Electronic Health Records",
      statusSummary: "Pending",
      content: "ehr",
    },
    {
      category: "interoperability",
      label: "Interoperability",
      statusSummary: "Pending",
      content: "interop",
    },
    {
      category: "cloud_ai",
      label: "Cloud & AI",
      statusSummary: "Pending",
      content: "cloud",
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

  /* ── Solutions (Layer 3) — clinical technologies & programs ────── */
  solutions: [
    {
      goal: "healthy_again",
      goalNumber: 1,
      label: "Diabetic Retinopathy Screening",
      statusSummary: "AI-powered retinal screening at the point of care",
      interventions: [
        { name: "Topcon retinal camera deployment", status: "planned", partner: "Topcon" },
        { name: "AI screening with Viz.ai integration", status: "future", partner: "Viz.ai" },
        { name: "Referral pathway to ophthalmology", status: "future" },
      ],
    },
    {
      goal: "sustainable_access",
      goalNumber: 2,
      label: "Telehealth Platforms",
      statusSummary: "Virtual care reducing travel burden for rural patients",
      interventions: [
        { name: "Avel eCare specialty telehealth", status: "planned", partner: "Avel eCare" },
        { name: "Teladoc virtual primary care", status: "planned", partner: "Teladoc" },
        { name: "Maternal care in maternity deserts", status: "planned" },
      ],
    },
    {
      goal: "innovative_care",
      goalNumber: 3,
      label: "Remote Patient Monitoring",
      statusSummary: "Continuous vitals monitoring for chronic care management",
      interventions: [
        { name: "BioButton wearable deployment", status: "planned", partner: "BioIntelliSense" },
        { name: "Chronic disease early warning", status: "future" },
        { name: "Post-discharge monitoring programs", status: "future" },
      ],
    },
    {
      goal: "workforce",
      goalNumber: 4,
      label: "Clinical AI Documentation",
      statusSummary: "AI-assisted documentation saving physician time",
      interventions: [
        { name: "Ambient clinical documentation", status: "future" },
        { name: "AI-powered clinical decision support", status: "future" },
        { name: "Automated coding and billing", status: "future" },
      ],
    },
    {
      goal: "tech_innovation",
      goalNumber: 5,
      label: "Integrated Care Pathways",
      statusSummary: "Connecting solutions into measurable health outcomes",
      interventions: [
        { name: "EmPATH behavioral health crisis model", status: "planned" },
        { name: "Rural pharmacy hub networks", status: "future", partner: "CVS/Kroger" },
        { name: "Outcomes simulation and ROI modeling", status: "future" },
      ],
    },
  ],
};
