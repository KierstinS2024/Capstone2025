// path: src/app/ingredients/[id]/edit/page.tsx
"use client";

/**
 * EditIngredientPage
 * ------------------
 * Dashboard page to edit an existing ingredient.
 * Fetches ingredient by ID and pre-fills IngredientForm.
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import IngredientForm from "@/components/IngredientsForm";
import { useAuth } from "@/context/AuthContext";

interface IngredientData {
  _id: string;
  name: string;
  defaultQuantity: number;
  unit: string;
}

export default function EditIngredientPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const router = useRouter();
  const [ingredient, setIngredient] = useState<IngredientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !token) return;

    const fetchIngredient = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/ingredients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Ingredient not found");
        const data = await res.json();
        setIngredient(data.data);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load ingredient");
        router.push("/ingredients");
      } finally {
        setLoading(false);
      }
    };

    fetchIngredient();
  }, [id, token, router]);

  if (loading) return <p>Loading ingredient...</p>;
  if (!ingredient) return null;

  const handleSave = () => {
    router.push("/ingredients"); // redirect after save
  };

  return (
    <ProtectedRoute>
      <NavBar />
      <main style={{ padding: "20px" }}>
        <h1>Edit Ingredient</h1>
        <IngredientForm initialData={ingredient} onSave={handleSave} />
      </main>
    </ProtectedRoute>
  );
}
