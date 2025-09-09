// Path: src/components/HamburgerMenu.tsx
"use client";

import React from "react";

interface MenuItem {
  label: string;
  href: string;
}

interface HamburgerMenuProps {
  items?: MenuItem[]; // optional prop
  isOpen: boolean;
  onClose: () => void;
}

export default function HamburgerMenu({
  items = [], // default to empty array
  isOpen,
  onClose,
}: HamburgerMenuProps) {
  if (!isOpen) return null;

  return (
    <nav
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "250px",
        height: "100vh",
        backgroundColor: "var(--bg-card)",
        boxShadow: "var(--shadow-lg)",
        padding: "1rem",
        zIndex: 1000,
      }}
    >
      <button
        onClick={onClose}
        style={{
          marginBottom: "1rem",
          backgroundColor: "transparent",
          color: "var(--text-primary)",
          fontSize: "1.25rem",
        }}
      >
        ✕ Close
      </button>

      <ul style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              style={{
                textDecoration: "none",
                color: "var(--text-primary)",
                fontWeight: 500,
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
