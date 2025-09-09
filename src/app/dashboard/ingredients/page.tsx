// src/app/dashboard/ingredients/page.tsx
"use client";

// Ingredients Dashboard Page
// --------------------------
// Shows a list of ingredients with search and actions
// Relies on DashboardLayout to provide NavBar and theme

import { useState, useEffect } from "react";
import IngredientsForm, { IngredientData } from "@/components/IngredientsForm";
import SearchBar from "@/components/SearchBar";

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<IngredientData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingIngredient, setEditingIngredient] =
    useState<IngredientData | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch ingredients based on search query
  const fetchIngredients = async (query: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/ingredients?search=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setIngredients(data.ingredients || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load ingredients.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchIngredients(query);
  };

  const handleSave = () => {
    setEditingIngredient(null);
    fetchIngredients(searchQuery);
  };

  const handleDelete = async (_id?: string) => {
    if (!_id) return;
    if (!confirm("Are you sure you want to delete this ingredient?")) return;

    try {
      const res = await fetch(`/api/ingredients/${_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        alert(`Error deleting ingredient: ${data.message || "Unknown error"}`);
      } else {
        fetchIngredients(searchQuery);
        alert("Ingredient deleted successfully");
      }
    } catch (err) {
      alert(`Network error: ${err}`);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Ingredients Dashboard</h1>

      <SearchBar onSearch={handleSearch} />

      {!editingIngredient && (
        <button
          onClick={() =>
            setEditingIngredient({ name: "", unit: "", defaultQuantity: 1 })
          }
        >
          Create New Ingredient
        </button>
      )}

      {editingIngredient && (
        <IngredientsForm initialData={editingIngredient} onSave={handleSave} />
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading ingredients...</p>}
      {!loading && ingredients.length === 0 && searchQuery.trim() && (
        <p>No ingredients found.</p>
      )}

      <ul>
        {ingredients.map((ing) => (
          <li key={ing._id}>
            {ing.name} ({ing.defaultQuantity} {ing.unit})
            <button onClick={() => setEditingIngredient(ing)}>Edit</button>
            <button onClick={() => handleDelete(ing._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
