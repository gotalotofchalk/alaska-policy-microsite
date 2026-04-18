"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Lock, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { useAdmin } from "@/components/admin/admin-context";

export function AdminLoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { isAdmin, login, logout } = useAdmin();
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = () => {
    if (login(passkey)) {
      setPasskey("");
      setError(false);
      onClose();
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

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
            className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl"
          >
            {isAdmin ? (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[color:rgba(15,124,134,0.1)]">
                  <Lock className="h-6 w-6 text-[color:var(--teal)]" />
                </div>
                <h2 className="mt-4 text-center font-display text-2xl text-[color:var(--foreground)]">
                  Admin Active
                </h2>
                <p className="mt-2 text-center text-sm text-[color:var(--muted)]">
                  You are logged in as admin. Override controls are enabled across all modules.
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-[color:var(--line)] px-4 py-3 text-sm text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--surface-soft)]"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 w-full rounded-full bg-[color:var(--foreground)] px-4 py-3 text-white transition-colors hover:bg-[color:#223a54]"
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[color:rgba(196,97,42,0.1)]">
                  <Lock className="h-6 w-6 text-[color:var(--accent)]" />
                </div>
                <h2 className="mt-4 text-center font-display text-2xl text-[color:var(--foreground)]">
                  Admin Access
                </h2>
                <p className="mt-2 text-center text-sm text-[color:var(--muted)]">
                  Enter the admin passkey to enable data override controls.
                </p>
                <div className="mt-6">
                  <input
                    type="password"
                    value={passkey}
                    onChange={(e) => { setPasskey(e.target.value); setError(false); }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Enter passkey"
                    className="field-shell w-full text-sm"
                    autoFocus
                  />
                  {error && (
                    <p className="mt-2 text-xs text-[color:var(--accent)]">Incorrect passkey. Try again.</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="mt-4 w-full rounded-full bg-[color:var(--foreground)] px-4 py-3 text-white transition-colors hover:bg-[color:#223a54]"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 w-full rounded-full px-4 py-3 text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--foreground)]"
                >
                  Cancel
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
