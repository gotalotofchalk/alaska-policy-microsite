"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Navigation config per context                                      */
/* ------------------------------------------------------------------ */

const ALASKA_NAV = [
  { href: "/alaska", label: "Overview" },
  { href: "/assess", label: "Assessment" },
  { href: "/map", label: "Map" },
  { href: "/portfolio-builder", label: "Portfolio Builder" },
  { href: "/calculator", label: "Calculator" },
  { href: "/framework", label: "Framework" },
  { href: "/methods", label: "Methods" },
];

const KENTUCKY_NAV = [
  { href: "/kentucky", label: "Overview" },
  { href: "/kentucky/satellite-planner", label: "Satellite Planner" },
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
  landing: "",
  alaska: "Alaska Pilot",
  kentucky: "Kentucky Demo",
};

const CONTEXT_COLORS: Record<NavContext, string> = {
  landing: "",
  alaska: "bg-[color:rgba(15,124,134,0.12)] text-[color:var(--teal)]",
  kentucky: "bg-[color:rgba(196,97,42,0.12)] text-[color:var(--accent)]",
};

/* ------------------------------------------------------------------ */
/*  Header Component                                                   */
/* ------------------------------------------------------------------ */

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const context = getNavContext(pathname);
  const navItems = context === "alaska" ? ALASKA_NAV : context === "kentucky" ? KENTUCKY_NAV : [];

  const isActive = (href: string) => {
    if (context === "alaska" && href === "/alaska") return pathname === "/alaska";
    if (href === "/kentucky") return pathname === "/kentucky";
    return pathname.startsWith(href);
  };

  return (
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
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:#102235]">
                <span className="text-sm font-bold text-white">RN</span>
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
          {context === "alaska" && (
            <Link
              href="/assumptions"
              className="hidden rounded-full border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--surface-strong)] lg:inline-flex"
            >
              Admin
            </Link>
          )}

          {context !== "landing" && (
            <div
              className={cn(
                "hidden rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider lg:block",
                CONTEXT_COLORS[context],
              )}
            >
              {CONTEXT_LABELS[context]}
            </div>
          )}

          {/* Mobile toggle */}
          {navItems.length > 0 && (
            <button
              type="button"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((c) => !c)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface-soft)] text-[color:var(--foreground)] lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile Menu ─────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && navItems.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
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
              {context === "alaska" && (
                <Link
                  href="/assumptions"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 rounded-xl border border-[color:var(--line)] px-4 py-3 text-sm text-[color:var(--foreground)]"
                >
                  Admin
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
