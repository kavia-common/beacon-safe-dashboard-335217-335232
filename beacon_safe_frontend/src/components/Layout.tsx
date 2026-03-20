import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function PageTitle() {
  const location = useLocation();
  if (location.pathname.startsWith("/settings")) return "Settings";
  if (location.pathname.startsWith("/dashboard")) return "Dashboard";
  return "Beacon-Safe";
}

// PUBLIC_INTERFACE
export function Layout({ children }: { children: React.ReactNode }) {
  /** Standard authenticated layout with sidebar navigation and top bar. */
  const nav = useNavigate();
  const { user, logout, theme, setTheme } = useAppContext();

  const onLogout = () => {
    logout();
    nav("/login", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cx(
      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
      isActive
        ? "bg-cyan-500/10 text-cyan-200 shadow-glow"
        : "text-slate-200/80 hover:bg-slate-800/40 hover:text-slate-100",
    );

  return (
    <div className={cx("min-h-screen", theme === "dark" ? "dark" : "")}>
      <div className="min-h-screen bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100">
        <div className="bs-grid-bg min-h-screen">
          <div className="mx-auto flex min-h-screen max-w-7xl">
            <aside className="hidden w-64 flex-col border-r border-slate-800/70 bg-slate-950/60 p-4 backdrop-blur md:flex">
              <div className="mb-6">
                <div className="text-lg font-semibold tracking-wide">
                  <span className="text-slate-100">Beacon</span>
                  <span className="text-cyan-300">-Safe</span>
                </div>
                <div className="mt-1 text-xs text-slate-400">IoT Threat Monitor</div>
              </div>

              <nav className="flex flex-col gap-1">
                <NavLink to="/dashboard" className={linkClass}>
                  <span className="h-2 w-2 rounded-full bg-cyan-400/80 shadow-glow" />
                  Dashboard
                </NavLink>
                <NavLink to="/settings" className={linkClass}>
                  <span className="h-2 w-2 rounded-full bg-violet-400/80" />
                  Settings
                </NavLink>
                <button
                  type="button"
                  className="bs-focus mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-200/80 transition hover:bg-slate-800/40 hover:text-slate-100"
                  onClick={onLogout}
                >
                  <span className="h-2 w-2 rounded-full bg-rose-400/80" />
                  Logout
                </button>
              </nav>

              <div className="mt-auto rounded-xl border border-slate-800/70 bg-slate-900/30 p-3">
                <div className="text-xs text-slate-400">Signed in as</div>
                <div className="mt-1 truncate text-sm text-slate-100">{user?.username ?? "-"}</div>
                <div className="truncate text-xs text-slate-400">{user?.email ?? ""}</div>
              </div>
            </aside>

            <main className="flex min-w-0 flex-1 flex-col">
              <header className="flex items-center justify-between border-b border-slate-800/70 bg-slate-950/60 px-4 py-3 backdrop-blur md:px-6">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold text-slate-100">
                    <PageTitle />
                  </div>
                  <div className="hidden text-xs text-slate-400 md:block">
                    Security posture at a glance
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="bs-focus rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2 text-xs text-slate-100 hover:bg-slate-900/70"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    aria-label="Toggle theme"
                  >
                    Theme: {theme === "dark" ? "Dark" : "Light"}
                  </button>
                </div>
              </header>

              <div className="flex-1 px-4 py-6 md:px-6">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
