// ===========================================
// PATH: src/app/shopping-list/page.tsx
// ===========================================
"use client";

import React from "react";
import ShoppingListComponent from "@/components/ShoppingListComponent";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function ShoppingListPage() {
  // -----------------------------
  // Auth guard
  // -----------------------------
  const { user, loading: authLoading } = useRequireAuth();
  if (authLoading) return <p>Loading shopping list...</p>;
  if (!user) return null; // redirect handled by hook

  // -----------------------------
  // Render page
  // -----------------------------
  return (
    <div className="max-w-lg mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">My Shopping List</h1>
      <ShoppingListComponent /> {/* Handles own state or uses context */}
    </div>
  );
}
