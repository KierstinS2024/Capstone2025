// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect client-side if user is already logged in (prevents flash on client navigation)
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  // While we detect session, don't render landing content (prevents brief flash)
  if (loading) return null;

  return (
    <main className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>MealMate</h1>
        <p className={styles.subtitle}>
          Plan your meals. Simplify your shopping. Feel effortlessly organized
          every day.
        </p>

        <div className={styles.cta}>
          <Link href="/signup" className={styles.buttonPrimary}>
            Get Started
          </Link>
          <Link href="/login" className={styles.buttonSecondary}>
            Log In
          </Link>
        </div>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <h3>📅 Daily Meal Planner</h3>
            <p>
              See breakfast, lunch, and dinner at a glance. Drag, drop, and
              schedule with ease.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3>🛒 Smart Shopping List</h3>
            <p>
              Automatically generate your shopping list from planned meals.
              Check items as you go.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3>🥘 Recipe Library</h3>
            <p>
              Save your favorite recipes or discover new ones, all in one
              organized place.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
