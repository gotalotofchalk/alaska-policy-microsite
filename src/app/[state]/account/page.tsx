"use client";

import { motion } from "framer-motion";
import { Lock, LogOut, ShieldCheck, KeyRound } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { useAdmin } from "@/components/admin/admin-context";
import { STATE_CONFIGS, type ValidState } from "@/config/states";

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AccountPage() {
  const { state } = useParams<{ state: string }>();
  const validState = state as ValidState;
  const config = STATE_CONFIGS[validState];
  const { isAdmin, login, logout } = useAdmin();

  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (login(passkey)) {
      setPasskey("");
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-8 max-w-5xl">

        {/* ── Header ─────────────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <p className="text-xs uppercase tracking-wider text-[color:var(--muted)]">
            {config.name}
          </p>
          <h1 className="mt-2 font-display text-3xl text-[color:var(--foreground)] md:text-4xl">
            Account
          </h1>
        </motion.div>

        {/* ── Status Card ────────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          {isAdmin ? (
            <div className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:rgba(15,124,134,0.1)]">
                  <ShieldCheck className="h-6 w-6 text-[color:var(--teal)]" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-[color:var(--foreground)]">
                    Admin Active
                  </h2>
                  <p className="text-sm text-[color:var(--muted)]">
                    You are logged in as admin. Override controls are enabled.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] px-5 py-2.5 text-sm font-medium text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--surface-soft)]"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:rgba(196,97,42,0.1)]">
                  <Lock className="h-6 w-6 text-[color:var(--accent)]" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-[color:var(--foreground)]">
                    Admin Access
                  </h2>
                  <p className="text-sm text-[color:var(--muted)]">
                    Enter the admin passkey to enable data override controls.
                  </p>
                </div>
              </div>

              <div className="mt-6 max-w-sm">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-[color:var(--muted)]" />
                  <label htmlFor="passkey" className="text-xs font-medium text-[color:var(--muted)]">
                    Passkey
                  </label>
                </div>
                <input
                  id="passkey"
                  type="password"
                  value={passkey}
                  onChange={(e) => { setPasskey(e.target.value); setError(false); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Enter passkey"
                  className="mt-2 w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition-colors focus:border-[color:var(--foreground)]"
                />
                {error && (
                  <p className="mt-2 text-xs text-[color:var(--accent)]">Incorrect passkey. Try again.</p>
                )}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="mt-4 rounded-full bg-[color:var(--foreground)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[color:#223a54]"
                >
                  Log in
                </button>
              </div>
            </div>
          )}
        </motion.div>

      </motion.div>
    </div>
  );
}
