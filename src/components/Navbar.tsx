// src/components/Navbar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import "@/styles/navbar.css"; // CSS-only styling

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null; // Hide Navbar if not logged in

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Meal Plans", href: "/meal-plans" },
    { name: "Recipes", href: "/recipes" },
    { name: "Shopping List", href: "/shopping-list" },
    { name: "Profile", href: "/profile" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link href="/" className="navbar-logo">
          🍽️ MealMate
        </Link>
        <div className="navbar-links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`navbar-link ${
                pathname === link.href ? "active" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="navbar-right">
        <span className="navbar-email">{user.email}</span>
        <button className="navbar-link logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
