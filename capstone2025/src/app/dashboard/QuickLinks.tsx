// src/app/dashboard/QuickLinks.tsx
"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/Button";

// --------------------
// QuickLink Item Type
// --------------------
interface QuickLink {
  label: string;
  href: string;
  variant?: "primary" | "secondary"; // Button variant
}

/**
 * QuickLinks component
 * Displays a set of quick action buttons for the dashboard.
 */
const QuickLinks: React.FC = () => {
  // --------------------
  // Define dashboard quick links
  // --------------------
  const links: QuickLink[] = [
    { label: "Add Recipe", href: "/dashboard/recipes/new", variant: "primary" },
    {
      label: "New Meal Plan",
      href: "/dashboard/meal-plans/new",
      variant: "primary",
    },
    {
      label: "Log Food Intake",
      href: "/dashboard/food-intake/new",
      variant: "secondary",
    },
    {
      label: "Create Shopping List",
      href: "/dashboard/shopping-lists/new",
      variant: "secondary",
    },
  ];

  return (
    <section
      style={{
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        marginTop: "1rem",
      }}
    >
      {links.map((link) => (
        <Link key={link.href} href={link.href} passHref>
          <Button variant={link.variant}>{link.label}</Button>
        </Link>
      ))}
    </section>
  );
};

export default QuickLinks;
