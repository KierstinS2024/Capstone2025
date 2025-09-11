// Path: src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div>
        <Link href="/">Home</Link>
      </div>

      <div>
        {user ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button className="btn btn-outline" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
            <Link href="/guest-dashboard">Guest Mode</Link>
          </>
        )}
      </div>
    </nav>
  );
}
