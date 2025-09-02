// path: src/components/RecipeForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./RecipeForm.module.css";

interface Ingredient {
  name: string;
  quantity: string;
}

interface RecipeFormProps {
  recipe?: {
    _id?: string;
    name: string;
    description: string;
    cuisine?: string;
    instructions?: string[];
    ingredients?: Ingredient[];
  };
  mode: "create" | "edit";
}

export default function RecipeForm({ recipe, mode }: RecipeFormProps) {
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [name, setName] = useState(recipe?.name || "");
  const [description, setDescription] = useState(recipe?.description || "");
  const [cuisine, setCuisine] = useState(recipe?.cuisine || "");
  const [instructions, setInstructions] = useState<string[]>(
    recipe?.instructions || [""]
  );
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    recipe?.ingredients || [{ name: "", quantity: "" }]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("You must be logged in to submit recipes.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url =
        mode === "create" ? "/api/recipes" : `/api/recipes/${recipe?._id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          cuisine,
          instructions: instructions.filter((i) => i.trim() !== ""),
          ingredients: ingredients.filter(
            (ing) => ing.name.trim() !== "" && ing.quantity.trim() !== ""
          ),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save recipe");

      router.push(
        mode === "create"
          ? `/dashboard/recipes/${data.recipe._id}`
          : `/dashboard/recipes/${recipe?._id}`
      );
    } catch (err: any) {
      setError(err.message || "Error saving recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}

      <label className={styles.label}>
        Name
        <input
          type="text"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className={styles.label}>
        Description
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>

      <label className={styles.label}>
        Cuisine
        <input
          type="text"
          className={styles.input}
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
        />
      </label>

      <div className={styles.section}>
        <h3>Ingredients</h3>
        {ingredients.map((ing, idx) => (
          <div key={idx} className={styles.row}>
            <input
              type="text"
              placeholder="Quantity"
              className={styles.inputSmall}
              value={ing.quantity}
              onChange={(e) =>
                handleIngredientChange(idx, "quantity", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Ingredient"
              className={styles.input}
              value={ing.name}
              onChange={(e) =>
                handleIngredientChange(idx, "name", e.target.value)
              }
            />
          </div>
        ))}
        <button type="button" onClick={addIngredient} className={styles.addBtn}>
          + Add Ingredient
        </button>
      </div>

      <div className={styles.section}>
        <h3>Instructions</h3>
        {instructions.map((step, idx) => (
          <div key={idx} className={styles.row}>
            <textarea
              placeholder={`Step ${idx + 1}`}
              className={styles.textarea}
              value={step}
              onChange={(e) => handleInstructionChange(idx, e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addInstruction}
          className={styles.addBtn}
        >
          + Add Step
        </button>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading
          ? "Saving..."
          : mode === "create"
          ? "Create Recipe"
          : "Update Recipe"}
      </button>
    </form>
  );
}
