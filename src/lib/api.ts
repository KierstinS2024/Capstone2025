// PATH: src/lib/api.ts
// Generic API wrapper for client-side fetch calls to Next.js API routes.
// Automatically includes credentials so httpOnly cookies are sent with requests.

export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: "include", // send cookies with requests
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `API request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}
