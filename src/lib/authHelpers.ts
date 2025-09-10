// src/lib/authHelpers.ts
// Authentication helper functions for API routes

import { apiFetch } from "@/lib/api";
import type { User } from "@/types/user";

/**
 * Logs in a user with email and password.
 * Returns the logged-in User object.
 */
export async function loginAPI(email: string, password: string): Promise<User> {
  return await apiFetch<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Registers a new user with name, email, and password.
 * Returns the newly created User object.
 */
export async function signupAPI(
  name: string,
  email: string,
  password: string
): Promise<User> {
  return await apiFetch<User>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

/**
 * Logs out the current user.
 */
export async function logoutAPI(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST" });
}

/**
 * Fetches the current logged-in user from the session.
 */
export async function fetchCurrentUserAPI(): Promise<User> {
  return await apiFetch<User>("/auth/me");
}
