// path: src/app/dashboard/recipes/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../page.module.css";

/**
 * RecipeDetailPage
 * - Loads and displays a single recipe by id
 * - Allows delete (with confirm) and link to edit
 */
export default function RecipeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [recipe, setRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const token = getToken();
        const res = await fetch(`/api/recipes/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`Failed to fetch recipe (${res.status})`);
        const data = await res.json();
        setRecipe(data);
      } catch (err: any) {
        console.error(err);
        setError("Unable to load recipe.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    const confirm = window.confirm(
      "Delete this recipe? This cannot be undone."
    );
    if (!confirm) return;

    try {
      const token = getToken();
      const res = await fetch(`/api/recipes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`Failed to delete recipe (${res.status})`);
      router.push("/dashboard/recipes");
    } catch (err) {
      console.error(err);
      alert("Failed to delete recipe.");
    }
  };

  if (loading)
    return (
      <div className={styles.container}>
        <p>Loading…</p>
      </div>
    );
  if (error)
    return (
      <div className={styles.container}>
        <p className={styles.error}>⚠️ {error}</p>
      </div>
    );
  if (!recipe)
    return (
      <div className={styles.container}>
        <p>Recipe not found.</p>
      </div>
    );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>{recipe.name}</h1>
          {recipe.cuisine && <p className={styles.muted}>{recipe.cuisine}</p>}
        </div>
        <div className={styles.actions}>
          <Link
            href={`/dashboard/recipes/${recipe._id}/edit`}
            className={styles.btn}
          >
            Edit
          </Link>
          <button onClick={handleDelete} className={styles.btnPrimary}>
            Delete
          </button>
        </div>
      </header>

      {recipe.description && (
        <p style={{ marginBottom: "1rem" }}>{recipe.description}</p>
      )}

      {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 && (
        <section className={styles.card}>
          <h2>Instructions</h2>
          <ol style={{ paddingLeft: "1.25rem", marginTop: ".5rem" }}>
            {recipe.instructions.map((step: string, idx: number) => (
              <li key={idx} style={{ marginBottom: ".35rem" }}>
                {step}
              </li>
            ))}
          </ol>
        </section>
      )}

      {recipe.nutritionInfo && (
        <section className={styles.card}>
          <h2>Nutrition</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(recipe.nutritionInfo, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
