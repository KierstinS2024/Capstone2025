// path: src/app/dashboard/recipes/create/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import styles from "./CreateRecipePage.module.css";

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export default function CreateRecipePage() {
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [ingredientName, setIngredientName] = useState("");
  const [ingredientQuantity, setIngredientQuantity] = useState<number>(0);
  const [ingredientUnit, setIngredientUnit] = useState("");

  const [instructionStep, setInstructionStep] = useState("");

  // Add ingredient to list
  const handleAddIngredient = () => {
    if (!ingredientName || !ingredientQuantity || !ingredientUnit) return;
    setIngredients([
      ...ingredients,
      {
        name: ingredientName,
        quantity: ingredientQuantity,
        unit: ingredientUnit,
      },
    ]);
    setIngredientName("");
    setIngredientQuantity(0);
    setIngredientUnit("");
  };

  // Remove ingredient
  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, idx) => idx !== index));
  };

  // Add instruction
  const handleAddInstruction = () => {
    if (!instructionStep) return;
    setInstructions([...instructions, instructionStep]);
    setInstructionStep("");
  };

  // Remove instruction
  const handleRemoveInstruction = (index: number) => {
    setInstructions(instructions.filter((_, idx) => idx !== index));
  };

  // Submit new recipe
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          cuisine,
          ingredients,
          instructions,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create recipe");

      router.push(`/dashboard/recipes/${data.recipe._id}`);
    } catch (err: any) {
      setError(err.message || "Error creating recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <h1 className={styles.title}>Create New Recipe</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Cuisine:
            <input
              type="text"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            />
          </label>

          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          <div className={styles.section}>
            <h2>Ingredients</h2>
            <div className={styles.ingredientInputs}>
              <input
                type="text"
                placeholder="Name"
                value={ingredientName}
                onChange={(e) => setIngredientName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Quantity"
                value={ingredientQuantity}
                onChange={(e) => setIngredientQuantity(Number(e.target.value))}
              />
              <input
                type="text"
                placeholder="Unit"
                value={ingredientUnit}
                onChange={(e) => setIngredientUnit(e.target.value)}
              />
              <button type="button" onClick={handleAddIngredient}>
                Add
              </button>
            </div>
            <ul className={styles.list}>
              {ingredients.map((ing, idx) => (
                <li key={idx}>
                  {ing.name}: {ing.quantity} {ing.unit}
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Instructions</h2>
            <div className={styles.instructionInputs}>
              <input
                type="text"
                placeholder="Instruction step"
                value={instructionStep}
                onChange={(e) => setInstructionStep(e.target.value)}
              />
              <button type="button" onClick={handleAddInstruction}>
                Add
              </button>
            </div>
            <ol className={styles.list}>
              {instructions.map((step, idx) => (
                <li key={idx}>
                  {step}
                  <button
                    type="button"
                    onClick={() => handleRemoveInstruction(idx)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? "Creating..." : "Create Recipe"}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
