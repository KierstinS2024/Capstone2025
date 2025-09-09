"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export interface IngredientData {
  _id?: string;
  name: string;
  unit: string;
  defaultQuantity: number;
}

interface IngredientsFormProps {
  initialData?: IngredientData;
  onSave?: () => void; // Callback after successful save
}

export default function IngredientsForm({
  initialData,
  onSave,
}: IngredientsFormProps) {
  const { token } = useAuth();

  const [name, setName] = useState(initialData?.name || "");
  const [unit, setUnit] = useState(initialData?.unit || "");
  const [defaultQuantity, setDefaultQuantity] = useState(
    initialData?.defaultQuantity || 1
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = initialData?._id
        ? `/api/ingredients/${initialData._id}`
        : "/api/ingredients";
      const method = initialData?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, unit, defaultQuantity }),
      });

      if (!res.ok) throw new Error("Failed to save ingredient");

      if (onSave) onSave();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error saving ingredient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "10px" }}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          Unit:
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          Default Quantity:
          <input
            type="number"
            min={1}
            value={defaultQuantity}
            onChange={(e) => setDefaultQuantity(parseFloat(e.target.value))}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ padding: "10px 20px" }}
      >
        {loading
          ? "Saving..."
          : initialData?._id
          ? "Save Changes"
          : "Create Ingredient"}
      </button>
    </div>
  );
}
