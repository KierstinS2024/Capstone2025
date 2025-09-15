// src/components/AddMealForm.tsx
"use client";

import React, { useState } from "react";

interface AddMealFormProps {
  onAdd: (name: string) => void;
}

export default function AddMealForm({ onAdd }: AddMealFormProps) {
  const [mealName, setMealName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;
    onAdd(mealName.trim());
    setMealName("");
  };

  return (
    <form className="add-meal-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Meal name"
        value={mealName}
        onChange={(e) => setMealName(e.target.value)}
        required
      />
      <button type="submit">Add Meal</button>
    </form>
  );
}
