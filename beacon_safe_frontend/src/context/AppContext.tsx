import React, { createContext, useContext, useMemo, useState } from "react";
import type { Device, ProfileSettings, User } from "../types";
import { apiGetDevices, apiGetSettings, apiLogin, apiUpdateSettings } from "../api/client";

type LoginFn = { (a: string, b: string): Promise<void> };
type SaveSettingsFn = { (a: ProfileSettings): Promise<void> };
type SetThemeFn = { (a: "dark" | "light"): void };

interface AppContextValue {
  user: User | null;
  devices: Device[];
  settings: ProfileSettings | null;

  loading: {
    auth: boolean;
    devices: boolean;
    settings: boolean;
  };

  error: string | null;

  login: LoginFn;
  logout: () => void;

  refreshDevices: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  saveSettings: SaveSettingsFn;

  theme: "dark" | "light";
  setTheme: SetThemeFn;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const LS_KEY = "beacon_safe_state_v1";

type PersistedState = {
  user: User | null;
  theme: "dark" | "light";
};

// PUBLIC_INTERFACE
export function AppProvider({ children }: { children: React.ReactNode }) {
  /** Provides global Beacon-Safe state (user, devices, settings, theme). */
  const persisted = loadPersistedState();

  const [user, setUser] = useState<User | null>(persisted.user);
  const [devices, setDevices] = useState<Device[]>([]);
  const [settings, setSettings] = useState<ProfileSettings | null>(null);

  const [theme, _setTheme] = useState<"dark" | "light">(persisted.theme ?? "dark");

  const [loading, setLoading] = useState({ auth: false, devices: false, settings: false });
  const [error, setError] = useState<string | null>(null);

  const setTheme = (next: "dark" | "light") => {
    _setTheme(next);
    persistState({ user, theme: next });
  };

  const login = async (username: string, password: string) => {
    setError(null);
    setLoading((l) => ({ ...l, auth: true }));
    try {
      const u = await apiLogin(username, password);
      setUser(u);
      persistState({ user: u, theme });
    } finally {
      setLoading((l) => ({ ...l, auth: false }));
    }
  };

  const logout = () => {
    setUser(null);
    setDevices([]);
    setSettings(null);
    setError(null);
    persistState({ user: null, theme });
  };

  const refreshDevices = async () => {
    if (!user?.token) return;
    setError(null);
    setLoading((l) => ({ ...l, devices: true }));
    try {
      const list = await apiGetDevices(user.token);
      setDevices(list);
    } catch (e: any) {
      setError(e?.message || "Failed to load devices");
    } finally {
      setLoading((l) => ({ ...l, devices: false }));
    }
  };

  const refreshSettings = async () => {
    if (!user?.token) return;
    setError(null);
    setLoading((l) => ({ ...l, settings: true }));
    try {
      const s = await apiGetSettings(user.token);
      setSettings(s);
      // Sync theme toggle with server preference when available.
      if (s?.theme && (s.theme === "dark" || s.theme === "light")) {
        _setTheme(s.theme);
        persistState({ user, theme: s.theme });
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load settings");
    } finally {
      setLoading((l) => ({ ...l, settings: false }));
    }
  };

  const saveSettings = async (next: ProfileSettings) => {
    if (!user?.token) return;
    setError(null);
    setLoading((l) => ({ ...l, settings: true }));
    try {
      const saved = await apiUpdateSettings(user.token, next);
      setSettings(saved);
      if (saved?.theme) setTheme(saved.theme);
    } catch (e: any) {
      setError(e?.message || "Failed to save settings");
      throw e;
    } finally {
      setLoading((l) => ({ ...l, settings: false }));
    }
  };

  const value: AppContextValue = useMemo(
    () => ({
      user,
      devices,
      settings,
      loading,
      error,
      login,
      logout,
      refreshDevices,
      refreshSettings,
      saveSettings,
      theme,
      setTheme,
    }),
    [user, devices, settings, loading, error, theme],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAppContext(): AppContextValue {
  /** Hook to access the Beacon-Safe global app context. */
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}

function loadPersistedState(): PersistedState {
  try {
    const raw = globalThis.localStorage?.getItem(LS_KEY);
    if (!raw) return { user: null, theme: "dark" };
    const parsed = JSON.parse(raw) as PersistedState;
    return {
      user: parsed.user ?? null,
      theme: parsed.theme === "light" ? "light" : "dark",
    };
  } catch {
    return { user: null, theme: "dark" };
  }
}

function persistState(state: PersistedState) {
  try {
    globalThis.localStorage?.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // Non-fatal: ignore persistence failures (private mode, quota, etc.)
  }
}
