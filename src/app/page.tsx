// src/app/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { LoginForm } from "@/components/LoginForm";
import { SignupForm } from "@/components/SignupForm";
import { Dashboard } from "@/components/Dashboard";

// Home page: shows login/signup or dashboard depending on auth state
export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user)
    return (
      <div className="flex flex-col gap-4">
        <LoginForm />
        <SignupForm />
      </div>
    );

  return <Dashboard />;
}
