// src/context/RecipeContext.tsx
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import type { Recipe } from "@/types/recipe";
import { fetchRecipes, createRecipe, deleteRecipe } from "@/lib/recipeApi";

interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => Promise<void>;
  removeRecipe: (id: string) => Promise<void>;
}

export const RecipeContext = createContext<RecipeContextType | undefined>(
  undefined
);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    fetchRecipes().then(setRecipes);
  }, []);

  const addRecipe = async (recipe: Recipe) => {
    await createRecipe(recipe);
    setRecipes((prev) => [...prev, recipe]);
  };

  const removeRecipe = async (id: string) => {
    await deleteRecipe(id);
    setRecipes((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <RecipeContext.Provider value={{ recipes, addRecipe, removeRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipe = (): RecipeContextType => {
  const context = useContext(RecipeContext);
  if (!context) throw new Error("useRecipe must be used within RecipeProvider");
  return context;
};
