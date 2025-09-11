// src/components/Dashboard.tsx
"use client";

import { useAuth } from "@/context/AuthContext";

// Simple dashboard displaying logged-in user info
export const Dashboard = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex flex-col gap-2">
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <button
        onClick={() => logout()}
        className="bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};
