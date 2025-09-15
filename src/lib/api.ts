// src/lib/api.ts
export async function getJSON<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, { ...options, credentials: "include" });
  if (!res.ok) throw new Error(`API request failed: ${res.statusText}`);
  return res.json();
}

export async function postJSON<T>(url: string, data: any): Promise<T> {
  return getJSON<T>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function putJSON<T>(url: string, data: any): Promise<T> {
  return getJSON<T>(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteJSON<T>(url: string): Promise<T> {
  return getJSON<T>(url, { method: "DELETE" });
}
