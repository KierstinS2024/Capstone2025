// Path: src/app/page.tsx
"use client"; // Required for client-side navigation

import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f6f2",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "20px",
          color: "#6b4c3b",
          textAlign: "center",
        }}
      >
        Welcome to Meal Planner
      </h1>
      <p
        style={{
          marginBottom: "40px",
          fontSize: "1.2rem",
          textAlign: "center",
          color: "#4a3c2f",
        }}
      >
        Organize your meals, save recipes, and plan your week with ease.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
          maxWidth: "300px",
        }}
      >
        <a
          href="/login"
          style={{
            padding: "12px",
            textAlign: "center",
            borderRadius: "8px",
            backgroundColor: "#6b4c3b",
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Login
        </a>
        <a
          href="/signup"
          style={{
            padding: "12px",
            textAlign: "center",
            borderRadius: "8px",
            backgroundColor: "#8a6b56",
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Sign Up
        </a>
        <a
          href="/guest-dashboard"
          style={{
            padding: "12px",
            textAlign: "center",
            borderRadius: "8px",
            backgroundColor: "#b49e8a",
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Try Guest Mode
        </a>
      </div>
    </div>
  );
};

export default LandingPage;
