// NavBar.tsx
/**
 * NavBar.tsx
 * -----------
 * Global navigation for authenticated users.
 * Shows links to main modules and a Logout button.
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/dashboard">Capstone2025</Link>
      </div>
      <ul className={styles.links}>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/dashboard/recipes">Recipes</Link>
        </li>
        <li>
          <Link href="/meal-plans">Meal Plans</Link>
        </li>
        <li>
          <Link href="/shopping-lists">Shopping Lists</Link>
        </li>
        <li>
          <Link href="/food-intake">Food Intake</Link>
        </li>
      </ul>
      <button onClick={handleLogout} className={styles.logout}>
        Logout
      </button>
    </nav>
  );
}
