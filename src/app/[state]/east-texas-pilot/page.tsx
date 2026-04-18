import { notFound } from "next/navigation";

export default async function EastTexasPilotPage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  if (state !== "texas") notFound();

  return (
    <div className="p-6 lg:p-10">
      <p className="text-xs uppercase tracking-wider text-[color:var(--muted)]">Texas-Specific</p>
      <h1 className="mt-2 font-display text-3xl text-[color:var(--foreground)] md:text-4xl">
        East Texas Pilot Zone
      </h1>
      <p className="mt-2 text-sm text-[color:var(--muted)]">
        East Texas pilot module — content in development.
      </p>
    </div>
  );
}
