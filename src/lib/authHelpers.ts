// PATH: src/lib/authHelpers.ts
export interface AuthUser {
  id: string;
  email: string;
}

// Internal helper
async function handleResponse(res: Response): Promise<AuthUser | null> {
  if (!res.ok) return null;
  return res.json();
}

// Login API
export async function login(
  email: string,
  password: string
): Promise<AuthUser | null> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // important for HTTP-only cookie
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  } catch {
    return null;
  }
}

// Signup API
export async function signup(
  email: string,
  password: string
): Promise<AuthUser | null> {
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  } catch {
    return null;
  }
}

// Logout API
export async function logout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  } catch {}
}

// Get current user from server
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    return handleResponse(res);
  } catch {
    return null;
  }
}
