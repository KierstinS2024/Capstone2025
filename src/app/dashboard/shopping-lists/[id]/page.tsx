// path: src/app/dashboard/shopping-lists/[id]/page.tsx
/**
 * ShoppingListDetailPage
 *
 * Displays all items for a specific shopping list.
 * Supports CRUD for items: add, update, mark purchased, delete.
 */

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ShoppingListItemRow from "@/components/ShoppingListItemRow";
import { useAuth } from "@/hooks/useAuth";

interface ShoppingListItem {
  _id: string;
  ingredientId: string;
  name: string; // Ingredient display name
  quantity: number;
  unit: string;
  purchased: boolean;
}

interface ShoppingList {
  _id: string;
  title: string;
  createdAt: string;
  items: ShoppingListItem[];
}

const ShoppingListDetailPage: React.FC = () => {
  const { id: listId } = useParams();
  const { token } = useAuth();
  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState<number>(1);
  const [newItemUnit, setNewItemUnit] = useState<string>("");

  // Fetch shopping list by ID
  useEffect(() => {
    if (!token || !listId) return;

    const fetchList = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/shopping-lists/${listId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setList(data.list);
      } catch (error) {
        console.error("Failed to fetch shopping list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [token, listId]);

  // Update item
  const handleUpdateItem = async (
    itemId: string,
    quantity: number,
    unit: string,
    purchased: boolean
  ) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/shopping-lists/items/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity, unit, purchased }),
      });
      const data = await res.json();
      if (data.item && list) {
        setList({
          ...list,
          items: list.items.map((item) =>
            item._id === itemId ? data.item : item
          ),
        });
      }
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/shopping-lists/items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok && list) {
        setList({
          ...list,
          items: list.items.filter((item) => item._id !== itemId),
        });
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  // Add new item manually
  const handleAddItem = async () => {
    if (!token || !newItemName.trim() || !list) return;

    try {
      const res = await fetch(`/api/shopping-lists/${list._id}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newItemName.trim(),
          quantity: newItemQty,
          unit: newItemUnit,
        }),
      });
      const data = await res.json();
      if (data.item) {
        setList({ ...list, items: [...list.items, data.item] });
        setNewItemName("");
        setNewItemQty(1);
        setNewItemUnit("");
      }
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  if (loading) return <p>Loading shopping list...</p>;
  if (!list) return <p>Shopping list not found.</p>;

  return (
    <div>
      <h1>{list.title}</h1>
      <p>Created: {new Date(list.createdAt).toLocaleDateString()}</p>

      <div style={{ marginTop: "1rem" }}>
        {list.items.map((item) => (
          <ShoppingListItemRow
            key={item._id}
            item={item}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItem}
          />
        ))}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2>Add New Item</h2>
        <input
          type="text"
          placeholder="Ingredient name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItemQty}
          onChange={(e) => setNewItemQty(Number(e.target.value))}
          style={{ width: "4rem" }}
        />
        <input
          type="text"
          placeholder="Unit"
          value={newItemUnit}
          onChange={(e) => setNewItemUnit(e.target.value)}
          style={{ width: "5rem" }}
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>
    </div>
  );
};

export default ShoppingListDetailPage;
