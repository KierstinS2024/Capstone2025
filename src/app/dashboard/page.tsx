// src/app/dashboard/page.tsx
// Example dashboard consuming all contexts

"use client";
import React from "react";
import { useUserContext } from "@/context/UserContext";
import { useMealPlanContext } from "@/context/MealPlanContext";
import { useRecipeContext } from "@/context/RecipeContext";
import { useShoppingListContext } from "@/context/ShoppingListContext";

export default function DashboardPage() {
  // Grab values and actions from contexts
  const { user, setUser } = useUserContext();
  const { mealPlans, addMealPlan } = useMealPlanContext();
  const { recipes, addRecipe } = useRecipeContext();
  const { shoppingLists, addShoppingList } = useShoppingListContext();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>

      {/* User Context Test */}
      <section>
        <h2>User</h2>
        <p>Current user: {user ? user.name : "None"}</p>
        <button
          onClick={() =>
            setUser({ id: "1", name: "Kierstin", email: "test@example.com" })
          }
        >
          Set User
        </button>
      </section>

      {/* MealPlan Context Test */}
      <section>
        <h2>Meal Plans</h2>
        <p>Total Plans: {mealPlans.length}</p>
        <button
          onClick={() =>
            addMealPlan({
              id: Date.now().toString(),
              title: "Weekly Plan",
              meals: [],
            })
          }
        >
          Add Meal Plan
        </button>
      </section>

      {/* Recipe Context Test */}
      <section>
        <h2>Recipes</h2>
        <p>Total Recipes: {recipes.length}</p>
        <button
          onClick={() =>
            addRecipe({
              id: Date.now().toString(),
              title: "Pasta",
              ingredients: [],
              steps: [],
            })
          }
        >
          Add Recipe
        </button>
      </section>

      {/* ShoppingList Context Test */}
      <section>
        <h2>Shopping Lists</h2>
        <p>Total Lists: {shoppingLists.length}</p>
        <button
          onClick={() =>
            addShoppingList({
              id: Date.now().toString(),
              name: "Groceries",
              items: [],
            })
          }
        >
          Add Shopping List
        </button>
      </section>
    </div>
  );
}
