// ===========================================
// PATH: src/lib/api.ts
// ===========================================

import { User } from "@/context/AuthContext";

// -----------------------------
// Login
// -----------------------------
export async function login(email: string, password: string): Promise<void> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Login failed");
}

// -----------------------------
// Signup
// -----------------------------
export async function signup(
  email: string,
  password: string,
  name?: string
): Promise<void> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Signup failed");
}

// -----------------------------
// Logout
// -----------------------------
export async function logout(): Promise<void> {
  const res = await fetch("/api/auth/logout", { method: "POST" });
  if (!res.ok) throw new Error("Logout failed");
}

// -----------------------------
// Get current logged-in user
// -----------------------------
export async function me(): Promise<User | null> {
  const res = await fetch("/api/auth/me");
  if (!res.ok) return null;
  return (await res.json()) as User;
}
