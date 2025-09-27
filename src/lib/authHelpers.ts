// ===========================================
// PATH: src/lib/authHelpers.ts
// Handles all client-side auth API calls
// Normalizes server responses so AuthContext
// always receives a consistent AuthUser shape.
// ===========================================

// ----- Types -----
export interface AuthUser {
  id: string;
  email: string;
}

// ----- Internal helper -----
// Normalizes any API response into {id, email} or null
async function handleResponse(res: Response): Promise<AuthUser | null> {
  if (!res.ok) return null;

  try {
    const data = await res.json();

    // Case 1: API responds directly with { id, email }
    if (data?.id && data?.email) {
      return { id: data.id, email: data.email };
    }

    // Case 2: API responds with { user: { id, email } }
    if (data?.user?.id && data?.user?.email) {
      return { id: data.user.id, email: data.user.email };
    }

    return null;
  } catch {
    return null;
  }
}

// ----- Auth APIs -----

// Login user
export async function login(
  email: string,
  password: string
): Promise<AuthUser | null> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // needed for cookies
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  } catch {
    return null;
  }
}

// Signup user
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

// Logout user
export async function logout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // swallow errors — logout should never crash UI
  }
}

// Get current user (via cookie/session)
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
    });
    return handleResponse(res);
  } catch {
    return null;
  }
}
