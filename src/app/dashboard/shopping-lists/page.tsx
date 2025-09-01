// path: src/app/dashboard/shopping-lists/page.tsx
/**
 * ShoppingListsPage
 *
 * Main page displaying all shopping lists for the logged-in user.
 * Uses ShoppingListCard to show each list and link to detail page.
 */

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ShoppingListCard from "@/components/ShoppingListCard";

interface ShoppingList {
  _id: string;
  title: string;
  createdAt: string;
  items: any[];
}

const ShoppingListsPage: React.FC = () => {
  const { token } = useAuth();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchLists = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/shopping-lists", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setLists(data.lists || []);
      } catch (error) {
        console.error("Failed to fetch shopping lists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [token]);

  if (loading) return <p>Loading your shopping lists...</p>;

  if (lists.length === 0) return <p>You have no shopping lists yet.</p>;

  return (
    <div>
      <h1>Your Shopping Lists</h1>
      <div style={{ marginTop: "1rem" }}>
        {lists.map((list) => (
          <ShoppingListCard
            key={list._id}
            list={{ ...list, itemsCount: list.items.length }}
          />
        ))}
      </div>
    </div>
  );
};

export default ShoppingListsPage;
