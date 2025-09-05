// src/app/dashboard/ingredients/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";

interface Ingredient {
  _id: string;
  name: string;
  unit: string;
  defaultQuantity: number;
  nutritionInfo?: Record<string, any>;
}

export default function IngredientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !token) return;

    const fetchIngredient = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/ingredients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok || !data) {
          setError("Ingredient not found");
          return;
        }
        setIngredient(data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load ingredient");
      } finally {
        setLoading(false);
      }
    };

    fetchIngredient();
  }, [id, token]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this ingredient?")) return;
    try {
      const res = await fetch(`/api/ingredients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) router.push("/dashboard/ingredients");
    } catch (err) {
      console.error(err);
      alert("Failed to delete ingredient");
    }
  };

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
  if (!ingredient) return null;

  return (
    <ProtectedRoute>
      <NavBar />
      <main style={{ padding: "20px" }}>
        <h1>{ingredient.name}</h1>
        <p>
          Default Quantity: {ingredient.defaultQuantity} {ingredient.unit}
        </p>

        {ingredient.nutritionInfo && (
          <div style={{ marginTop: "10px" }}>
            <h2>Nutrition Info</h2>
            <pre
              style={{
                backgroundColor: "#f4f4f4",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              {JSON.stringify(ingredient.nutritionInfo, null, 2)}
            </pre>
          </div>
        )}

        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <button
            onClick={() => router.push(`/dashboard/ingredients/${id}/edit`)}
            style={{ padding: "8px 15px" }}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            style={{
              padding: "8px 15px",
              backgroundColor: "red",
              color: "#fff",
            }}
          >
            Delete
          </button>
        </div>
      </main>
    </ProtectedRoute>
  );
}
