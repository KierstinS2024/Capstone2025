// path: src/components/RecipeForm.tsx
"use client";

/**
 * RecipeForm Component
 * --------------------
 * Reusable form for creating or editing a user-submitted recipe.
 * Includes:
 * - Recipe title
 * - Description
 * - Dynamic list of ingredients (name, quantity, unit)
 * - Step-by-step instructions
 * - Cuisine selection
 *
 * Accepts optional initialData for editing an existing recipe.
 * Automatically handles authentication via the token from AuthContext.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface RecipeFormProps {
  /** Optional recipe data when editing an existing recipe */
  initialData?: {
    _id?: string;
    name: string;
    description: string;
    ingredients: Ingredient[];
    instructions: string[];
    cuisine: string;
  };
  /** Optional callback invoked after successful save */
  onSave?: () => void;
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

  // --- Handlers for dynamic ingredient fields ---
  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    const updatedIngredients = [...recipeIngredients];
    updatedIngredients[index][field] = value;
    setRecipeIngredients(updatedIngredients);
  };

  // --- Handlers for dynamic instruction fields ---
  const handleInstructionChange = (index: number, value: string) => {
    const updatedInstructions = [...recipeInstructions];
    updatedInstructions[index] = value;
    setRecipeInstructions(updatedInstructions);
  };

  // --- Form submission handler ---
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // --- Validation ---
    if (!recipeTitle.trim()) return alert("Title is required");
    if (!recipeDescription.trim()) return alert("Description is required");
    if (!recipeIngredients.every((ing) => ing.name && ing.quantity && ing.unit))
      return alert("All ingredient fields are required");
    if (!recipeInstructions.every((step) => step.trim()))
      return alert("All instruction steps are required");
    if (!token) return alert("❌ You must be logged in to save a recipe");

    setIsSaving(true);

    // --- Map ingredients to API format ---
    const mappedIngredients = recipeIngredients.map((ingredient) => ({
      ingredientId: null, // Placeholder for future Ingredient collection integration
      quantity: Number(ingredient.quantity),
      unit: ingredient.unit,
    }));

    try {
      const apiEndpoint = initialData?._id
        ? `/api/recipes/${initialData._id}`
        : "/api/recipes";
      const httpMethod = initialData?._id ? "PUT" : "POST";

      const response = await fetch(apiEndpoint, {
        method: httpMethod,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: recipeTitle,
          description: recipeDescription,
          ingredients: mappedIngredients,
          instructions: recipeInstructions,
          cuisine: recipeCuisine,
          userSubmitted: true,
        }),
      });

      if (response.ok) {
        alert("✅ Recipe saved successfully!");
        onSave?.(); // Trigger optional callback
        router.push("/dashboard/recipes"); // Redirect to recipe list
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
      {/* Recipe Title */}
      <input
        placeholder="Recipe Title"
        value={recipeTitle}
        onChange={(e) => setRecipeTitle(e.target.value)}
      />

      {/* Recipe Description */}
      <textarea
        placeholder="Recipe Description"
        value={recipeDescription}
        onChange={(e) => setRecipeDescription(e.target.value)}
      />

      {/* Ingredients Section */}
      <h3>Ingredients</h3>
      {recipeIngredients.map((ingredient, index) => (
        <div key={index} style={{ display: "flex", gap: "0.5rem" }}>
          <input
            placeholder="Name"
            value={ingredient.name}
            onChange={(e) =>
              handleIngredientChange(index, "name", e.target.value)
            }
          />
          <input
            placeholder="Quantity"
            value={ingredient.quantity}
            onChange={(e) =>
              handleIngredientChange(index, "quantity", e.target.value)
            }
          />
          <input
            placeholder="Unit"
            value={ingredient.unit}
            onChange={(e) =>
              handleIngredientChange(index, "unit", e.target.value)
            }
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setRecipeIngredients([
            ...recipeIngredients,
            { name: "", quantity: "", unit: "" },
          ])
        }
      >
        + Add Ingredient
      </button>

      {/* Instructions Section */}
      <h3>Instructions</h3>
      {recipeInstructions.map((step, index) => (
        <input
          key={index}
          placeholder={`Step ${index + 1}`}
          value={step}
          onChange={(e) => handleInstructionChange(index, e.target.value)}
        />
      ))}
      <button
        type="button"
        onClick={() => setRecipeInstructions([...recipeInstructions, ""])}
      >
        + Add Step
      </button>

      {/* Cuisine Selection */}
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
      </select>

      {/* Submit Button */}
      <button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Recipe"}
      </button>
    </form>
  );
}
