// path: src/app/shopping-list/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import GenerateShoppingList from "@/components/GenerateShoppingList";
import "@/styles/shoppingList.css";

export default function ShoppingListPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const {
    shoppingList,
    addItem,
    toggleItem,
    removeItem,
    loading,
    refreshList,
  } = useShoppingList();

  const [newItemName, setNewItemName] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  // Refresh shopping list on mount
  useEffect(() => {
    if (user) refreshList();
  }, [user, refreshList]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    await addItem(newItemName.trim(), "other");
    setNewItemName("");
  };

  if (authLoading || loading)
    return <p className="loading">Loading shopping list...</p>;
  if (!user) return null;

  return (
    <div className="shopping-list-page">
      <h1 className="page-title">Shopping List</h1>

      {/* Generate from Meal Plan */}
      <GenerateShoppingList />

      {/* Add Item Form */}
      <form className="add-item-form" onSubmit={handleAddItem}>
        <input
          type="text"
          placeholder="Item name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="input"
          required
        />
        <button type="submit" className="button">
          Add
        </button>
      </form>

      {/* Shopping List Items */}
      {shoppingList.length === 0 ? (
        <p className="empty-state">Your shopping list is empty.</p>
      ) : (
        <ul className="shopping-items">
          {shoppingList.map((item) => (
            <li key={item.id} className="shopping-item">
              <label>
                <input
                  type="checkbox"
                  checked={item.purchased}
                  onChange={() => toggleItem(item.id)}
                />
                <span className={item.purchased ? "purchased" : ""}>
                  {item.name}
                </span>
              </label>
              <button
                className="remove-button"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
