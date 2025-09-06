// path: src/app/auth/login/page.tsx
/**
 * LoginPage
 * ----------
 * Renders the login form for existing users
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

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  // --- Local state ---
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // --- Redirect logged-in users to dashboard ---
  useEffect(() => {
    if (user) {
      router.push("/dashboard/recipes");
    }
  }, [user, router]);

  // --- Handle form submission ---
  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await login(email, password); // login function from AuthContext
      router.push("/dashboard/recipes"); // redirect after successful login
    } catch (error: any) {
      setErrorMessage(error?.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Floating theme toggle in top-right */}
      <ThemeToggle />

      <form className={styles.form} onSubmit={handleLoginSubmit}>
        <h1 className={styles.title}>Login</h1>

        {/* Display error message if login fails */}
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

        {/* Submit button */}
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {/* Link to signup page */}
        <p className={styles.link}>
          Don’t have an account? <a href="/auth/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
}
