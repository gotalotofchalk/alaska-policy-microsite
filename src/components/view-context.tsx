"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  View types                                                         */
/* ------------------------------------------------------------------ */

export type ViewRole = "administrator" | "clinical" | "partner" | "executive";

export interface ViewRoleConfig {
  key: ViewRole;
  label: string;
  shortLabel: string;
  description: string;
}

export const VIEW_ROLES: ViewRoleConfig[] = [
  {
    key: "administrator",
    label: "State Administrator",
    shortLabel: "Admin",
    description: "Budget, compliance, and infrastructure planning",
  },
  {
    key: "clinical",
    label: "Clinical",
    shortLabel: "Clinical",
    description: "Patient outcomes, screening, and care delivery",
  },
  {
    key: "partner",
    label: "Partner / Vendor",
    shortLabel: "Partner",
    description: "Integration points, deployment, and market opportunity",
  },
  {
    key: "executive",
    label: "Executive",
    shortLabel: "Executive",
    description: "High-level dashboards and cross-state KPIs",
  },
];

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface ViewContextValue {
  role: ViewRole;
  setRole: (role: ViewRole) => void;
  roleConfig: ViewRoleConfig;
}

const ViewContext = createContext<ViewContextValue>({
  role: "administrator",
  setRole: () => {},
  roleConfig: VIEW_ROLES[0],
});

const STORAGE_KEY = "rht-nav-view-role";

export function ViewProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<ViewRole>("administrator");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ViewRole | null;
    if (stored && VIEW_ROLES.some((r) => r.key === stored)) {
      setRoleState(stored);
    }
    setHydrated(true);
  }, []);

  const setRole = (newRole: ViewRole) => {
    setRoleState(newRole);
    localStorage.setItem(STORAGE_KEY, newRole);
  };

  const roleConfig = VIEW_ROLES.find((r) => r.key === role) ?? VIEW_ROLES[0];

  if (!hydrated) {
    return <>{children}</>;
  }

  return (
    <ViewContext.Provider value={{ role, setRole, roleConfig }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  return useContext(ViewContext);
}
