/* src/components/CreateShoppingListModal.tsx */
"use client";

import React, { useState } from "react";
import {
  useShoppingListContext,
  ShoppingList,
} from "@/context/ShoppingListContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateShoppingListModal({ isOpen, onClose }: Props) {
  const { addShoppingList } = useShoppingListContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch("/api/shopping-lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: [] }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to create shopping list");

      // Add the new list to context
      const newList: ShoppingList = {
        id: data.list._id,
        createdAt: data.list.createdAt,
        items: data.list.items || [],
      };
      addShoppingList(newList);
      onClose();
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2 style={{ marginBottom: "1rem", fontSize: "1.25rem" }}>
          New Shopping List
        </h2>
        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}
        >
          <button onClick={onClose} style={{ padding: "0.5rem 1rem" }}>
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            style={{
              padding: "0.5rem 1rem",
              background: "#2563eb",
              color: "#fff",
              borderRadius: "6px",
            }}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
