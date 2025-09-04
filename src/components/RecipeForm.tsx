// path: src/components/RecipeForm.tsx
"use client";

/**
 * RecipeForm Component
 * --------------------
 * Reusable form for creating or editing a user-submitted recipe.
 * Handles:
 * - Recipe title & description
 * - Dynamic list of ingredients (name, quantity, unit)
 * - Step-by-step instructions
 * - Cuisine selection
 * 
 * Accepts optional `initialData` for editing.
 * Uses AuthContext to include JWT in API requests.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  ingredientId?: string; // optional, for external ingredients
}

interface RecipeFormProps {
  initialData?: {
    _id?: string;
    name: string;
    description: string;
    ingredients: Ingredient[];
    instructions: string[];
    cuisine: string;
  };
  onSave?: () => void; // optional callback after save
}

export default function RecipeForm({ initialData, onSave }: RecipeFormProps) {
  const { token } = useAuth();
  const router = useRouter();

  // --- Form state ---
  const [recipeTitle, setRecipeTitle] = useState(initialData?.name || "");
  const [recipeDescription, setRecipeDescription] = useState(
    initialData?.description || ""
  );
  const [recipeIngredients, setRecipeIngredients] = useState<Ingredient[]>(
    initialData?.ingredients || [{ name: "", quantity: "", unit: "" }]
  );
  const [recipeInstructions, setRecipeInstructions] = useState<string[]>(
    initialData?.instructions || [""]
  );
  const [recipeCuisine, setRecipeCuisine] = useState(
    initialData?.cuisine || ""
  );
  const [isSaving, setIsSaving] = useState(false);

  // --- Ingredient handlers ---
  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    const updated = [...recipeIngredients];
    updated[index][field] = value;
    setRecipeIngredients(updated);
  };

  const addIngredient = () => {
    setRecipeIngredients([
      ...recipeIngredients,
      { name: "", quantity: "", unit: "" },
    ]);
  };

  const removeIngredient = (index: number) => {
    const updated = [...recipeIngredients];
    updated.splice(index, 1);
    setRecipeIngredients(updated);
  };

  // --- Instruction handlers ---
  const handleInstructionChange = (index: number, value: string) => {
    const updated = [...recipeInstructions];
    updated[index] = value;
    setRecipeInstructions(updated);
  };

  const addInstruction = () => {
    setRecipeInstructions([...recipeInstructions, ""]);
  };

  const removeInstruction = (index: number) => {
    const updated = [...recipeInstructions];
    updated.splice(index, 1);
    setRecipeInstructions(updated);
  };

  // --- Form submission ---
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // --- Basic validation ---
    if (!recipeTitle.trim()) return alert("Title is required");
    if (!recipeDescription.trim()) return alert("Description is required");
    if (!recipeIngredients.every((ing) => ing.name && ing.quantity && ing.unit))
      return alert("All ingredient fields are required");
    if (!recipeInstructions.every((step) => step.trim()))
      return alert("All instruction steps are required");
    if (!token) return alert("❌ You must be logged in to save a recipe");

    setIsSaving(true);

    // --- Map ingredients for backend with guaranteed ingredientId ---
    const mappedIngredients = recipeIngredients.map((ing, index) => ({
      ingredientId: ing.ingredientId || `user-${index}`, // always defined
      name: ing.name,
      quantity: ing.quantity, // string is fine
      unit: ing.unit,
    }));

    try {
      const apiEndpoint = initialData?._id
        ? `/api/recipes/${initialData._id}`
        : "/api/recipes";
      const method = initialData?._id ? "PUT" : "POST";

      const response = await fetch(apiEndpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: recipeTitle,
          description: recipeDescription,
          instructions: recipeInstructions,
          cuisine: recipeCuisine,
          userSubmitted: true,
          ingredients: mappedIngredients,
        }),
      });

      if (response.ok) {
        alert("✅ Recipe saved successfully!");
        onSave?.();
        router.push("/dashboard/recipes");
      } else {
        const data = await response.json();
        alert(`❌ Error saving recipe: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`❌ Network error: ${error}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "600px",
      }}
    >
      {/* Title & Description */}
      <input
        placeholder="Recipe Title"
        value={recipeTitle}
        onChange={(e) => setRecipeTitle(e.target.value)}
      />
      <textarea
        placeholder="Recipe Description"
        value={recipeDescription}
        onChange={(e) => setRecipeDescription(e.target.value)}
      />

      {/* Ingredients */}
      <h3>Ingredients</h3>
      {recipeIngredients.map((ing, idx) => (
        <div key={idx} style={{ display: "flex", gap: "0.5rem" }}>
          <input
            placeholder="Name"
            value={ing.name}
            onChange={(e) =>
              handleIngredientChange(idx, "name", e.target.value)
            }
          />
          <input
            placeholder="Quantity"
            value={ing.quantity}
            onChange={(e) =>
              handleIngredientChange(idx, "quantity", e.target.value)
            }
          />
          <input
            placeholder="Unit"
            value={ing.unit}
            onChange={(e) =>
              handleIngredientChange(idx, "unit", e.target.value)
            }
          />
          {recipeIngredients.length > 1 && (
            <button type="button" onClick={() => removeIngredient(idx)}>
              ❌
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addIngredient}>
        + Add Ingredient
      </button>

      {/* Instructions */}
      <h3>Instructions</h3>
      {recipeInstructions.map((step, idx) => (
        <div key={idx} style={{ display: "flex", gap: "0.5rem" }}>
          <input
            placeholder={`Step ${idx + 1}`}
            value={step}
            onChange={(e) => handleInstructionChange(idx, e.target.value)}
          />
          {recipeInstructions.length > 1 && (
            <button type="button" onClick={() => removeInstruction(idx)}>
              ❌
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addInstruction}>
        + Add Step
      </button>

      {/* Cuisine */}
      <h3>Cuisine</h3>
      <select
        value={recipeCuisine}
        onChange={(e) => setRecipeCuisine(e.target.value)}
      >
        <option value="">--Choose Cuisine--</option>
        <option value="Italian">Italian</option>
        <option value="Mexican">Mexican</option>
        <option value="Indian">Indian</option>
        <option value="American">American</option>
        <option value="Chinese">Chinese</option>
        <option value="Japanese">Japanese</option>
        <option value="Thai">Thai</option>
        <option value="French">French</option>
        <option value="Mediterranean">Mediterranean</option>
        <option value="Spanish">Spanish</option>
        <option value="Korean">Korean</option>
        <option value="Vietnamese">Vietnamese</option>
        <option value="Middle Eastern">Middle Eastern</option>
        <option value="Caribbean">Caribbean</option>
        <option value="African">African</option>
        <option value="German">German</option>
        <option value="British">British</option>
        <option value="Russian">Russian</option>
        <option value="Other">Other</option>
      </select>

      {/* Submit */}
      <button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Recipe"}
      </button>
    </form>
  );
}
