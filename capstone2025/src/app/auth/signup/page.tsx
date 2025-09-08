// src/app/auth/signup/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./AuthForm.module.css";

export default function SignupPage() {
  const { signup, loading, error } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email.trim().toLowerCase(), password);
      router.push("/dashboard");
    } catch {}
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Sign Up</h1>
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
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <p className={styles.linkText}>
          Already have an account?{" "}
          <a href="/auth/login" className={styles.link}>
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
