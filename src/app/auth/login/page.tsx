// src/app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className={styles.container}>
      {/* Floating Theme Toggle */}
      <ThemeToggle />

      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Login</h2>

        {error && <p className={styles.errorMsg}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.inputField}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.inputField}
        />

        <button type="submit" className={styles.btnPrimary}>
          Log In
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Don’t have an account?{" "}
          <a href="/auth/signup" style={{ color: "var(--primary)" }}>
            Sign up here
          </a>
        </p>
      </form>
    </div>
  );
}
