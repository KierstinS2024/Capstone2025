// src/lib/authHelpers.ts
// Auth-related helpers that integrate with UserContext

import { apiFetch } from "./api";
import type { User } from "../models/User";

// Simulated login (replace with real backend later)
export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  return apiFetch<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutUser(): Promise<void> {
  return apiFetch<void>("/auth/logout", { method: "POST" });
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<User> {
  return apiFetch<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}
