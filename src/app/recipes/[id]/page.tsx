// path: src/app/recipes/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getRecipeById } from "@/lib/spoonacularApi";
import { RecipeDetail } from "@/types/recipe";
import { useMealPlan } from "@/context/MealPlanContext";
import { useShoppingList } from "@/context/ShoppingListContext";
import "@/styles/recipe-detail.css";

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { mealPlans, addMealToPlan } = useMealPlan();
  const { addItem } = useShoppingList();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<
    "breakfast" | "lunch" | "dinner"
  >("breakfast");

  // fetch recipe from Spoonacular
  useEffect(() => {
    async function fetchRecipe() {
      try {
        if (!id) return;
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (err: any) {
        setError(err.message || "Failed to load recipe");
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  const handleAddIngredient = (ing: string) => {
    addItem(ing);
  };

  const handleAddAllIngredients = () => {
    recipe.extendedIngredients.forEach((ing) => addItem(ing.original));
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleConfirmAddToMealPlan = () => {
    if (!selectedPlanId || !selectedDate) return;
    addMealToPlan(
      {
        id: `${recipe.id}-${selectedMealType}-${selectedDate}`,
        type: selectedMealType,
        date: selectedDate,
        name: recipe.title,
        recipeId: recipe.id,
        image: recipe.image,
        source: "spoonacular",
        description: "",
      },
      selectedDate
    );
    handleCloseModal();
  };

  return (
    <div
      className="recipe-detail-page"
      style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}
    >
      <h2 className="recipe-title">{recipe.title}</h2>
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="recipe-image"
          style={{
            width: "100%",
            maxHeight: 400,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      )}

      <section className="ingredients-section" style={{ marginTop: 16 }}>
        <h3>Ingredients</h3>
        <ul>
          {recipe.extendedIngredients.map((ing) => (
            <li
              key={ing.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <span>{ing.original}</span>
              <button
                style={{
                  border: "none",
                  backgroundColor: "#1d4ed8",
                  color: "#fff",
                  borderRadius: 6,
                  padding: "2px 6px",
                  cursor: "pointer",
                }}
                onClick={() => handleAddIngredient(ing.original)}
              >
                +
              </button>
            </li>
          ))}
        </ul>
        <button
          className="button"
          style={{ marginTop: 8 }}
          onClick={handleAddAllIngredients}
        >
          Add All Ingredients to Shopping List
        </button>
      </section>

      <section className="instructions-section" style={{ marginTop: 24 }}>
        <h3>Instructions</h3>
        <div
          className="prose"
          dangerouslySetInnerHTML={{
            __html: recipe.instructions || "No instructions available.",
          }}
        />
      </section>

      <section className="mealplan-section" style={{ marginTop: 24 }}>
        <h3>Add to Meal Plan</h3>
        <button
          className="button"
          style={{ backgroundColor: "#10b981", marginTop: 8 }}
          onClick={handleOpenModal}
        >
          Add to Meal Plan
        </button>

        {/* Modal */}
        {modalOpen && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              className="modal-content"
              style={{
                backgroundColor: "#fff",
                padding: 24,
                borderRadius: 8,
                maxWidth: 400,
                width: "100%",
              }}
            >
              <h4>Select Meal Plan & Date</h4>
              <label style={{ display: "block", marginTop: 8 }}>
                Plan:
                <select
                  value={selectedPlanId ?? ""}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  style={{ width: "100%", marginTop: 4 }}
                >
                  <option value="">-- Select Plan --</option>
                  {mealPlans.map((plan) => (
                    <option key={plan._id} value={plan._id}>
                      {plan.startDate} → {plan.endDate}
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ display: "block", marginTop: 8 }}>
                Date:
                <input
                  type="date"
                  value={selectedDate}
                  min={
                    selectedPlanId
                      ? mealPlans.find((p) => p._id === selectedPlanId)
                          ?.startDate
                      : undefined
                  }
                  max={
                    selectedPlanId
                      ? mealPlans.find((p) => p._id === selectedPlanId)?.endDate
                      : undefined
                  }
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ width: "100%", marginTop: 4 }}
                />
              </label>

              <label style={{ display: "block", marginTop: 8 }}>
                Meal Type:
                <select
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value as any)}
                  style={{ width: "100%", marginTop: 4 }}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </label>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 16,
                }}
              >
                <button
                  style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: "#ccc",
                    cursor: "pointer",
                  }}
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: "#10b981",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                  onClick={handleConfirmAddToMealPlan}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
