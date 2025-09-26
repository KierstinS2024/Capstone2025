// ===========================================
// PATH: src/components/AddRecipeForm.tsx
// AddRecipeForm — create new user recipe
// Combines drag-drop UI with parent notification logic
// ===========================================

"use client";

import React, { useState } from "react";
import { useRecipes } from "@/context/RecipeContext";
import { Recipe } from "@/types/recipe";
import styles from "@/styles/addRecipeForm.module.css"; // external CSS module
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface AddRecipeFormProps {
  onClose: () => void; // called when user cancels or after success
  onSuccess?: (newRecipe: Recipe) => void; // notify parent of new recipe
}

export default function AddRecipeForm({
  onClose,
  onSuccess,
}: AddRecipeFormProps) {
  const { addRecipe } = useRecipes();

  // -----------------------------
  // Form state
  // -----------------------------
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]); // multiple ingredients
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // Drag-and-drop reorder logic
  // -----------------------------
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const updated = Array.from(ingredients);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);
    setIngredients(updated);
  };

  // -----------------------------
  // Ingredient field helpers
  // -----------------------------
  const handleIngredientChange = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addIngredientField = () => setIngredients([...ingredients, ""]);

  const removeIngredientField = (index: number) =>
    setIngredients(ingredients.filter((_, i) => i !== index));

  // -----------------------------
  // Submit logic
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const cleanIngredients = ingredients.map((i) => i.trim()).filter(Boolean);

      // Save new recipe to DB
      const newRecipe = await addRecipe({
        title: title.trim(),
        instructions: instructions.trim(),
        ingredients: cleanIngredients,
        image: image.trim(),
      });

      // notify parent + close form
      if (onSuccess) onSuccess(newRecipe);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add recipe");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Render form
  // -----------------------------
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.formHeader}>Add New Recipe</h2>

      {/* Title */}
      <div className={styles.formSection}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          required
          placeholder="Recipe title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Ingredients (drag & drop reorderable list) */}
      <div className={styles.formSection}>
        <label>Ingredients (drag ☰ to reorder)</label>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="ingredients">
            {(provided) => (
              <div
                className={styles.ingredientsContainer}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {ingredients.map((ingredient, index) => (
                  <Draggable
                    key={index.toString()}
                    draggableId={index.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className={styles.ingredientRow}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        {/* Drag handle */}
                        <span
                          className={styles.dragHandle}
                          {...provided.dragHandleProps}
                        >
                          ☰
                        </span>

                        {/* Input */}
                        <input
                          type="text"
                          value={ingredient}
                          onChange={(e) =>
                            handleIngredientChange(index, e.target.value)
                          }
                          placeholder={`Ingredient ${index + 1}`}
                          required={index === 0}
                        />

                        {/* Remove button */}
                        {ingredients.length > 1 && (
                          <button
                            type="button"
                            className={styles.removeIngredientBtn}
                            onClick={() => removeIngredientField(index)}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Add more ingredients */}
        <button
          type="button"
          className={styles.addIngredientBtn}
          onClick={addIngredientField}
        >
          + Add Ingredient
        </button>
      </div>

      {/* Instructions */}
      <div className={styles.formSection}>
        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          placeholder="Step-by-step instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className={styles.autoGrowTextarea}
        />
      </div>

      {/* Image */}
      <div className={styles.formSection}>
        <label htmlFor="image">Image URL</label>
        <input
          id="image"
          placeholder="https://..."
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>

      {/* Error message */}
      {error && <p className={styles.error}>❌ {error}</p>}

      {/* Submit + Cancel buttons */}
      <div className={styles.submitContainer}>
        <button
          type="button"
          onClick={onClose}
          className={styles.cancelBtn}
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? "Saving..." : "Save Recipe"}
        </button>
      </div>
    </form>
  );
}
