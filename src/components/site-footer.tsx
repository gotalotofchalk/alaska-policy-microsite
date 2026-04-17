"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";

export function SiteFooter() {
  const pathname = usePathname();
  const isKentucky = pathname.startsWith("/kentucky");

  return (
    <footer className="border-t border-[color:var(--line)] bg-[color:#102235] text-white">
      <div className="mx-auto grid max-w-[100rem] gap-8 px-4 py-10 md:grid-cols-[1.3fr_1fr_1fr] md:px-8 lg:px-12">

        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <span className="text-xs font-bold text-white">RN</span>
            </div>
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.34em] text-white/45">
                Rural Health Transformation
              </p>
              <p className="font-display text-lg font-semibold text-white">RHT-NAV</p>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/60">
            A state decision framework for sequencing technology-enabled rural health
            investments under the Rural Health Transformation Program. Developed at
            Stanford University in collaboration with the RHT Collaborative.
          </p>
          <p className="text-xs text-white/35">
            &copy; 2026 Joshua Gottschalk. All rights reserved.
          </p>
        </div>

        {/* Navigate */}
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">Navigate</p>
          <div className="flex flex-wrap gap-2 text-sm text-white/70">
            <Link href="/" className="rounded-full border border-white/12 px-3 py-1 hover:bg-white/8">
              All States
            </Link>
            <Link href="/alaska" className="rounded-full border border-white/12 px-3 py-1 hover:bg-white/8">
              Alaska
            </Link>
            <Link href="/kentucky" className="rounded-full border border-white/12 px-3 py-1 hover:bg-white/8">
              Kentucky
            </Link>
            {isKentucky && (
              <Link href="/kentucky/satellite-planner" className="rounded-full border border-white/12 px-3 py-1 hover:bg-white/8">
                Broadband Map
              </Link>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">Contact</p>
          <div className="space-y-2">
            <a
              href="mailto:joshgott@stanford.edu"
              className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4 shrink-0 text-white/40" />
              joshgott@stanford.edu
            </a>
            <p className="text-xs leading-relaxed text-white/35">
              Questions, suggestions, or opportunities for partnership.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
