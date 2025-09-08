// src/app/dashboard/QuickLinks.tsx
"use client";

/**
 * QuickLinks
 * Displays shortcut buttons for common dashboard actions.
 * Each button navigates to a specific page (e.g., new recipe, meal plan, etc.).
 */

import Link from "next/link";
import Button from "@/components/Button";

// Type for each quick link
interface QuickLink {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
}

// Dashboard shortcuts
const quickLinks: QuickLink[] = [
  { label: "New Recipe", href: "/dashboard/recipes/new", variant: "primary" },
  {
    label: "New Meal Plan",
    href: "/dashboard/meal-plans/new",
    variant: "primary",
  },
  {
    label: "Add Food Intake",
    href: "/dashboard/food-intake/new",
    variant: "secondary",
  },
  {
    label: "New Shopping List",
    href: "/dashboard/shopping-lists/new",
    variant: "secondary",
  },
];

export default function QuickLinks() {
  return (
    <section className="quick-links">
      <h2 className="quick-links__title">Quick Actions</h2>
      <div className="quick-links__grid">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Button variant={link.variant}>{link.label}</Button>
          </Link>
        ))}
      </div>
    </section>
  );
}
