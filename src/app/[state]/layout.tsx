import { notFound } from "next/navigation";

import { StateSidebar } from "@/components/state-sidebar";
import { isValidState, type ValidState } from "@/config/states";

export default async function StateLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  if (!isValidState(state)) notFound();

  return (
    <div className="flex min-h-screen">
      <StateSidebar state={state as ValidState} />
      <div className="flex-1 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
