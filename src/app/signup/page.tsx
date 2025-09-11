// Path: src/app/signup/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(""); // NEW: capture name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(name, email, password); // Pass all 3 args
    router.push("/dashboard");
  };

  return (
    <div className="container center" style={{ height: "100vh" }}>
      <form
        className="card"
        style={{ maxWidth: "400px", width: "100%" }}
        onSubmit={handleSubmit}
      >
        <h2 style={{ marginBottom: "1rem" }}>Signup</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ marginBottom: "1rem", padding: "0.5rem" }}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginBottom: "1rem", padding: "0.5rem" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginBottom: "1rem", padding: "0.5rem" }}
        />

        <button type="submit" className="btn btn-primary">
          Signup
        </button>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Already have an account? <Link href="/login">Login</Link>
        </p>
        <p style={{ marginTop: "0.5rem", textAlign: "center" }}>
          Or continue in <Link href="/guest-dashboard">Guest Mode</Link>
        </p>
      </form>
    </div>
  );
}
