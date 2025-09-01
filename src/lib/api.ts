// src/lib/api.ts
// Wrapper for fetch requests with token and JSON handling
export const fetcher = async (url: string, token?: string, options: any = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
      ...options.headers,
    },
  });

  if (!res.ok) throw new Error((await res.json()).message || "API Error");
  return res.json();
};
