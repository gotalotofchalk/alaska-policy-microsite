"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigationItems = [ { href: "/", label: "Overview" }, { href: "/assess", label: "Assessment" }, { href: "/map", label: "Map" }, { href: "/portfolio-builder", label: "Portfolio Builder" }, { href: "/calculator", label: "Calculator" }, { href: "/framework", label: "Framework" }, { href: "/methods", label: "Methods" } ];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[color:rgba(247,243,235,0.78)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[98rem] items-center justify-between gap-4 px-4 py-4 md:px-8 lg:px-12">
        <Link href="/" className="min-w-0" onClick={() => setMenuOpen(false)}>
          <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:#102235]"><span className="text-sm font-bold text-white">RN</span></div><div><p className="text-[0.68rem] uppercase tracking-[0.34em] text-[color:var(--muted)]">Rural Health Transformation</p><p className="font-display text-lg font-semibold leading-none text-[color:var(--foreground)] md:text-xl">RHT-NAV</p></div></div>
        </Link>
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex lg:flex-nowrap">
          {navigationItems.map((item) => { const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href); return (<Link key={item.href} href={item.href} className={cn("rounded-full px-3 py-2 text-sm whitespace-nowrap transition-colors", active ? "bg-[color:var(--foreground)] text-white shadow-[0_10px_24px_rgba(16,34,53,0.11)]" : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]")}>{item.label}</Link>); })}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/assumptions" className="hidden rounded-full border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--surface-strong)] lg:inline-flex">Admin</Link>
          <div className="hidden rounded-full bg-[color:rgba(15,124,134,0.12)] px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[color:var(--teal)] lg:block">Alaska Pilot</div>
          <button type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen((c) => !c)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface-soft)] text-[color:var(--foreground)] lg:hidden">{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>
      <AnimatePresence initial={false}>{menuOpen && (<motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.18}} className="border-t border-[color:var(--line)] bg-[color:rgba(247,243,235,0.94)] px-4 pb-5 pt-4 backdrop-blur-2xl lg:hidden"><nav className="grid gap-2">{navigationItems.map((item) => { const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href); return (<Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={cn("rounded-2xl border px-4 py-3 text-sm transition-colors", active ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-white" : "border-[color:var(--line)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]")}>{item.label}</Link>); })}</nav></motion.div>)}</AnimatePresence>
    </header>
  );
}
