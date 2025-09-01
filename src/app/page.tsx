// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold">Welcome to Capstone 2025</h1>
      <p className="text-lg text-center max-w-xl">
        Manage your meals, recipes, and shopping lists all in one place.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/recipes"
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          View Recipes
        </Link>
        <Link
          href="/meal-plans"
          className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          Meal Plans
        </Link>
        <Link
          href="/shopping-lists"
          className="px-6 py-3 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
        >
          Shopping Lists
        </Link>
      </div>
    </div>
  );
}
