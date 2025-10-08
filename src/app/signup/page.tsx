// ===========================================
// PATH: src/app/signup/page.tsx
// Styled Signup Page with Password Strength Meter
// ===========================================

"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "@/styles/auth.css"; // custom styles for form & strength meter

// Regex patterns for password validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const { signup, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Track individual password criteria
  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  // Redirect if user already logged in
  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  // Validate email & password as user types
  useEffect(() => {
    setValidEmail(emailRegex.test(email));

    const length = password.length >= 8;
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const number = /\d/.test(password);
    const specialChar = /[@$!%*?&]/.test(password);

    setCriteria({ length, uppercase, lowercase, number, specialChar });
    setValidPassword(length && uppercase && lowercase && number && specialChar);
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validPassword) {
      setError(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
      return;
    }

    setLoading(true);
    try {
      await signup(email.trim().toLowerCase(), password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Count how many password criteria are met (for strength bar)
  const metCount = Object.values(criteria).filter(Boolean).length;

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={validEmail || email === "" ? "" : "input-error"}
          required
        />
        {!validEmail && email !== "" && (
          <p className="error-small">Invalid email format</p>
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={validPassword || password === "" ? "" : "input-error"}
          required
        />
        {!validPassword && password !== "" && (
          <p className="error-small">Password must meet all criteria below</p>
        )}

        {/* Strength meter */}
        {password && (
          <div className="strength-meter">
            {Object.entries(criteria).map(([key, met], i) => {
              let colorClass = "weak";
              if (metCount >= 4) colorClass = "strong";
              else if (metCount >= 2) colorClass = "medium";
              return (
                <div
                  key={i}
                  className={`strength-bar ${met ? colorClass : ""}`}
                  title={key}
                />
              );
            })}
          </div>
        )}

        {/* Criteria labels */}
        {password && (
          <div className="strength-labels">
            <span>8+ characters</span>
            <span>Uppercase letter</span>
            <span>Lowercase letter</span>
            <span>Number</span>
            <span>Special character</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !validEmail || !validPassword}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="switch-auth">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
