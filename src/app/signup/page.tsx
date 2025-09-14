// src/app/signup/page.tsx
"use client";
import "@/styles/auth.css";

import React, { useState, FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import "./signup.css"; // CSS-only styling

export default function SignupPage() {
  const { signup, loading } = useAuth(); // Get signup method and loading state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signup(email, password);
      // Redirect handled in AuthContext
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Sign Up</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}

        <label className="auth-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="auth-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
