import { apiFetch } from "./api";
import { User } from "@/types/user";

export async function loginApi(email: string, password: string): Promise<User> {
  return apiFetch<User>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signupApi(
  email: string,
  password: string
): Promise<User> {
  return apiFetch<User>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutApi(): Promise<void> {
  return apiFetch<void>("/api/auth/logout", { method: "POST" });
}

export async function meApi(): Promise<User> {
  return apiFetch<User>("/api/auth/me");
}
