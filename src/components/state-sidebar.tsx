"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ClipboardList,
  FileText,
  HeartHandshake,
  Home,
  LayoutDashboard,
  MapPin,
  Menu,
  Network,
  Radio,
  Settings,
  Shield,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { STATE_CONFIGS, type ValidState } from "@/config/states";

/* ------------------------------------------------------------------ */
/*  Icon map for dynamic sidebar items                                 */
/* ------------------------------------------------------------------ */

const ICON_MAP: Record<string, React.ElementType> = {
  HeartHandshake,
  MapPin,
};

/* ------------------------------------------------------------------ */
/*  Nav item types                                                     */
/* ------------------------------------------------------------------ */

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  children?: NavItem[];
}

function getNavItems(state: ValidState): NavItem[] {
  const base = `/${state}`;
  const config = STATE_CONFIGS[state];

  const items: NavItem[] = [
    { href: `${base}/overview`, label: "State Overview", icon: LayoutDashboard },
    { href: `${base}/need`, label: "Need Assessment", icon: Stethoscope },
  ];

  if (config.extraSidebarItems) {
    for (const extra of config.extraSidebarItems) {
      const Icon = ICON_MAP[extra.icon] ?? MapPin;
      items.push({ href: extra.href, label: extra.label, icon: Icon });
    }
  }

  items.push(
    {
      href: `${base}/connectivity`,
      label: "Connectivity",
      icon: Network,
      children: [
        { href: `${base}/connectivity/translator`, label: "Connectivity Translator", icon: Radio },
      ],
    },
    { href: `${base}/capacity`, label: "Capacity & Readiness", icon: Shield },
    {
      href: `${base}/portfolio`,
      label: "Interventions",
      icon: ClipboardList,
      children: [
        { href: `${base}/portfolio/implementation-playbook`, label: "Implementation Playbook", icon: BookOpen },
      ],
    },
    { href: `${base}/benchmarks`, label: "Benchmarks", icon: BarChart3 },
    { href: `${base}/stakeholder-reports`, label: "Reports", icon: FileText },
    { href: `${base}/implementation-strategy`, label: "Strategy", icon: Users },
    { href: `${base}/account`, label: "Admin", icon: Settings },
  );

  return items;
}

/* ------------------------------------------------------------------ */
/*  Nav Link with collapsible children                                 */
/* ------------------------------------------------------------------ */

function NavLink({
  item,
  pathname,
  collapsed,
  onClick,
  depth = 0,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
  onClick?: () => void;
  depth?: number;
}) {
  const baseHref = item.href.split("#")[0];
  const isActive = pathname === baseHref || pathname.startsWith(baseHref + "/");
  const hasChildren = item.children && item.children.length > 0;
  const [childrenOpen, setChildrenOpen] = useState(false);
  const showChildren = isActive || childrenOpen;
  const Icon = item.icon;

  return (
    <>
      <div className="flex items-center">
        <Link
          href={item.href}
          onClick={onClick}
          title={collapsed ? item.label : undefined}
          className={cn(
            "flex flex-1 items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all",
            depth > 0 && "ml-7 py-1.5 text-xs",
            isActive && depth === 0
              ? "bg-[color:var(--foreground)] text-white shadow-sm"
              : isActive && depth > 0
              ? "text-[color:var(--foreground)] font-medium"
              : "text-[color:var(--muted)] hover:bg-white/60 hover:text-[color:var(--foreground)]",
          )}
        >
          <Icon className={cn("h-4 w-4 shrink-0", depth > 0 && "h-3.5 w-3.5", isActive && depth === 0 ? "text-white" : "")} />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </Link>
        {hasChildren && !collapsed && (
          <button
            type="button"
            onClick={() => setChildrenOpen((p) => !p)}
            className="mr-1 rounded-md p-1 text-[color:var(--muted)] transition-colors hover:text-[color:var(--foreground)]"
            aria-label={showChildren ? "Collapse sub-items" : "Expand sub-items"}
          >
            <ChevronDown className={cn("h-3 w-3 transition-transform", showChildren && "rotate-180")} />
          </button>
        )}
      </div>
      <AnimatePresence>
        {hasChildren && showChildren && !collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {item.children!.map((child) => (
              <NavLink
                key={child.href}
                item={child}
                pathname={pathname}
                collapsed={collapsed}
                onClick={onClick}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar Component                                                  */
/* ------------------------------------------------------------------ */

export function StateSidebar({ state }: { state: ValidState }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const config = STATE_CONFIGS[state];
  const navItems = getNavItems(state);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[color:var(--line)] px-4 py-4">
        {!collapsed && (
          <p className="font-display text-lg font-semibold text-[color:var(--foreground)]">{config.name}</p>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((p) => !p)}
          className="hidden rounded-lg p-1.5 text-[color:var(--muted)] transition-colors hover:bg-white/60 hover:text-[color:var(--foreground)] lg:block"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3 quiet-scrollbar" aria-label="State navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            pathname={pathname}
            collapsed={collapsed}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[color:var(--line)] px-4 py-3">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <span className="text-xs font-medium text-[color:var(--muted)]">{config.name}</span>
          )}
          <Link
            href="/"
            title="Return to RHT-NAV home"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--muted)] transition-colors hover:bg-white/60 hover:text-[color:var(--foreground)]"
          >
            <Home className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--foreground)] text-white shadow-lg lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-[color:var(--line)] bg-[color:var(--background)] lg:hidden"
            >
              <div className="absolute right-3 top-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-1.5 text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar — sticky, scrolls with viewport */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-[color:var(--line)] bg-[color:var(--background)]/80 backdrop-blur-xl transition-all duration-300 lg:block",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
