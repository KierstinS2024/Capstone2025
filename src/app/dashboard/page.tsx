"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold mb-4">Welcome, {user.email}</h2>
      <p className="text-gray-600 mb-6">What would you like to do today?</p>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Link
          href="/meal-plans"
          className="p-6 border rounded-lg shadow hover:bg-gray-50"
        >
          Manage Meal Plans
        </Link>
        <Link
          href="/recipes"
          className="p-6 border rounded-lg shadow hover:bg-gray-50"
        >
          Discover Recipes
        </Link>
        <Link
          href="/shopping-list"
          className="p-6 border rounded-lg shadow hover:bg-gray-50"
        >
          View Shopping List
        </Link>
      </div>
    </div>
  );
}
