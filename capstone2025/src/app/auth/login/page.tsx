// src/app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "../AuthForm.module.css";

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email.trim().toLowerCase(), password);
      router.push("/dashboard");
    } catch {
      // handled in AuthContext
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
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
