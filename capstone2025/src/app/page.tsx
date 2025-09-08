// src/app/page.tsx
/**
 * Home / Landing Page
 * Provides navigation to Login or Signup
 */

import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Recipe & Meal Planner App</h1>
      <p>Welcome! Please log in or sign up to continue.</p>

      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <Link href="/auth/login">
          <button type="button">Login</button>
        </Link>
        <Link href="/auth/signup">
          <button type="button">Sign Up</button>
        </Link>
      </div>
    </main>
  );
}
