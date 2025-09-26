// ===========================================
// PATH: src/components/RecipeSidebar.tsx
// RecipeSidebar — lists all recipes
// - Drag-and-drop to MealPlanEditor
// - Cannot drop back into sidebar
// ===========================================

"use client";

import React from "react";
import { useRecipes } from "@/context/RecipeContext";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import styles from "@/styles/theme-mealplan.module.css";

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

          {/* Map recipes → draggable */}
          {recipes.map((recipe, index) => (
            <Draggable key={recipe.id} draggableId={recipe.id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={styles.recipeCard}
                >
                  {recipe.title}
                </div>
              )}
            </Draggable>
          ))}

          {/* Placeholder for drag spacing */}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
