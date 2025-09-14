"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <h1 className="text-5xl font-bold mb-6">Welcome to MealMate</h1>
      <p className="text-lg mb-8 text-gray-600">
        Plan your meals, discover recipes, and manage your shopping list.
      </p>
      {user ? (
        <Link
          href="/dashboard"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md"
        >
          Go to Dashboard
        </Link>
      ) : (
        <div className="flex gap-4">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-gray-200 px-6 py-3 rounded-lg shadow-md"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
