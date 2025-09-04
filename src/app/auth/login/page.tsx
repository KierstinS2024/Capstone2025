// path: src/app/auth/login/page.tsx
/**
 * LoginPage.tsx
 * ----------------
 * Login form page.
 * Uses AuthContext to authenticate the user.
 * Form includes email and password fields, loading state, and error handling.
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
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Login</h2>

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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
