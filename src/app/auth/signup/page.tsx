// path: src/app/auth/signup/page.tsx
/**
 * SignupPage.tsx
 * ----------------
 * Signup form page.
 * Uses AuthContext to create a new user account.
 * Form includes email and password fields, loading state, and error handling.
 */

"use client";

import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import styles from "./SignupPage.module.css";

const SignupPage = () => {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup(email, password);
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        {error && <p className={styles.errorMsg}>{error}</p>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className={styles.inputField}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className={styles.inputField}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className={styles.btnPrimary} disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
