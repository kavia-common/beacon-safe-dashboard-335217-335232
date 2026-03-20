import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import type { Device } from "../types";

function statusBadge(status: Device["status"]) {
  switch (status) {
    case "Online":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
    case "Warning":
      return "border-amber-500/30 bg-amber-500/10 text-amber-200";
    case "Offline":
    default:
      return "border-rose-500/30 bg-rose-500/10 text-rose-200";
  }
}

function batteryBar(battery: number) {
  const pct = Math.max(0, Math.min(100, battery));
  const color =
    pct >= 60 ? "bg-emerald-400" : pct >= 30 ? "bg-amber-400" : "bg-rose-400";
  return { pct, color };
}

// PUBLIC_INTERFACE
export function DashboardPage() {
  /** Shows the IoT device grid and overall posture. */
  const { devices, refreshDevices, loading, error } = useAppContext();

  useEffect(() => {
    refreshDevices();
  }, [refreshDevices]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="text-lg font-semibold text-slate-100">Device Overview</div>
          <div className="text-sm text-slate-400">
            Live status and battery telemetry (mock data from backend).
          </div>
        </div>
        <button
          type="button"
          onClick={refreshDevices}
          className="bs-focus inline-flex items-center justify-center rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 hover:bg-slate-900/70"
        >
          {loading.devices ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {devices.map((d) => {
          const bar = batteryBar(d.battery);
          return (
            <div
              key={d.id}
              className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-5 shadow-glow backdrop-blur"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold text-slate-100">{d.name}</div>
                  <div className="mt-1 truncate text-sm text-slate-400">{d.location}</div>
                </div>
                <div
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(
                    d.status,
                  )}`}
                >
                  {d.status}
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Battery</span>
                  <span className="text-slate-200">{bar.pct}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800/60">
                  <div className={`h-full ${bar.color}`} style={{ width: `${bar.pct}%` }} />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-slate-800/70 bg-slate-900/30 p-3">
                  <div className="text-slate-400">Signal</div>
                  <div className="mt-1 font-semibold text-slate-100">
                    {d.status === "Online" ? "Stable" : d.status === "Warning" ? "Degraded" : "Lost"}
                  </div>
                </div>
                <div className="rounded-lg border border-slate-800/70 bg-slate-900/30 p-3">
                  <div className="text-slate-400">Risk</div>
                  <div className="mt-1 font-semibold text-slate-100">
                    {d.status === "Online" ? "Low" : d.status === "Warning" ? "Medium" : "High"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {!loading.devices && devices.length === 0 ? (
          <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-6 text-sm text-slate-400 md:col-span-2">
            No devices returned from backend.
          </div>
        ) : null}
      </div>
    </div>
  );
}
