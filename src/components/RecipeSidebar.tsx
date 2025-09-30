// ===========================================
// PATH: src/components/RecipeSidebar.tsx
// ===========================================
"use client";

import React from "react";
import { useRecipes } from "@/context/RecipeContext";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import styles from "@/styles/recipeSidebar.module.css";

/**
 * RecipeSidebar
 * - Displays all saved recipes for the user
 * - Recipes are draggable into MealPlanEditor
 * - Droppable is disabled (cannot drop back into sidebar)
 */
export default function RecipeSidebar() {
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

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
