"use client";

import React from "react";
import { useGuest } from "@/context/GuestContext";
import MealPlanCard from "@/components/MealPlanCard";
import "./guest-dashboard.css"; // import CSS file

const GuestDashboard: React.FC = () => {
  const { guestMealPlan } = useGuest();
  const todayDate = new Date().toISOString();

  return (
    <div className="guest-dashboard">
      {/* Hero Section */}
      <section className="hero">
        <h1>Plan Smarter, Eat Better 🍴</h1>
        <p>
          Get a sneak peek at how easy meal planning can be. Try out a guest
          plan below — no account needed!
        </p>
        <button className="primary-btn">Get Started Free</button>
      </section>

      {/* Preview Section */}
      <section className="preview">
        <h2>Preview Today’s Plan</h2>
        <MealPlanCard
          todayMeals={guestMealPlan || []}
          mealPlanDate={todayDate}
          isGuest
        />
        {!guestMealPlan?.length && (
          <p className="empty-text">
            No meals planned yet — click “+ Add Meal” to explore!
          </p>
        )}
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature">
          <h3>Save Time</h3>
          <p>Quickly plan your week’s meals in just a few clicks.</p>
        </div>
        <div className="feature">
          <h3>Stay Organized</h3>
          <p>Keep recipes and grocery lists all in one place.</p>
        </div>
        <div className="feature">
          <h3>Eat Healthier</h3>
          <p>Balance your meals with guided planning tools.</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Take Control?</h2>
        <p>
          Create your free account today and unlock the full meal planning
          experience.
        </p>
        <button className="secondary-btn">Sign Up Free</button>
      </section>
    </div>
  );
};

export default GuestDashboard;
