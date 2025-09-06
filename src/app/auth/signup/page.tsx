// path: src/app/auth/signup/page.tsx
/**
 * SignupPage
 * ----------
 * Renders the signup form for new users
 * - Uses shared AuthForm styles
 * - ThemeToggle floats in top-right
 * - Redirects logged-in users to dashboard
 * - Fully type-safe with intuitive state naming
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import styles from "../AuthForm.module.css"; // relative import to shared AuthForm CSS

export default function SignupPage() {
  const router = useRouter();
  const { signup, user } = useAuth();

  // --- Local state ---
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // --- Redirect logged-in users to dashboard ---
  useEffect(() => {
    if (user) {
      router.push("/dashboard/recipes");
    }
  }, [user, router]);

  // --- Handle form submission ---
  const handleSignupSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setErrorMessage(null);

    // Basic client-side validation
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await signup(email, password); // signup function from AuthContext
      router.push("/dashboard/recipes"); // redirect after successful signup
    } catch (error: any) {
      setErrorMessage(
        error?.message || "Failed to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Floating theme toggle in top-right */}
      <ThemeToggle />

      <form className={styles.form} onSubmit={handleSignupSubmit}>
        <h1 className={styles.title}>Sign Up</h1>

        {/* Display error message if signup fails */}
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />

        {/* Confirm Password input */}
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.input}
          required
        />

        {/* Submit button */}
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>

        {/* Link to login page */}
        <p className={styles.link}>
          Already have an account? <a href="/auth/login">Login</a>
        </p>
      </form>
    </div>
  );
}
