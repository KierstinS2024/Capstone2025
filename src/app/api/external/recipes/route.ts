// src/app/api/external/recipes/route.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/external/recipes?query=...
 * Fetches recipes from the Spoonacular API using the query parameter
 */
export async function GET(req: NextRequest) {
  try {
    // Extract the `query` parameter from the URL
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    // Return early if no query was provided
    if (!query) {
      return NextResponse.json({ results: [] });
    }

    // Construct the Spoonacular API URL
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
      query
    )}&number=12&apiKey=${process.env.SPOONACULAR_KEY}`;

    // Fetch data from Spoonacular
    const response = await fetch(url);

    // Handle non-200 responses
    if (!response.ok) {
      console.error("Spoonacular API error:", response.statusText);
      return NextResponse.json({ results: [] });
    }

    const data = await response.json();

    // The `results` field contains an array of recipe objects
    // Return it to the client
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching recipes from Spoonacular:", err);
    return NextResponse.json({ results: [] });
  }
}
