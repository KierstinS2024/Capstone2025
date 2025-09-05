// src/app/dashboard/ingredients/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import IngredientsForm, { IngredientData } from "@/components/IngredientsForm";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function EditIngredientPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [ingredient, setIngredient] = useState<IngredientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !token) return;

    const fetchIngredient = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/ingredients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load ingredient");

        const data = await res.json();
        setIngredient(data.data || null);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error fetching ingredient");
      } finally {
        setLoading(false);
      }
    };

    fetchIngredient();
  }, [id, token]);

  if (loading) return <p>Loading ingredient...</p>;
  if (error)
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => router.push("/dashboard/ingredients")}>
          Go Back
        </button>
      </div>
    );

  if (!ingredient) return <p>Ingredient not found.</p>;

  return (
    <ProtectedRoute>
      <NavBar />
      <main style={{ padding: "20px" }}>
        <h1>Edit Ingredient</h1>
        <IngredientsForm
          initialData={ingredient}
          onSave={() => router.push("/dashboard/ingredients")}
        />
      </main>
    </ProtectedRoute>
  );
}
