// path: src/app/dashboard/recipes/[id]/edit/page.tsx
"use client";

/**
 * EditRecipePage
 * --------------
 * Allows a user to edit an existing recipe.
 * Fetches recipe by ID, populates the form, and allows updates.
 * Sends PUT request to /api/recipes/:id with JWT authentication.
 */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditRecipePage() {
  const { id: recipeId } = useParams(); // Dynamic recipe ID from URL
  const router = useRouter();

  // Recipe form state
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "" },
  ]);
  const [instructions, setInstructions] = useState([""]);
  const [cuisine, setCuisine] = useState("");

  // Loading / error state
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch recipe data when page loads
  useEffect(() => {
    if (!recipeId) return;

    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${recipeId}`);
        const data = await res.json();

        if (!res.ok) {
          setErrorMessage(data.message || "Failed to fetch recipe");
          setLoading(false);
          return;
        }

        // Populate form with fetched recipe
        const recipe = data.recipe;
        setTitle(recipe.name || "");
        setCuisine(recipe.cuisine || "");
        setInstructions(recipe.instructions || [""]);

        // Map ingredient objects to form-friendly format
        if (recipe.ingredients && recipe.ingredients.length > 0) {
          const mappedIngredients = recipe.ingredients.map((ing: any) => ({
            name: ing.name || "", // fallback in case no name field
            quantity: ing.quantity?.toString() || "",
            unit: ing.unit || "",
          }));
          setIngredients(mappedIngredients);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setErrorMessage("Error fetching recipe");
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  // Update a single ingredient field
  const handleIngredientChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field as keyof (typeof updatedIngredients)[0]] =
      value;
    setIngredients(updatedIngredients);
  };

  // Update a single instruction step
  const handleInstructionChange = (index: number, value: string) => {
    const updatedInstructions = [...instructions];
    updatedInstructions[index] = value;
    setInstructions(updatedInstructions);
  };

  // Submit updated recipe
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!title || ingredients.length === 0 || instructions.length === 0) {
      setErrorMessage("Title, ingredients, and instructions are required");
      return;
    }

    const token = localStorage.getItem("token"); // JWT from login
    if (!token) {
      setErrorMessage("You must be logged in to edit a recipe");
      return;
    }

    try {
      const res = await fetch(`/api/recipes/${recipeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: title,
          cuisine,
          instructions,
          ingredients,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "Error updating recipe");
        return;
      }

      alert("✅ Recipe updated!");
      router.push(`/dashboard/recipes/${recipeId}`); // Redirect to view page
    } catch (err) {
      console.error("Error updating recipe:", err);
      setErrorMessage("Error updating recipe");
    }
  };

  if (loading) return <p>Loading recipe...</p>;
  if (errorMessage) return <p style={{ color: "red" }}>{errorMessage}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Recipe</h1>

      {/* Recipe Title */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Recipe Title"
      />

      {/* Ingredients Section */}
      <h3>Ingredients</h3>
      {ingredients.map((ing, index) => (
        <div key={index}>
          <input
            placeholder="Ingredient name"
            value={ing.name}
            onChange={(e) =>
              handleIngredientChange(index, "name", e.target.value)
            }
          />
          <input
            placeholder="Quantity"
            value={ing.quantity}
            onChange={(e) =>
              handleIngredientChange(index, "quantity", e.target.value)
            }
          />
          <input
            placeholder="Unit (e.g., cups)"
            value={ing.unit}
            onChange={(e) =>
              handleIngredientChange(index, "unit", e.target.value)
            }
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setIngredients([...ingredients, { name: "", quantity: "", unit: "" }])
        }
      >
        + Add Ingredient
      </button>

      {/* Instructions Section */}
      <h3>Instructions</h3>
      {instructions.map((step, index) => (
        <input
          key={index}
          placeholder={`Step ${index + 1}`}
          value={step}
          onChange={(e) => handleInstructionChange(index, e.target.value)}
        />
      ))}
      <button
        type="button"
        onClick={() => setInstructions([...instructions, ""])}
      >
        + Add Step
      </button>

      {/* Cuisine Dropdown */}
      <h3>Cuisine</h3>
      <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
        <option value="">--Choose Cuisine--</option>
        <option value="Italian">Italian</option>
        <option value="Mexican">Mexican</option>
        <option value="Indian">Indian</option>
        <option value="American">American</option>
      </select>

      {/* Submit */}
      <button type="submit">Save Changes</button>
    </form>
  );
}
