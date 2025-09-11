import type { User } from "@/types/user";

const API_BASE = "/api/auth";

/**
 * Login API call
 */
export async function loginAPI(email: string, password: string): Promise<User> {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: "Login failed" }));
    throw new Error(data.message || "Login failed");
  }

  const user: User = await res.json();
  return user;
}

/**
 * Signup API call
 */
export async function signupAPI(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const res = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: "Signup failed" }));
    throw new Error(data.message || "Signup failed");
  }

  const user: User = await res.json();
  return user;
}

/**
 * Logout API call
 */
export async function logoutAPI(): Promise<void> {
  const res = await fetch(`${API_BASE}/logout`, { method: "POST" });
  if (!res.ok) {
    throw new Error("Logout failed");
  }
}

/**
 * Fetch currently logged-in user (from session/cookie)
 */
export async function fetchCurrentUserAPI(): Promise<User | null> {
  const res = await fetch(`${API_BASE}/me`);
  if (!res.ok) return null;
  const user: User | null = await res.json();
  return user;
}
