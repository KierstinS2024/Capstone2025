// path: src/app/shopping-list/from-meal-plan/page.tsx
"use client";

import React, { useState } from "react";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useMealPlan } from "@/context/MealPlanContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "@/styles/shoppingList.css";

export default function ShoppingListPage() {
  const {
    shoppingList,
    addItem,
    toggleItem,
    removeItem,
    refreshList,
    loading,
  } = useShoppingList();
  const { mealPlans } = useMealPlan();
  const { user } = useAuth();
  const router = useRouter();

  const [newItemName, setNewItemName] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!user && !loading) router.push("/login");
  }, [user, loading, router]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    await addItem(newItemName.trim(), "other"); // category ignored for now
    setNewItemName("");
  };

  const handleGenerateFromMealPlans = async () => {
    setGenerating(true);
    try {
      for (const plan of mealPlans) {
        for (const meal of plan.meals) {
          await addItem(meal.name, "other");
        }
      }
      await refreshList();
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <p className="loading">Loading shopping list...</p>;
  if (!user) return null;

  return (
    <div className="shopping-list-page">
      <h1 className="page-title">Shopping List</h1>

      {/* Generate Button */}
      <button
        onClick={handleGenerateFromMealPlans}
        className="button generate-button"
        disabled={generating}
      >
        {generating ? "Generating..." : "Generate from Meal Plans"}
      </button>

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

      {/* Shopping List */}
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
