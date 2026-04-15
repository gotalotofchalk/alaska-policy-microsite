"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Menu, X, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Navigation config per context                                      */
/* ------------------------------------------------------------------ */

const ALASKA_NAV = [
  { href: "/assess", label: "Assessment" },
  { href: "/map", label: "Map" },
  { href: "/portfolio-builder", label: "Portfolio Builder" },
  { href: "/framework", label: "Framework" },
  { href: "/methods", label: "Methods" },
];

const KENTUCKY_NAV = [
<<<<<<< Updated upstream
  { href: "/kentucky", label: "Home" },
  { href: "/kentucky/satellite-planner", label: "Satellite Planner" },
=======
  { href: "/kentucky/satellite-planner", label: "Satellite Planner" , }, { href: "/kentucky/data", label: "Data" },
>>>>>>> Stashed changes
];

type NavContext = "landing" | "alaska" | "kentucky";

function getNavContext(pathname: string): NavContext {
  if (pathname.startsWith("/kentucky")) return "kentucky";
  if (
    pathname === "/alaska" ||
    pathname.startsWith("/assess") ||
    pathname.startsWith("/map") ||
    pathname.startsWith("/portfolio") ||
    pathname.startsWith("/calculator") ||
    pathname.startsWith("/framework") ||
    pathname.startsWith("/methods") ||
    pathname.startsWith("/assumptions")
  ) {
    return "alaska";
  }
  return "landing";
}

const CONTEXT_LABELS: Record<NavContext, string> = {
  landing: "All States",
  alaska: "Alaska Pilot",
  kentucky: "Kentucky Demo",
};

const CONTEXT_COLORS: Record<NavContext, string> = {
  landing: "bg-[color:rgba(16,34,53,0.08)] text-[color:var(--foreground)]",
  alaska: "bg-[color:rgba(15,124,134,0.12)] text-[color:var(--teal)]",
  kentucky: "bg-[color:rgba(196,97,42,0.12)] text-[color:var(--accent)]",
};

/* ------------------------------------------------------------------ */
/*  Header Component                                                   */
/* ------------------------------------------------------------------ */

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const context = getNavContext(pathname);
  const navItems = context === "alaska" ? ALASKA_NAV : context === "kentucky" ? KENTUCKY_NAV : [];

  const isActive = (href: string) => {
    if (context === "alaska" && href === "/alaska") return pathname === "/alaska";
    if (href === "/kentucky") return pathname === "/kentucky";
    return pathname.startsWith(href);
  };

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[color:rgba(247,243,235,0.78)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[98rem] items-center justify-between gap-4 px-4 py-4 md:px-8 lg:px-12">

        {/* ── Logo / Back ───────────────────────────────────── */}
        <div className="flex items-center gap-2">
          {context !== "landing" && (
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--line)] text-[color:var(--muted)] transition-colors hover:bg-white hover:text-[color:var(--foreground)]"
              title="Back to state selector"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
          )}
          <Link href="/" className="min-w-0" onClick={() => setMenuOpen(false)}>
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
        </div>

        {/* ── Desktop Nav ───────────────────────────────────── */}
        {navItems.length > 0 && (
          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex lg:flex-nowrap">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm whitespace-nowrap transition-colors",
                    active
                      ? "bg-[color:var(--foreground)] text-white shadow-[0_10px_24px_rgba(16,34,53,0.11)]"
                      : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* ── Right side ────────────────────────────────────── */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setAdminOpen(true)}
            className="hidden rounded-full border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--surface-strong)] lg:inline-flex"
          >
            Admin
          </button>

          <div
            className={cn(
              "hidden rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider lg:block",
              CONTEXT_COLORS[context],
            )}
          >
            {CONTEXT_LABELS[context]}
          </div>

          {/* Mobile toggle — always visible so Admin is reachable on all pages */}
          <button
            type="button"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((c) => !c)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface-soft)] text-[color:var(--foreground)] lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ─────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
            className="overflow-hidden border-t border-[color:var(--line)] lg:hidden"
          >
            <nav className="flex flex-col gap-1 p-4">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm transition-colors",
                      active
                        ? "bg-[color:var(--foreground)] text-white"
                        : "text-[color:var(--foreground)] hover:bg-white",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setAdminOpen(true);
                }}
                className="mt-2 w-full rounded-xl border border-[color:var(--line)] px-4 py-3 text-left text-sm text-[color:var(--foreground)] hover:bg-white"
              >
                Admin
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

    </header>

    {/* ── Admin Modal (portaled to body so fixed positioning is viewport-relative) */}
    <AdminModal open={adminOpen} onClose={() => setAdminOpen(false)} />
  </>
  );
}

function AdminModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 rounded-2xl bg-white p-8 shadow-2xl max-w-md w-full"
          >
            <div className="flex items-center justify-center h-12 w-12 mx-auto bg-[color:rgba(196,97,42,0.1)] rounded-full">
              <Lock className="h-6 w-6 text-[color:var(--accent)]" />
            </div>
            <h2 className="mt-4 text-center font-display text-2xl text-[color:var(--foreground)]">Admin Access</h2>
            <p className="mt-2 text-center text-sm text-[color:var(--muted)]">
              Full-stack admin login and access coming soon for all states.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-[color:var(--foreground)] px-4 py-3 text-white transition-colors hover:bg-[color:#223a54]"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
