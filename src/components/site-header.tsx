"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "@/components/admin/admin-context";
import { AdminLoginModal } from "@/components/admin/admin-login-modal";
import { useState } from "react";

const NAV_LINKS = [
  { href: "#pyramid", label: "Framework" },
  { href: "#how", label: "How it works" },
  { href: "#demo", label: "Kentucky demo" },
  { href: "#states", label: "States" },
  { href: "#collaborative", label: "Collaborative" },
];

export function SiteHeader() {
  const { isAdmin } = useAdmin();
  const [loginOpen, setLoginOpen] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <>
      <header
        className="sticky top-0 z-40 backdrop-blur-xl"
        style={{
          borderBottom: "1px solid var(--line)",
          background: "rgba(244, 247, 250, 0.88)",
        }}
      >
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-12 py-3.5">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative h-7 w-7">
              <svg viewBox="0 0 28 28" className="h-full w-full">
                <polygon
                  points="14,3 26,25 2,25"
                  fill="none"
                  stroke="var(--foreground)"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                <line
                  x1="5"
                  y1="19"
                  x2="23"
                  y2="19"
                  stroke="var(--teal)"
                  strokeWidth="1.4"
                />
                <line
                  x1="8"
                  y1="13"
                  x2="20"
                  y2="13"
                  stroke="var(--sage)"
                  strokeWidth="1.4"
                />
                <polygon points="14,3 17.3,9 10.7,9" fill="var(--accent)" />
              </svg>
            </div>
            <span className="font-display text-[18px] font-semibold tracking-wide">
              RHT<span style={{ color: "var(--muted)", fontWeight: 400 }}>-</span>NAV
            </span>
          </Link>

          {/* Nav links - show on landing page */}
          {isLanding && (
            <nav className="hidden items-center gap-7 text-[13.5px] md:flex" style={{ color: "var(--ink-2)" }}>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-[var(--accent)]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-4 text-[13px]">
            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="transition-colors hover:text-[var(--foreground)]"
              style={{ color: "var(--ink-2)" }}
            >
              {isAdmin ? "Admin" : "Sign in"}
            </button>
            {isLanding ? (
              <Link
                href="/states"
                className="rounded-full px-3.5 py-1.5 text-[12.5px] transition-all hover:border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-white"
                style={{
                  border: "1px solid var(--line-2)",
                  color: "var(--foreground)",
                }}
              >
                Start with your state &rarr;
              </Link>
            ) : (
              <Link
                href="/"
                className="rounded-full px-3.5 py-1.5 text-[12.5px] transition-all hover:border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-white"
                style={{
                  border: "1px solid var(--line-2)",
                  color: "var(--foreground)",
                }}
              >
                All states
              </Link>
            )}
          </div>
        </div>
      </header>

      <AdminLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
