// Path: src/app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import styles from "./LoginPage.module.css";

/**
 * LoginPage component
 * ------------------
 * Handles user login with email and password.
 * - Emails are normalized to lowercase to match signup.
 * - Validates required fields and email format on client-side.
 */
export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!emailInput || !passwordInput) {
      setErrorMessage("Email and password are required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      setErrorMessage("Invalid email format.");
      return false;
    }

    return true;
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(emailInput.toLowerCase(), passwordInput);
      router.push("/recipes"); // Navigate to recipes after login
    } catch (error: any) {
      setErrorMessage(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <ThemeToggle />

      <form className={styles.form} onSubmit={handleLogin}>
        <h2>Login</h2>

        {errorMessage && <p className={styles.errorMsg}>{errorMessage}</p>}

        <input
          type="email"
          placeholder="Email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          required
          className={styles.inputField}
        />

        <input
          type="password"
          placeholder="Password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          required
          className={styles.inputField}
        />

        <button type="submit" className={styles.btnPrimary} disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className={styles.authLink}>
          Don’t have an account? <a href="/auth/signup">Sign up here</a>
        </p>
      </form>
    </div>
  );
}
