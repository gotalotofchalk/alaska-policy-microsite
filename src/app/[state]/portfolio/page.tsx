import { notFound } from "next/navigation";
import { isValidState } from "@/config/states";

export default async function PortfolioPage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  if (!isValidState(state)) notFound();

  return (
    <div className="p-6 lg:p-10">
      <p className="text-xs uppercase tracking-wider text-[color:var(--muted)]">Intervention Portfolio</p>
      <h1 className="mt-2 font-display text-3xl text-[color:var(--foreground)] md:text-4xl">
        Intervention Portfolio
      </h1>
      <p className="mt-2 text-sm text-[color:var(--muted)]">
        Module content — migration in progress.
      </p>
    </div>
  );
}
