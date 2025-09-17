// ===========================================
// PATH: src/app/signup/page.tsx
// ===========================================
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import "@/styles/auth.css";

export default function SignupPage() {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const success = await signup(email, password);

    if (!success) {
      setError("Signup failed. Email may already be in use.");
      setLoading(false);
    }
    // if signup succeeds, AuthContext will redirect automatically
  };

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSignup}>
        <h1>Sign Up</h1>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
        <p className="switch-auth">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </main>
  );
}
