"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const LandingPage: React.FC = () => {
  const { login, signup, loading } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignup) {
        await signup(form.name, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "24px" }}>
      <h1 style={{ textAlign: "center" }}>{isSignup ? "Sign Up" : "Login"}</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
        {isSignup && (
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
        </button>
      </form>
      {error && <div style={{ color: "red", marginTop: "12px" }}>{error}</div>}
      <div style={{ marginTop: "12px", textAlign: "center" }}>
        {isSignup ? (
          <>
            Already have an account?{" "}
            <button type="button" onClick={() => setIsSignup(false)}>
              Login
            </button>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <button type="button" onClick={() => setIsSignup(true)}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
