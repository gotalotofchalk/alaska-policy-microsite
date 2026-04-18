"use client";

import Link from "next/link";
import { useAdmin } from "@/components/admin/admin-context";
import { AdminLoginModal } from "@/components/admin/admin-login-modal";
import { useState } from "react";

export function SiteHeader() {
  const { isAdmin } = useAdmin();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[color:rgba(247,243,235,0.78)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[98rem] items-center justify-between gap-4 px-4 py-4 md:px-8 lg:px-12">
          <Link href="/" className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[color:#102235] to-[color:#1a3a52]">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,124,134,0.3)_0%,transparent_50%)]" />
                <span className="relative text-sm font-bold tracking-tight text-white">RN</span>
              </div>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.34em] text-[color:var(--muted)]">
                  Rural Health Transformation
                </p>
                <p className="font-display text-lg font-semibold leading-none text-[color:var(--foreground)] md:text-xl">
                  RHT-NAV
                </p>
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setLoginOpen(true)}
            className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--surface-strong)]"
          >
            {isAdmin ? "Admin" : "Log in"}
          </button>
        </div>
      </header>

      <AdminLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
