// ===========================================
// PATH: src/app/shopping-list/page.tsx
// ===========================================
// Shopping List Page
// -----------------------------
// - Displays the current user's shopping list
// - Uses ShoppingListPanel to show and manage items
// - Includes auth guard to ensure user is logged in
// - Fully functional with optimistic UI updates
// ===========================================

"use client";

import React from "react";
import ShoppingListPanel from "@/components/ShoppingListPanel";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function ShoppingListPage() {
  // -----------------------------
  // Auth guard
  // -----------------------------
  // useRequireAuth hook should redirect or handle unauthenticated users
  const { user, loading: authLoading } = useRequireAuth();

  // Show loading while auth state is being determined
  if (authLoading) return <p>Loading shopping list...</p>;

  // If no user, don't render anything (redirect handled in hook)
  if (!user) return null;

  // -----------------------------
  // Render the Shopping List Panel
  // -----------------------------
  return (
    <main style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <ShoppingListPanel />
    </main>
  );
}
