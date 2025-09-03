// path: src/app/dashboard/recipes/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * NewRecipePage
 * - Form to create a new recipe
 * - Minimal fields for now (name, description, cuisine, instructions)
 * - Instructions entered as multi-line; we split by newline into an array
 */
export default function NewRecipePage() {
  const router = useRouter();

  // Simple local form state
  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [description, setDescription] = useState("");
  const [instructionsText, setInstructionsText] = useState(""); // textarea
  const [error, setError] = useState("");

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const token = getToken();
      const payload = {
        name,
        description,
        cuisine,
        instructions: instructionsText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Failed to create recipe (${res.status})`);

      const created = await res.json();
      router.push(`/dashboard/recipes/${created._id || created.id}`);
    } catch (err: any) {
      console.error(err);
      setError(
        "Unable to create recipe. Please check your fields and try again."
      );
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "1rem auto", padding: "1rem" }}>
      <h1 style={{ marginBottom: ".75rem" }}>New Recipe</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Cuisine (optional)
          <input value={cuisine} onChange={(e) => setCuisine(e.target.value)} />
        </label>

        <label>
          Description (optional)
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label>
          Instructions (one step per line)
          <textarea
            rows={6}
            value={instructionsText}
            onChange={(e) => setInstructionsText(e.target.value)}
            placeholder={`Preheat the oven to 375°F.\nMix the dry ingredients.\nStir in the wet ingredients.`}
          />
        </label>

        {error && (
          <p style={{ color: "var(--danger)", marginTop: ".5rem" }}>
            ⚠️ {error}
          </p>
        )}

        <div style={{ display: "flex", gap: ".5rem", marginTop: ".75rem" }}>
          <button type="submit" className="btn">
            Create
          </button>
          <button type="button" className="btn" onClick={() => router.back()}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
