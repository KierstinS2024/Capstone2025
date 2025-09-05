// src/context/IngredientContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

interface Ingredient {
  _id: string;
  name: string;
  unit: string;
  defaultQuantity: number;
}

interface IngredientContextType {
  ingredients: Ingredient[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const IngredientContext = createContext<IngredientContextType>({
  ingredients: [],
  loading: false,
  error: null,
  refresh: () => {},
});

export const IngredientProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIngredients = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ingredients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setIngredients(data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch ingredients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, [token]);

  return (
    <IngredientContext.Provider
      value={{ ingredients, loading, error, refresh: fetchIngredients }}
    >
      {children}
    </IngredientContext.Provider>
  );
};

export const useIngredients = () => useContext(IngredientContext);
