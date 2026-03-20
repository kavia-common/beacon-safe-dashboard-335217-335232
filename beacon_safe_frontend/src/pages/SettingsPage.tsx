import React, { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import type { ProfileSettings } from "../types";

// PUBLIC_INTERFACE
export function SettingsPage() {
  /** Shows profile info and system preferences, including theme toggle. */
  const { settings, refreshSettings, saveSettings, loading, error, theme, setTheme } = useAppContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  useEffect(() => {
    if (settings) {
      setName(settings.name ?? "");
      setEmail(settings.email ?? "");
    }
  }, [settings]);

  const canSave = useMemo(() => name.trim().length > 0 && email.trim().length > 0, [name, email]);

  const onSave = async () => {
    const payload: ProfileSettings = {
      name: name.trim(),
      email: email.trim(),
      theme,
    };
    await saveSettings(payload);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-lg font-semibold text-slate-100">Settings</div>
        <div className="text-sm text-slate-400">Profile and system preferences.</div>
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-5 shadow-glow backdrop-blur">
          <div className="text-sm font-semibold text-slate-100">Profile Info</div>
          <div className="mt-1 text-xs text-slate-400">Update your display name and email.</div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-xs text-slate-400">Name</label>
              <input
                className="bs-focus w-full rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2 text-sm text-slate-100"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Security Analyst"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Email</label>
              <input
                className="bs-focus w-full rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2 text-sm text-slate-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@beacon-safe.local"
              />
            </div>

            <button
              type="button"
              disabled={!canSave || loading.settings}
              onClick={onSave}
              className="bs-focus inline-flex items-center justify-center rounded-lg bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-glow transition hover:bg-cyan-500/30 disabled:opacity-60"
            >
              {loading.settings ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-5 shadow-glow backdrop-blur">
          <div className="text-sm font-semibold text-slate-100">System Preferences</div>
          <div className="mt-1 text-xs text-slate-400">Theme and interface preferences.</div>

          <div className="mt-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-900/30 p-4">
              <div>
                <div className="text-sm font-semibold text-slate-100">Theme</div>
                <div className="text-xs text-slate-400">Choose light or dark appearance.</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={`bs-focus rounded-lg border px-3 py-2 text-xs ${
                    theme === "light"
                      ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-100"
                      : "border-slate-800/80 bg-slate-900/40 text-slate-200 hover:bg-slate-900/70"
                  }`}
                  onClick={() => setTheme("light")}
                >
                  Light
                </button>
                <button
                  type="button"
                  className={`bs-focus rounded-lg border px-3 py-2 text-xs ${
                    theme === "dark"
                      ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-100"
                      : "border-slate-800/80 bg-slate-900/40 text-slate-200 hover:bg-slate-900/70"
                  }`}
                  onClick={() => setTheme("dark")}
                >
                  Dark
                </button>
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-500">
              Theme is applied locally immediately and synced to backend when you save your profile.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
