// path: src/app/shopping-list/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import "@/styles/shoppinglist-detail.css";

interface ShoppingListDetailPageProps {
  params: { id: string };
}

export default function ShoppingListDetailPage({
  params,
}: ShoppingListDetailPageProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { shoppingList, toggleItem, removeItem, refreshList, loading } =
    useShoppingList();

  const [listItem, setListItem] = useState<(typeof shoppingList)[0] | null>(
    null
  );

  const itemId = params.id;

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  // Refresh and find specific item
  useEffect(() => {
    if (user) refreshList();
  }, [user, refreshList]);

  useEffect(() => {
    const item = shoppingList.find((i) => i.id === itemId) || null;
    setListItem(item);
  }, [shoppingList, itemId]);

  if (authLoading || loading) return <p className="loading">Loading item...</p>;
  if (!user) return null;
  if (!listItem) return <p className="empty-state">Item not found.</p>;

  return (
    <div className="shoppinglist-detail-page">
      <h1 className="page-title">{listItem.name}</h1>
      <p className="item-category">Category: {listItem.category}</p>
      <p className="item-status">
        Status: {listItem.purchased ? "Purchased ✅" : "Pending ⏳"}
      </p>

      <div className="item-actions">
        <button className="button" onClick={() => toggleItem(listItem.id)}>
          {listItem.purchased ? "Mark as Pending" : "Mark as Purchased"}
        </button>
        <button
          className="button remove-button"
          onClick={() => removeItem(listItem.id)}
        >
          Remove Item
        </button>
      </div>
    </div>
  );
}
