// Path: src/components/QuickLinks.tsx
"use client";

/**
 * QuickLinks
 * ----------
 * Dashboard shortcuts to key actions: Add Meal, Create Plan, Search Recipes.
 */

import { FC } from "react";
import styles from "./QuickLinks.module.css";

const links = [
  { label: "Add Meal", href: "/dashboard/food-intake/new" },
  { label: "Create Meal Plan", href: "/dashboard/meal-plans/new" },
  { label: "Search Recipes", href: "/dashboard/recipes" },
  { label: "Generate Shopping List", href: "/dashboard/shopping-lists/new" },
];

const QuickLinks: FC = () => {
  return (
    <div className={styles.container}>
      {links.map((link) => (
        <a key={link.href} href={link.href} className={styles.link}>
          {link.label}
        </a>
      ))}
    </div>
  );
};

export default QuickLinks;
