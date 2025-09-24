// ===========================================
// PATH: src/app/signup/page.tsx
// Full Signup Page with Animated, Color-Coded Password Strength Meter
// ===========================================
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import "@/styles/auth.css";

// Regex patterns for validation
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const { signup, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  // Track individual password criteria
  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  // Update validation whenever email or password changes
  useEffect(() => {
    setValidEmail(emailRegex.test(email));

    const length = password.length >= 8;
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const number = /\d/.test(password);
    const specialChar = /[@$!%*?&]/.test(password);

    setCriteria({ length, uppercase, lowercase, number, specialChar });
    setValidPassword(length && uppercase && lowercase && number && specialChar);
  }, [email, password]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validPassword) {
      setError(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
      return;
    }

    setLoading(true);
    const success = await signup(email, password);
    setLoading(false);

    if (!success) {
      setError("Signup failed. Email may already be in use.");
    }
  };

  const criteriaList = [
    { label: "8+ characters", met: criteria.length },
    { label: "Uppercase letter", met: criteria.uppercase },
    { label: "Lowercase letter", met: criteria.lowercase },
    { label: "Number", met: criteria.number },
    { label: "Special character", met: criteria.specialChar },
  ];

  // Count number of criteria met for coloring bars
  const metCount = criteriaList.filter((c) => c.met).length;

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSignup}>
        <h1>Sign Up</h1>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={validEmail || email === "" ? "" : "input-error"}
          required
        />
        {!validEmail && email !== "" && (
          <p className="error-small">Invalid email format</p>
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={validPassword || password === "" ? "" : "input-error"}
          required
        />
        {!validPassword && password !== "" && (
          <p className="error-small">Password must meet all criteria below</p>
        )}

        {/* Animated, color-coded strength meter */}
        {password && (
          <div className="strength-meter">
            {criteriaList.map((c, i) => {
              let colorClass = "weak";
              if (metCount >= 4) colorClass = "strong";
              else if (metCount >= 2) colorClass = "medium";
              return (
                <div
                  key={i}
                  className={`strength-bar ${c.met ? colorClass : ""}`}
                  title={c.label}
                />
              );
            })}
          </div>
        )}

        {password && (
          <div className="strength-labels">
            {criteriaList.map((c, i) => (
              <span key={i}>{c.label}</span>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !validEmail || !validPassword}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="switch-auth">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </main>
  );
}
