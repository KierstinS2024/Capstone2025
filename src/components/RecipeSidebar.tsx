//src/components/RecipeSidebar.tsx
"use client";

import React from "react";
import { useRecipes } from "@/context/RecipeContext";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import styles from "@/styles/recipeSidebar.module.css";

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

          <div className={styles.scrollContainer}>
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
                    title={recipe.title} //tool for clarity
                  >
                    {recipe.title}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}
