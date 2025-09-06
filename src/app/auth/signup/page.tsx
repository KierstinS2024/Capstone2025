// Path: src/app/auth/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import styles from "./SignupPage.module.css";

/**
 * SignupPage component
 * --------------------
 * Handles user registration with email and password.
 * - Emails are normalized to lowercase to avoid case-sensitivity issues.
 * - Validates email format and password length on client-side.
 * - Requires "Confirm Password" to match the password.
 */
export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!emailInput || !passwordInput || !confirmPassword) {
      setErrorMessage("All fields are required.");
      return false;
    }

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      setErrorMessage("Invalid email format.");
      return false;
    }

    if (passwordInput.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return false;
    }

    if (passwordInput !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      await signup(emailInput.toLowerCase(), passwordInput);
      router.push("/recipes"); // Navigate to recipes after signup
    } catch (error: any) {
      setErrorMessage(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <ThemeToggle />

      <form onSubmit={handleSignup} className={styles.form}>
        <h1>Create Account</h1>

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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={styles.inputField}
        />

        <button type="submit" className={styles.btnPrimary} disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className={styles.authLink}>
          Already have an account? <a href="/auth/login">Log in here</a>
        </p>
      </form>
    </div>
  );
}
