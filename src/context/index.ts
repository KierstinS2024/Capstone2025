// src/context/index.ts
// Central export for all context hooks and providers

export { AppProviders } from "./AppProviders";

export { AuthProvider, useAuth } from "./AuthContext";
export { RecipeProvider, useRecipes } from "./RecipeContext";
export { MealPlanProvider, useMealPlans } from "./MealPlanContext";
export { ShoppingListProvider, useShoppingLists } from "./ShoppingListContext";
export { UserProvider, useUser } from "./UserContext";
