"use client";

import React, { useState } from "react";
import { useRecipes } from "@/context/RecipeContext";
import styles from "@/styles/addRecipeForm.module.css";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

export default function AddRecipeForm() {
  const { addRecipe } = useRecipes();

  // -----------------------------
  // Form state
  // -----------------------------
  const [recipeTitle, setRecipeTitle] = useState("");
  const [ingredientsList, setIngredientsList] = useState<string[]>([""]);
  const [instructionsText, setInstructionsText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // -----------------------------
  // Drag-and-drop reorder
  // -----------------------------
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(ingredientsList);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setIngredientsList(reordered);
  };

  // -----------------------------
  // Input helpers
  // -----------------------------
  const handleIngredientChange = (index: number, value: string) => {
    const updated = [...ingredientsList];
    updated[index] = value;
    setIngredientsList(updated);
  };

  const addIngredientField = () => setIngredientsList([...ingredientsList, ""]);

  const removeIngredientField = (index: number) => {
    if (ingredientsList.length === 1) return;
    setIngredientsList(ingredientsList.filter((_, i) => i !== index));
  };

  // -----------------------------
  // Submit
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");
    setFormSuccess(false);

    if (!recipeTitle.trim() || !ingredientsList.some((i) => i.trim())) {
      setFormError("Title and at least one ingredient are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      await addRecipe({
        title: recipeTitle.trim(),
        ingredients: ingredientsList.filter((i) => i.trim() !== ""),
        instructions: instructionsText.trim(),
        source: "user",
        author: localStorage.getItem("userEmail") || "",
      });

      setRecipeTitle("");
      setIngredientsList([""]);
      setInstructionsText("");
      setFormSuccess(true);
    } catch (err) {
      console.error(err);
      setFormError("Failed to create recipe.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.formHeader}>Create Your Recipe</h2>

      {/* Title */}
      <div className={styles.formSection}>
        <label htmlFor="recipe-title">Title</label>
        <input
          id="recipe-title"
          type="text"
          value={recipeTitle}
          onChange={(e) => setRecipeTitle(e.target.value)}
          placeholder="Recipe title"
          required
        />
      </div>

      {/* Ingredients */}
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
                {ingredientsList.map((ingredient, index) => (
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
                        {ingredientsList.length > 1 && (
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
        <label htmlFor="recipe-instructions">Instructions</label>
        <textarea
          id="recipe-instructions"
          value={instructionsText}
          onChange={(e) => setInstructionsText(e.target.value)}
          placeholder="Step-by-step instructions"
          className={styles.autoGrowTextarea}
        />
      </div>

      {/* Feedback */}
      {formSuccess && <p className={styles.success}>✅ Recipe created!</p>}
      {formError && <p className={styles.error}>❌ {formError}</p>}

      {/* Submit */}
      <div className={styles.submitContainer}>
        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitBtn}
        >
          {isSubmitting ? "Saving..." : "Save Recipe"}
        </button>
      </div>
    </form>
  );
}
