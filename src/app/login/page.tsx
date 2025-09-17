// ===========================================
// PATH: src/app/login/page.tsx
// ===========================================
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import "@/styles/auth.css";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      router.replace("/dashboard"); // ✅ guaranteed redirect after login
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleLogin}>
        <h1>Login</h1>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </form>
    </main>
  );
}
