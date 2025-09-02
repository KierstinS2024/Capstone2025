// path: src/app/auth/signup/page.tsx
"use client";

import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import styles from "./SignupPage.module.css"; // keep CSS separate and scoped
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { login } = useContext(AuthContext); // access global auth
  const router = useRouter();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form submit handler
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      // Save auth info globally and redirect to dashboard
      login(data.token, data.user);

      // optional: router.push("/dashboard"); already handled by login()
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Sign Up</h1>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSignup} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className={styles.loginPrompt}>
          Already have an account?{" "}
          <a href="/auth/login" className={styles.loginLink}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
