import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

// PUBLIC_INTERFACE
export function LoginPage() {
  /** Login screen for mock authentication; navigates to /dashboard when authenticated. */
  const nav = useNavigate();
  const { user, login, loading, error } = useAppContext();

  const [username, setUsername] = useState("analyst");
  const [password, setPassword] = useState("password");

  useEffect(() => {
    if (user?.token) nav("/dashboard", { replace: true });
  }, [user, nav]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username.trim(), password);
    nav("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="bs-grid-bg min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800/70 bg-slate-950/70 p-6 shadow-glow backdrop-blur">
            <div className="mb-6">
              <div className="text-xl font-semibold tracking-wide">
                <span className="text-slate-100">Beacon</span>
                <span className="text-cyan-300">-Safe</span>
              </div>
              <div className="mt-1 text-sm text-slate-400">
                Sign in to monitor your IoT security perimeter.
              </div>
            </div>

            {error ? (
              <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-slate-400">Username</label>
                <input
                  className="bs-focus w-full rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="yourname"
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-400">Password</label>
                <input
                  className="bs-focus w-full rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading.auth}
                className="bs-focus w-full rounded-lg bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-glow transition hover:bg-cyan-500/30 disabled:opacity-60"
              >
                {loading.auth ? "Signing in..." : "Login"}
              </button>

              <div className="text-xs text-slate-500">
                Mock auth: any username/password is accepted.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
