// path: src/app/food-intake/[id]/page.tsx
/**
 * Edit Food Intake Page
 * --------------------
 * Edit an existing logged food entry.
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";

export default function EditFoodIntakePage() {
  const params = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [calories, setCalories] = useState<number>(0);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await fetch(`/api/food-intake/${params.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          const data = await res.json();
          setName(data.name || "");
          setCalories(data.calories || 0);
          setDate(data.date?.split("T")[0] || "");
        } else console.error("Failed to fetch food intake entry");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [params.id]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/food-intake/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, calories, date }),
      });
      if (res.ok) router.push("/food-intake");
      else console.error("Failed to update entry");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading entry…</p>;

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>Edit Food Intake Entry</h1>
        <label>Name:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <label>Calories:</label>
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(parseInt(e.target.value))}
        />
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </ProtectedRoute>
  );
}
