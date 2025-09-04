// path: src/components/NavBar.tsx
/**
 * NavBar.tsx
 * ----------
 * Persistent navigation bar for logged-in users.
 * Links to Dashboard, Recipes, Meal Plans, Shopping Lists, Food Intake
 * Includes Logout button to clear token and redirect to login.
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link href="/dashboard" style={{ marginRight: "15px" }}>
        Dashboard
      </Link>
      <Link href="/dashboard/recipes" style={{ marginRight: "15px" }}>
        Recipes
      </Link>
      <Link href="/meal-plans" style={{ marginRight: "15px" }}>
        Meal Plans
      </Link>
      <Link href="/shopping-lists" style={{ marginRight: "15px" }}>
        Shopping Lists
      </Link>
      <Link href="/food-intake" style={{ marginRight: "15px" }}>
        Food Intake
      </Link>
      <button onClick={handleLogout} style={{ marginLeft: "20px" }}>
        Logout
      </button>
    </nav>
  );
}
