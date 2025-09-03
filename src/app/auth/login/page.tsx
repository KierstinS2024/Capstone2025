// src/app/auth/login/page.tsx
/**
 * LoginPage.tsx
 * ----------------
 * Login form page.
 * Uses AuthContext to log in users and redirect to dashboard on success.
 * Fully styled with CSS Modules and semantic class names.
 */

"use client";

import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <form className={styles.formWrapper} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>Login</h2>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.inputContainer}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className={styles.inputField}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className={styles.inputField}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
