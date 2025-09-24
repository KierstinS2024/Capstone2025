// ===========================================
// PATH: src/components/RecipeSidebar.tsx
// Sidebar with draggable recipe cards
// ===========================================

"use client";

import React from "react";
import { useRecipes } from "@/context/RecipeContext";
import { Draggable, Droppable } from "@hello-pangea/dnd"; // ✅ updated import
import styles from "@/styles/mealplan-editor.module.css";

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
          <h3>Recipes</h3>

          {recipes.map((r, index) => (
            <Draggable draggableId={r.id} index={index} key={r.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={styles.recipeCard}
                >
                  {r.title}
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
