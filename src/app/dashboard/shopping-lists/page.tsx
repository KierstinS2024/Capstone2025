/* src/app/dashboard/shopping-lists/page.tsx */
"use client";

import React, { useEffect, useState } from "react";
import { useShoppingListContext } from "@/context/ShoppingListContext";
import ShoppingListCard from "@/components/ShoppingListCard";
import CreateShoppingListModal from "@/components/CreateShoppingListModal";
import styles from "./ShoppingListsPage.module.css";

export default function ShoppingListsPage() {
  const { shoppingLists, setShoppingLists } = useShoppingListContext();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchShoppingLists() {
      const token = localStorage.getItem("token");
      if (!token) return setLoading(false);

      try {
        const res = await fetch("/api/shopping-lists", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setShoppingLists(
          data.lists.map((l: any) => ({
            id: l._id,
            createdAt: l.createdAt,
            items: l.items || [],
          }))
        );
      } catch (err) {
        console.error("Failed to fetch shopping lists", err);
        setShoppingLists([]);
      } finally {
        setLoading(false);
      }
    }

    fetchShoppingLists();
  }, [setShoppingLists]);

  if (loading)
    return <p className="text-center mt-10">Loading shopping lists...</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Your Shopping Lists</h1>

      <button
        className={styles.newListButton}
        onClick={() => setIsModalOpen(true)}
      >
        + New Shopping List
      </button>

      <CreateShoppingListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {shoppingLists.length > 0 ? (
        <div className={styles.grid}>
          {shoppingLists.map((list) => (
            <ShoppingListCard
              key={list.id}
              id={list.id}
              createdAt={list.createdAt}
              itemsCount={list.items.length}
              purchasedCount={list.items.filter((i) => i.purchased).length}
            />
          ))}
        </div>
      ) : (
        <p className={styles.emptyMessage}>
          No shopping lists yet. Create your first list!
        </p>
      )}
    </main>
  );
}
