// Path: src/components/AddMealSpoonacular.tsx
"use client";

import React, { useState } from "react";
import { useRecipes } from "@/context/RecipeContext";
import type { MealType } from "@/types/mealPlan";

interface Props {
  mealType: MealType;
  onSelectRecipe: (id: string) => void;
  onClose: () => void;
}

const AddMealSpoonacular: React.FC<Props> = ({
  mealType,
  onSelectRecipe,
  onClose,
}) => {
  const { searchSpoonacular } = useRecipes();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const res = await searchSpoonacular(query);
    setResults(res);
    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 24,
          maxWidth: 600,
          width: "90%",
        }}
      >
        <h2>Add {mealType}</h2>
        <input
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 16 }}
        />
        <button onClick={handleSearch} style={{ marginBottom: 16 }}>
          Search
        </button>

        {loading && <p>Loading...</p>}

        <ul>
          {results.map((r) => (
            <li key={r.id} style={{ marginBottom: 8 }}>
              <button
                onClick={() => {
                  onSelectRecipe(r.id.toString());
                  onClose();
                }}
              >
                {r.title}
              </button>
            </li>
          ))}
        </ul>

        <button onClick={onClose} style={{ marginTop: 12 }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AddMealSpoonacular;
