// src/lib/api.ts
// Utility function to fetch data from an API
export async function fetchData<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  return res.json() as Promise<T>; // Type-safe response
}
