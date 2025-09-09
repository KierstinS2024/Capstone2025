// path: src/components/RecipeForm.tsx
"use client";

import { useState } from "react";
import styles from "./RecipeForm.module.css";

interface Ingredient {
  ingredientId: string; // required for internal recipes
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  _id?: string; // present for internal recipes being edited
  name: string;
  description: string;
  cuisine: string;
  ingredients: Ingredient[];
  instructions: string[];
  source: "user" | "spoonacular";
}

// Props for the RecipeForm
interface RecipeFormProps {
  initialData: Recipe;
  onSave: () => void; // callback to refresh list or close form
}

export default function RecipeForm({ initialData, onSave }: RecipeFormProps) {
  const [recipe, setRecipe] = useState<Recipe>({ ...initialData });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ------------------- Handlers -------------------
  const handleChange = (field: keyof Recipe, value: any) => {
    setRecipe((prev) => ({ ...prev, [field]: value }));
  };

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: any
  ) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    setRecipe((prev) => ({ ...prev, ingredients: updatedIngredients }));
  };

  const addIngredient = () => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { ingredientId: "", name: "", quantity: 1, unit: "" },
      ],
    }));
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients.splice(index, 1);
    setRecipe((prev) => ({ ...prev, ingredients: updatedIngredients }));
  };

  const handleInstructionChange = (index: number, value: string) => {
    const updatedInstructions = [...recipe.instructions];
    updatedInstructions[index] = value;
    setRecipe((prev) => ({ ...prev, instructions: updatedInstructions }));
  };

  const addInstruction = () => {
    setRecipe((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }));
  };

  const removeInstruction = (index: number) => {
    const updatedInstructions = [...recipe.instructions];
    updatedInstructions.splice(index, 1);
    setRecipe((prev) => ({ ...prev, instructions: updatedInstructions }));
  };

  // ------------------- Submit -------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("No authentication token found.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const method = recipe._id ? "PUT" : "POST";
      const url = recipe._id ? `/api/recipes/${recipe._id}` : "/api/recipes";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: recipe.name,
          description: recipe.description,
          cuisine: recipe.cuisine,
          ingredients: recipe.ingredients.map((ing) => ({
            ...ing,
            quantity: Number(ing.quantity),
          })),
          instructions: recipe.instructions,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save recipe");

      alert(`Recipe ${recipe._id ? "updated" : "created"} successfully`);
      onSave(); // close form and refresh list
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save recipe");
    } finally {
      setLoading(false);
    }
  };

  // ------------------- Render -------------------
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>{recipe._id ? "Edit Recipe" : "New Recipe"}</h2>
      {error && <p className={styles.error}>{error}</p>}

      <label>
        Name:
        <input
          type="text"
          value={recipe.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </label>

      <label>
        Description:
        <textarea
          value={recipe.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </label>

      <label>
        Cuisine:
        <input
          type="text"
          value={recipe.cuisine}
          onChange={(e) => handleChange("cuisine", e.target.value)}
        />
      </label>

      {/* Ingredients */}
      <h3>Ingredients</h3>
      {recipe.ingredients.map((ing, idx) => (
        <div key={idx} className={styles.ingredientRow}>
          <input
            type="text"
            placeholder="Name"
            value={ing.name}
            onChange={(e) =>
              handleIngredientChange(idx, "name", e.target.value)
            }
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={ing.quantity}
            onChange={(e) =>
              handleIngredientChange(idx, "quantity", e.target.value)
            }
            required
          />
          <input
            type="text"
            placeholder="Unit"
            value={ing.unit}
            onChange={(e) =>
              handleIngredientChange(idx, "unit", e.target.value)
            }
          />
          <button type="button" onClick={() => removeIngredient(idx)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addIngredient}>
        Add Ingredient
      </button>

      {/* Instructions */}
      <h3>Instructions</h3>
      {recipe.instructions.map((step, idx) => (
        <div key={idx} className={styles.instructionRow}>
          <textarea
            value={step}
            onChange={(e) => handleInstructionChange(idx, e.target.value)}
            required
          />
          <button type="button" onClick={() => removeInstruction(idx)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addInstruction}>
        Add Step
      </button>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : recipe._id ? "Update Recipe" : "Create Recipe"}
      </button>
    </form>
  );
}
