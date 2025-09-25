// ===========================================
// PATH: src/app/login/page.tsx
// ===========================================
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import "@/styles/auth.css";

// Basic email format validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validEmail, setValidEmail] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  // Validate email on change
  useEffect(() => {
    setValidEmail(emailRegex.test(email));
  }, [email]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      // ✅ store email for recipe creation
      localStorage.setItem("userEmail", email.toLowerCase());
      router.replace("/dashboard"); // redirect after login
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
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={validEmail || email === "" ? "" : "input-error"}
          required
        />
        {!validEmail && email !== "" && (
          <p className="error-small">Invalid email format</p>
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading || !validEmail || !password}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </form>
    </main>
  );
}
