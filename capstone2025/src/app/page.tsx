// File: src/app/page.tsx
"use client";

/**
 * Landing Page
 * ------------
 * Public-facing page with hero section, features, and footer.
 */

import Link from "next/link";
import Button from "@/components/Button";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  return (
    <main className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.title}>Eat Better, Live Better</h1>
        <p className={styles.subtitle}>
          Plan meals, track nutrition, and build healthy habits with ease.
        </p>
        <div className={styles.actions}>
          <Link href="/auth/signup">
            <Button variant="primary">Get Started</Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="secondary">Log In</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>Why You'll Love This App</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.card}>
            <h3>Meal Planner</h3>
            <p>Plan your weekly meals effortlessly with drag-and-drop ease.</p>
          </div>
          <div className={styles.card}>
            <h3>Nutrition Tracker</h3>
            <p>
              Log your meals and track calories, macros, and nutrition goals.
            </p>
          </div>
          <div className={styles.card}>
            <h3>Shopping List</h3>
            <p>Generate grocery lists directly from your meal plans.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          &copy; {new Date().getFullYear()} My Meal App. All rights reserved.
        </p>
        <p>
          <Link href="/about">About</Link> |{" "}
          <Link href="/contact">Contact</Link>
        </p>
      </footer>
    </main>
  );
}
