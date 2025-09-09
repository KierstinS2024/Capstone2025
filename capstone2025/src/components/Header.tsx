// Path: src/components/Header.tsx
"use client";

/**
 * Header
 * ------
 * Responsive header/navigation.
 * - Only visible for authenticated users.
 * - Desktop: horizontal nav
 * - Mobile: hamburger menu
 */

import React from "react";
import { useAuth } from "@/context/AuthContext";
import HamburgerMenu from "./HamburgerMenu";

interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  items: NavItem[];
  logo?: React.ReactNode;
}

export default function Header({ items, logo }: HeaderProps) {
  const { user, loading } = useAuth();

  if (loading || !user) return null; // only render if user is authenticated

  return (
    <header
      style={{
        width: "100%",
        padding: "1rem 2rem",
        backgroundColor: "var(--bg-card)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "var(--shadow-md)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div>
        {logo || <h1 style={{ fontSize: "var(--font-xl)" }}>MealPlanner</h1>}
      </div>

      {/* Desktop Nav */}
      <nav
        style={{
          display: "none",
        }}
      >
        <ul
          style={{
            display: "flex",
            gap: "2rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                style={{
                  textDecoration: "none",
                  color: "var(--text-primary)",
                  fontWeight: 500,
                  fontSize: "var(--font-md)",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--accent-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-primary)")
                }
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Nav */}
      <div className="mobile-nav">
        <HamburgerMenu items={items} />
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          nav {
            display: block;
          }
          .mobile-nav {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
