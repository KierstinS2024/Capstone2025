// src/lib/api.ts
// Small typed fetch wrapper with auth injection and consistent error shape.

export type ApiError = { message: string };

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean; // attach Bearer token from AuthContext
  signal?: AbortSignal;
};

let tokenGetter: () => string | null = () => null;

/**
 * Called by AuthContext to allow api.ts to read the current token.
 */
export function setTokenGetter(getter: () => string | null) {
  tokenGetter = getter;
}

async function request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, auth = false, signal } = options;

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (auth) {
    const token = tokenGetter?.() ?? null;
    if (token) {
      (finalHeaders as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(path, {
    method,
    headers: finalHeaders,
    body: body != null ? JSON.stringify(body) : undefined,
    signal,
    credentials: "same-origin",
  });

  const contentType = res.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const data = isJson ? await res.json().catch(() => undefined) : undefined;

  if (!res.ok) {
    const message =
      (data && typeof data.message === "string" && data.message) ||
      `${res.status} ${res.statusText || "Request failed"}`;
    const err: ApiError = { message };
    throw err;
  }

  return (data as T) ?? (undefined as unknown as T);
}

// Shorthand helpers
const get = <T = unknown>(path: string, auth = false, opts: Omit<RequestOptions, "method"> = {}) =>
  request<T>(path, { ...opts, method: "GET", auth });

const del = <T = unknown>(path: string, auth = false, opts: Omit<RequestOptions, "method"> = {}) =>
  request<T>(path, { ...opts, method: "DELETE", auth });

const post = <T = unknown>(
  path: string,
  body?: unknown,
  auth = false,
  opts: Omit<RequestOptions, "method" | "body"> = {}
) => request<T>(path, { ...opts, method: "POST", body, auth });

const put = <T = unknown>(
  path: string,
  body?: unknown,
  auth = false,
  opts: Omit<RequestOptions, "method" | "body"> = {}
) => request<T>(path, { ...opts, method: "PUT", body, auth });

const patch = <T = unknown>(
  path: string,
  body?: unknown,
  auth = false,
  opts: Omit<RequestOptions, "method" | "body"> = {}
) => request<T>(path, { ...opts, method: "PATCH", body, auth });

export { request, get, post, put, patch, del };
