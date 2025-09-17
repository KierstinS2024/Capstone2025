// PATH: src/app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to MealMate 🍽️</h1>
      <p>Plan meals. Generate shopping lists. Simplify life.</p>
      <Link href="/login">Log In</Link> | <Link href="/signup">Sign Up</Link>
    </main>
  );
}
