// Path: src/app/dashboard/shopping-lists/new/page.tsx
"use client";

/**
 * NewShoppingListPage
 * ------------------
 * Page to create a new shopping list.
 * Features:
 * - Protected route
 * - Uses ShoppingListForm
 * - Type-safe with Zod
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import ShoppingListForm from "@/components/ShoppingListForm";
import type { ShoppingListFormSchema } from "@/schemas/shoppingListForm";

export default function NewShoppingListPage() {
  return (
    <ProtectedRoute>
      <NewShoppingListFormWrapper />
    </ProtectedRoute>
  );
}

function NewShoppingListFormWrapper() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: ShoppingListFormSchema) => {
    setLoading(true);
    try {
      const res = await fetch("/api/shopping-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create shopping list");
      }

      router.push("/dashboard/shopping-lists");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return <ShoppingListForm onSubmit={handleSubmit} loading={loading} />;
}
