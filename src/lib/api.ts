// path: src/lib/api.ts
/**
 * API Helper Functions
 *
 * Centralized helper functions for making API requests from the frontend.
 * Can handle auth token injection, error handling, and JSON parsing.
 */

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

/**
 * Perform a GET request
 * @param url - API endpoint
 * @param token - Optional JWT token for auth
 */
export async function getRequest<T>(url: string, token?: string): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    const data = await res.json();
    return res.ok ? { data } : { error: data.message || "Error fetching data" };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}

/**
 * Perform a POST request
 * @param url - API endpoint
 * @param body - Request payload
 * @param token - Optional JWT token for auth
 */
export async function postRequest<T>(url: string, body: any, token?: string): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return res.ok ? { data } : { error: data.message || "Error posting data" };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}

/**
 * Perform a PUT request
 */
export async function putRequest<T>(url: string, body: any, token?: string): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return res.ok ? { data } : { error: data.message || "Error updating data" };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}

/**
 * Perform a DELETE request
 */
export async function deleteRequest<T>(url: string, token?: string): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    const data = await res.json();
    return res.ok ? { data } : { error: data.message || "Error deleting data" };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}
