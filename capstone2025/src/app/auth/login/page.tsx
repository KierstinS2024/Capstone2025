// src/app/auth/login/page.tsx

"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
//import styles from "./AuthForm.module.css";

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email.trim().toLowerCase(), password);
    } catch {
      // error handled in context
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className={styles.linkText}>
          Don't have an account?{" "}
          <a href="/auth/signup" className={styles.link}>
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}
