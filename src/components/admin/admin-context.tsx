"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { ADMIN_PASSKEY, ADMIN_SESSION_KEY } from "@/config/admin";

interface AdminContextValue {
  isAdmin: boolean;
  login: (passkey: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue>({
  isAdmin: false,
  login: () => false,
  logout: () => {},
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (stored === "true") setIsAdmin(true);
  }, []);

  const login = (passkey: string): boolean => {
    if (passkey === ADMIN_PASSKEY) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
