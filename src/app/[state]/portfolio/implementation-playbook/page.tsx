import { notFound } from "next/navigation";
import { isValidState } from "@/config/states";

export default async function PlaybookPage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  if (!isValidState(state)) notFound();

  return (
    <div className="p-6 lg:p-10">
      <p className="text-xs uppercase tracking-wider text-[color:var(--muted)]">Implementation Playbook</p>
      <h1 className="mt-2 font-display text-3xl text-[color:var(--foreground)] md:text-4xl">
        Implementation Playbook
      </h1>
      <div className="mt-6 rounded-2xl border border-dashed border-[color:var(--line)] bg-white/50 p-8 text-center">
        <p className="text-sm text-[color:var(--muted)]">
          Coming soon — staged rollout checklist tied to selected interventions. Logic to be defined in a future pass.
        </p>
      </div>
    </div>
  );
}
