// src/lib/authHelpers.ts
import { apiFetch } from "@/lib/api";
import type { User } from "@/types/user";

export async function loginAPI(email: string, password: string): Promise<User> {
  return await apiFetch<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

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

export async function logoutAPI(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST" });
}

export async function fetchCurrentUserAPI(): Promise<User | null> {
  return await apiFetch<User>("/auth/me");
}
