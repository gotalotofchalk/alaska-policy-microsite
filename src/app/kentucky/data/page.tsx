"use client";

import { motion } from "framer-motion";
import {
  Database,
  ExternalLink,
  Globe,
  Landmark,
  MapPin,
  Radio,
  Satellite,
  ShieldCheck,
  Signal,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ExtLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[color:var(--teal)] underline decoration-[color:var(--teal)]/30 underline-offset-2 transition-colors hover:decoration-[color:var(--teal)]"
    >
      {children}
      <ExternalLink className="h-3 w-3 flex-shrink-0" />
    </a>
  );
}

function DatasetCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section variants={fadeUp} className="surface-card rounded-[1.6rem] border p-6 transition-shadow hover:shadow-lg md:p-8">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[color:var(--surface-soft)] text-[color:var(--muted)]">
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="font-display text-lg font-semibold leading-snug text-[color:var(--foreground)]">
            {title}
          </h2>
        </div>
      </div>
      <div className="mt-5 space-y-4 text-sm leading-7 text-[color:var(--muted)]">
        {children}
      </div>
    </motion.section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
      <span className="flex-shrink-0 text-[10px] uppercase tracking-[0.2em] text-[color:var(--foreground)]/50 sm:w-32 sm:pt-[5px]">
        {label}
      </span>
      <span className="text-[color:var(--foreground)]">{children}</span>
    </div>
  );
}

function Divider() {
  return <hr className="border-[color:var(--line)]" />;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function KentuckyDataPage() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6"
    >
      {/* Hero */}
      <motion.div variants={fadeUp}>
        <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[color:var(--muted)]">
          Kentucky Data Sources
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl leading-[1.15] text-[color:var(--foreground)] md:text-4xl">
          Where the numbers come from
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[color:var(--muted)]">
          Source, access URL, vintage, and limitations for every dataset. Verify any figure back to its origin.
        </p>
      </motion.div>

      {/* ── Dataset cards ──────────────────────────────────────── */}

      {/* 1. Healthcare Facility Locations */}
      <DatasetCard
        icon={<Landmark className="h-4.5 w-4.5" />}
        title="Healthcare Facility Locations"
      >
        <p>
          800+ facilities from three federal/state sources, cross-referenced against CMS Provider of Services.
        </p>

        <Divider />

        <p className="text-xs font-medium uppercase tracking-widest text-[color:var(--foreground)]">
          Hospitals &amp; Critical Access Hospitals (96 facilities)
        </p>
        <Field label="Source">
          Kentucky Cabinet for Health and Family Services (CHFS), Office of
          Inspector General
        </Field>
        <Field label="Downloads">
          <ExtLink href="https://www.chfs.ky.gov/agencies/os/oig/dhc/Documents/HospitalDirectory.xlsx">
            Hospital Directory (.xlsx)
          </ExtLink>
          {" and "}
          <ExtLink href="https://www.chfs.ky.gov/agencies/os/oig/dhc/Documents/CriticalAccessHospitalDirectory.xlsx">
            CAH Directory (.xlsx)
          </ExtLink>
          {" from the "}
          <ExtLink href="https://www.chfs.ky.gov/agencies/os/oig/dhc/Pages/hcf.aspx">
            CHFS facility index page
          </ExtLink>
        </Field>
        <Field label="Format">Excel (.xlsx), updated monthly</Field>
        <Field label="Fields used">Facility name, county, licensed beds</Field>
        <Field label="Coordinates">
          City-level centroids (not rooftop geocoding). Supplemented by{" "}
          <ExtLink href="https://hifld-geoplatform.hub.arcgis.com/datasets/geoplatform::hospitals/about">
            HIFLD Open Data
          </ExtLink>{" "}
          (NAME, LATITUDE, LONGITUDE, TYPE, BEDS, COUNTY, COUNTYFIPS). Last
          modified November 2025.
        </Field>
        <Field label="Restrictions">None. Public download.</Field>

        <Divider />

        <p className="text-xs font-medium uppercase tracking-widest text-[color:var(--foreground)]">
          Federally Qualified Health Centers (663 service delivery sites)
        </p>
        <Field label="Source">
          HRSA Data Warehouse, Health Center Service Delivery and Look-Alike
          Sites
        </Field>
        <Field label="Download">
          <ExtLink href="https://data.hrsa.gov/DataDownload/DD_Files/Health_Center_Service_Delivery_and_LookAlike_Sites.csv">
            Direct CSV download
          </ExtLink>
          {" from the "}
          <ExtLink href="https://data.hrsa.gov/data/download">
            HRSA Data Downloads hub
          </ExtLink>
          {" (filter by Health Centers)"}
        </Field>
        <Field label="Format">CSV, updated quarterly</Field>
        <Field label="Fields used">
          Site Name, Address, City, State, County, Latitude, Longitude
          (filtered to State = KY)
        </Field>
        <Field label="Coordinates">Rooftop-level from HRSA</Field>
        <Field label="Restrictions">None. Direct HTTP download.</Field>

        <Divider />

        <p className="text-xs font-medium uppercase tracking-widest text-[color:var(--foreground)]">
          CMS Provider of Services (cross-reference)
        </p>
        <Field label="Source">
          CMS Provider of Services File (Hospital &amp; Non-Hospital Facilities)
        </Field>
        <Field label="Access">
          <ExtLink href="https://data.cms.gov/data-api/v1/dataset/8ba0f9b4-9493-4aa0-9f82-44ea9468d1b5/data">
            JSON API
          </ExtLink>
          {" or "}
          <ExtLink href="https://catalog.data.gov/dataset/provider-of-services-file-hospital-non-hospital-facilities-f216f">
            Data.gov catalog page
          </ExtLink>
          {" (~156 MB CSV)"}
        </Field>
        <Field label="Purpose">
          Authoritative federal certification roster for hospitals, CAHs, FQHCs,
          and RHCs. Does not include geocoordinates.
        </Field>
        <Field label="Restrictions">None.</Field>
      </DatasetCard>

      {/* 2. Broadband Adoption */}
      <DatasetCard
        icon={<Signal className="h-4.5 w-4.5" />}
        title="Broadband Adoption Data"
      >
        <p>
          County-level subscription rates for 120 counties. Measures adoption, not availability.
        </p>

        <Divider />

        <Field label="Source">
          U.S. Census Bureau, American Community Survey 2023 5-Year Estimates
        </Field>
        <Field label="Table">
          B28002 (Presence and Types of Internet Subscriptions in Household)
        </Field>
        <Field label="Fields">
          B28002_001E (total households) and B28002_007E (households with
          broadband, excluding cellular-only)
        </Field>
        <Field label="API query">
          <ExtLink href="https://api.census.gov/data/2024/acs/acs5?get=NAME,B28002_001E,B28002_007E&for=county:*&in=state:21">
            Census API endpoint
          </ExtLink>
        </Field>
        <Field label="Web portal">
          <ExtLink href="https://data.census.gov/table/ACSDT5Y2024.B28002?g=040XX00US21$0500000">
            data.census.gov
          </ExtLink>
        </Field>
        <Field label="Key distinction">
          Measures <strong className="text-[color:var(--foreground)]">adoption</strong> (does the
          household subscribe?) not{" "}
          <strong className="text-[color:var(--foreground)]">availability</strong> (is service
          offered?)
        </Field>
        <Field label="Used for">
          County choropleth shading on the broadband gap map
        </Field>
        <Field label="API key">
          Not required for fewer than 500 queries per day
        </Field>
        <Field label="Codebase">
          <code className="rounded bg-[color:var(--surface-soft)] px-1.5 py-0.5 text-xs">
            src/data/kentucky-broadband-data.ts
          </code>
        </Field>
      </DatasetCard>

      {/* 3. Broadband Availability */}
      <DatasetCard
        icon={<Globe className="h-4.5 w-4.5" />}
        title="Broadband Availability Data"
      >
        <p>
          FCC BDC supply-side availability: whether 100/20+ Mbps service is offered at each BSL.
        </p>

        <Divider />

        <Field label="Source">
          FCC Broadband Data Collection, December 2024 vintage
        </Field>
        <Field label="Accessed via">
          ArcGIS Living Atlas (Esri), County sublayer (ID 1)
        </Field>
        <Field label="Service URL">
          <ExtLink href="https://services8.arcgis.com/peDZJliSvYims39Q/arcgis/rest/services/FCC_Broadband_Data_Collection_December_2024_View/FeatureServer">
            FCC BDC FeatureServer
          </ExtLink>
        </Field>
        <Field label="ArcGIS item">
          <ExtLink href="https://www.arcgis.com/home/item.html?id=e1343efcefc344709057260ee57290a0">
            Item page
          </ExtLink>
        </Field>
        <Field label="Fields">
          TotalBSLs, ServedBSLs, UnderservedBSLs, UnservedBSLs, pctServed,
          fiberServedBSLs, cableServedBSLs, UniqueProviders
        </Field>
        <Field label="Speed thresholds">
          Served ≥ 100/20 Mbps, Underserved ≥ 25/3 but &lt; 100/20, Unserved
          &lt; 25/3
        </Field>
        <Field label="Key distinction">
          Measures <strong className="text-[color:var(--foreground)]">availability</strong> (is
          service offered at this location?) not{" "}
          <strong className="text-[color:var(--foreground)]">adoption</strong>
        </Field>
        <Field label="Restrictions">None. Public ArcGIS feature service.</Field>
        <Field label="Codebase">
          <code className="rounded bg-[color:var(--surface-soft)] px-1.5 py-0.5 text-xs">
            src/data/kentucky-broadband-availability.ts
          </code>
        </Field>
      </DatasetCard>

      {/* 4. Sub-County BSL Grid */}
      <DatasetCard
        icon={<Database className="h-4.5 w-4.5" />}
        title="Sub-County BSL Grid"
      >
        <p>
          78,785 H3 hexagonal cells (~0.74 km² each) for sub-county coverage estimation.
        </p>

        <Divider />

        <Field label="Source">
          FCC Broadband Data Collection, December 2024 vintage
        </Field>
        <Field label="Accessed via">
          ArcGIS Living Atlas, H3 Resolution-8 sublayer (ID 5)
        </Field>
        <Field label="Service URL">
          <ExtLink href="https://services8.arcgis.com/peDZJliSvYims39Q/arcgis/rest/services/FCC_Broadband_Data_Collection_December_2024_View/FeatureServer/5">
            H3 Resolution-8 sublayer
          </ExtLink>
        </Field>
        <Field label="Spatial resolution">
          H3 Resolution-8 hexagons (~0.74 km² each, ~460 m edge to edge)
        </Field>
        <Field label="Coverage">
          78,785 hexagons across Kentucky where unserved or underserved BSLs
          exist
        </Field>
        <Field label="Statewide totals">
          172,240 unserved BSLs + 124,475 underserved BSLs = 296,715
          BEAD-eligible BSLs
        </Field>
        <Field label="Centroid derivation">
          Each hex centroid computed from H3 ID using the h3-js library
        </Field>
        <Field label="Used for">
          Real-time spatial coverage calculation when terminals are placed on
          the map
        </Field>
        <Field label="Restrictions">None. Public ArcGIS feature service.</Field>
        <Field label="Codebase">
          <code className="rounded bg-[color:var(--surface-soft)] px-1.5 py-0.5 text-xs">
            public/data/kentucky-bsl-grid.json
          </code>{" "}
          (5.88 MB, loaded on demand)
        </Field>
      </DatasetCard>

      {/* 5. County Boundary Polygons */}
      <DatasetCard
        icon={<MapPin className="h-4.5 w-4.5" />}
        title="County Boundary Polygons"
      >
        <p>
          120 Kentucky county boundaries for choropleth overlay rendering.
        </p>

        <Divider />

        <Field label="Source">
          U.S. Census Bureau, 2024 Cartographic Boundary Files
        </Field>
        <Field label="Resolution">1:500,000 (cb_2024_us_county_500k)</Field>
        <Field label="Download">
          <ExtLink href="https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_county_500k.zip">
            Shapefile (.zip)
          </ExtLink>
        </Field>
        <Field label="Processing">
          Filtered to STATEFP = &quot;21&quot; for Kentucky, converted to
          GeoJSON for Leaflet rendering
        </Field>
        <Field label="Restrictions">
          None. Public domain U.S. government work.
        </Field>
        <Field label="Codebase">
          <code className="rounded bg-[color:var(--surface-soft)] px-1.5 py-0.5 text-xs">
            src/data/kentucky-counties.json
          </code>
        </Field>
      </DatasetCard>

      {/* 6. Starlink Pricing and Coverage Model */}
      <DatasetCard
        icon={<Satellite className="h-4.5 w-4.5" />}
        title="Starlink Pricing and Coverage Model"
      >
        <p>
          SpaceX public pricing (Jan–Apr 2026) + PtMP fixed wireless distribution model on 5 GHz.
        </p>

        <Divider />

        <Field label="Pricing source">
          SpaceX Starlink website and public filings, compiled January through
          April 2026
        </Field>
        <Field label="Residential tiers">
          Three tiers from $50/mo to $120/mo
        </Field>
        <Field label="Business tiers">
          $250/mo to $1,500/mo depending on priority data tier
        </Field>
        <Field label="Hardware">
          $299 (Standard Lite) to $2,500 (High Performance Kit)
        </Field>
        <Field label="Coverage model">
          3-mile community distribution radius using PtMP fixed wireless, with
          Starlink as backhaul. The 3-mile figure is a conservative estimate for
          Appalachian terrain (50 to 70% of flat-terrain maximum range).
        </Field>
        <Field label="BEAD context">
          Kentucky&apos;s{" "}
          <ExtLink href="https://broadband.ky.gov/Pages/index.aspx">
            BEAD Draft Final Proposal
          </ExtLink>{" "}
          designates 25% of funded locations for LEO satellite (~21,600
          locations). Kentucky&apos;s total BEAD allocation is $1.1 billion from
          NTIA.
        </Field>
        <Field label="Codebase">
          <code className="rounded bg-[color:var(--surface-soft)] px-1.5 py-0.5 text-xs">
            src/data/kentucky-config.ts
          </code>
        </Field>
      </DatasetCard>

      {/* 7. Kentucky RHTP Allocation */}
      <DatasetCard
        icon={<ShieldCheck className="h-4.5 w-4.5" />}
        title="Kentucky RHTP Allocation"
      >
        <p>
          RHTP allocation anchoring the cost-as-percentage framing in the satellite planner.
        </p>

        <Divider />

        <Field label="Source">
          CMS Office of Rural Health Transformation, December 2025 announcement
        </Field>
        <Field label="Kentucky FY2026">
          $212.9 million (11th highest nationally)
        </Field>
        <Field label="Program">
          RHTP, $50 billion FY2026 through 2030, established by Section 71401 of
          Public Law 119-21
        </Field>
        <Field label="Formula">
          50% equal share ($100M floor per state) + 50% weighted by rural
          population, uncompensated care, facility count, plan quality, and
          policy alignment
        </Field>
        <Field label="State plan">
          <ExtLink href="https://ruralhealthplan.ky.gov">
            ruralhealthplan.ky.gov
          </ExtLink>
        </Field>
        <Field label="CMS overview">
          <ExtLink href="https://cms.gov/priorities/rural-health-transformation-rht-program/overview">
            CMS RHTP overview
          </ExtLink>
        </Field>
        <Field label="Used for">
          Cost-as-percentage-of-allocation calculation in the satellite planner
        </Field>
        <Field label="Codebase">
          <code className="rounded bg-[color:var(--surface-soft)] px-1.5 py-0.5 text-xs">
            src/data/kentucky-config.ts
          </code>{" "}
          (KY_RHTP object)
        </Field>
      </DatasetCard>

      {/* ── Methodology note ─────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        className="rounded-[1.6rem] border border-[color:var(--line)] bg-[color:rgba(15,124,134,0.04)] p-6 md:p-8"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[color:rgba(15,124,134,0.08)] text-[color:var(--teal)]">
            <Radio className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="font-display text-sm font-semibold text-[color:var(--foreground)]">
              Note on facility broadband status
            </p>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
              Facility broadband status is currently estimated from county-level
              Census ACS adoption rates. Counties with less than 60% broadband
              adoption result in facilities being marked as unserved.
              Facility-level BDC verification is planned but not yet
              implemented.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
