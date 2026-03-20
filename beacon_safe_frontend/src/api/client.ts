import type { Device, ProfileSettings, User } from "../types";

const DEFAULT_TIMEOUT_MS = 15000;

export class ApiError extends Error {
  status: number;
  detail?: unknown;

  constructor(message: string, status: number, detail?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

function getApiBase(): string {
  // Prefer VITE_API_BASE; keep compatibility with existing env var.
  return (import.meta as any).env?.VITE_API_BASE || (import.meta as any).env?.VITE_BACKEND_URL || "";
}

async function fetchJson<T>(
  path: string,
  options: RequestInit & { token?: string; timeoutMs?: number } = {},
): Promise<T> {
  const base = getApiBase();
  if (!base) {
    throw new ApiError(
      "Missing API base URL. Set VITE_API_BASE (or VITE_BACKEND_URL) in the frontend .env.",
      0,
    );
  }

  const url = `${base.replace(/\/+$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
  const controller = new AbortController();
  // Use globalThis to satisfy ESLint no-undef in environments without configured browser globals.
  const timeout = globalThis.setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  try {
    const res = await globalThis.fetch(url, { ...options, headers, signal: controller.signal });
    const text = await res.text();
    const data = text ? safeJsonParse(text) : null;

    if (!res.ok) {
      throw new ApiError(`API request failed: ${res.status} ${res.statusText}`, res.status, data);
    }
    return data as T;
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new ApiError("API request timed out", 0);
    }
    if (err instanceof ApiError) throw err;
    throw new ApiError(err?.message || "API request failed", 0);
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// PUBLIC_INTERFACE
export async function apiLogin(username: string, password: string): Promise<User> {
  /** Contract:
   * Inputs: username/password (any values accepted by backend mock auth).
   * Output: User {username,email,token}
   * Errors: throws ApiError on non-2xx or network errors.
   */
  // Backend spec isn't available in OpenAPI; implement per work item contract.
  return fetchJson<User>("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

// PUBLIC_INTERFACE
export async function apiGetDevices(token: string): Promise<Device[]> {
  /** Fetch device list for dashboard. */
  return fetchJson<Device[]>("/dashboard", { method: "GET", token });
}

// PUBLIC_INTERFACE
export async function apiGetSettings(token: string): Promise<ProfileSettings> {
  /** Fetch user profile/system settings. */
  return fetchJson<ProfileSettings>("/settings", { method: "GET", token });
}

// PUBLIC_INTERFACE
export async function apiUpdateSettings(token: string, settings: ProfileSettings): Promise<ProfileSettings> {
  /** Update user profile/system settings. */
  return fetchJson<ProfileSettings>("/settings", {
    method: "PUT",
    token,
    body: JSON.stringify(settings),
  });
}
