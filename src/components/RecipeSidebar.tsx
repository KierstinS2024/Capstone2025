// ===========================================
// PATH: src/components/RecipeSidebar.tsx
// RecipeSidebar — lists all recipes for drag-and-drop
// - Fully read-only (cannot drop back into sidebar)
// - Styled with theme-mealplan.module.css
// - Provides visual feedback when dragging
// ===========================================

"use client";

import React from "react";
import { useRecipes } from "@/context/RecipeContext";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import styles from "@/styles/theme-mealplan.module.css";

export default function RecipeSidebar() {
  // Grab all recipes from context
  const { recipes } = useRecipes();

  return (
    <Droppable droppableId="recipes" isDropDisabled>
      {(provided) => (
        <div
          className={styles.sidebar}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <h3 className={styles.heading3}>Recipes</h3>

          {/* Map each recipe → draggable item */}
          {recipes.map((recipe, index) => (
            <Draggable key={recipe.id} draggableId={recipe.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={
                    snapshot.isDragging
                      ? `${styles.recipeCard} ${styles.dragging}`
                      : styles.recipeCard
                  }
                >
                  {recipe.title}
                </div>
              )}
            </Draggable>
          ))}

          {/* Placeholder ensures proper spacing during drag */}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
