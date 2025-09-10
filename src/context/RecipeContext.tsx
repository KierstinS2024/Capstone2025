// src/context/RecipeContext.tsx
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { Recipe } from "@/models/Recipe";
import {
  fetchRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleFavorite,
} from "@/lib/recipeApi";

// Type-safe context shape
type RecipeContextType = {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  addRecipe: (recipe: Partial<Recipe>) => Promise<void>;
  editRecipe: (id: string, recipe: Partial<Recipe>) => Promise<void>;
  removeRecipe: (id: string) => Promise<void>;
  toggleFavoriteRecipe: (id: string) => Promise<void>;
};

// Default placeholder
const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

// Provider component
export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    try {
      const data = await fetchRecipes();
      setRecipes(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const addRecipe = async (recipe: Partial<Recipe>) => {
    const newRecipe = await createRecipe(recipe);
    setRecipes((prev) => [...prev, newRecipe]);
  };

  const editRecipe = async (id: string, recipe: Partial<Recipe>) => {
    const updated = await updateRecipe(id, recipe);
    setRecipes((prev) => prev.map((r) => (r._id === id ? updated : r)));
  };

  const removeRecipe = async (id: string) => {
    await deleteRecipe(id);
    setRecipes((prev) => prev.filter((r) => r._id !== id));
  };

  const toggleFavoriteRecipe = async (id: string) => {
    const updated = await toggleFavorite(id);
    setRecipes((prev) => prev.map((r) => (r._id === id ? updated : r)));
  };

  useEffect(() => {
    reload();
  }, []);

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        loading,
        error,
        reload,
        addRecipe,
        editRecipe,
        removeRecipe,
        toggleFavoriteRecipe,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

// Hook for consuming
export const useRecipes = (): RecipeContextType => {
  const context = useContext(RecipeContext);
  if (!context) throw new Error("useRecipes must be used within a RecipeProvider");
  return context;
};
