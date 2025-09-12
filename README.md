🍽️ Recipe & Meal Planner App (Capstone2025)

A full-stack application designed to help users simplify meal planning, explore recipes, and stay on track with healthy eating — with support for both authenticated users and guest mode browsing.

✅ Project Overview

This web application allows users to:

Discover recipes (custom + guest-friendly dataset)

Create, customize, and save meal plans

Mark recipes as favorites for quick access

Experiment in guest mode without creating an account

Navigate intuitively with a user-friendly dashboard and navbar

🧰 Tech Stack

Frontend

Next.js 15 (App Router + React)

TypeScript

Tailwind CSS

Context API for global state (auth, recipes, favorites, meal plans, guest mode)

Backend

Next.js API routes (serverless functions for auth & data handling)

Future-ready for PostgreSQL / external APIs

Authentication

JWT-based sessions via API routes

bcrypt for password hashing

Guest Mode

Static dataset of recipes (guestRecipes.ts)

Context-powered state (GuestContext.tsx)

Deployment

Vercel (Next.js hosting)

GitHub for version control

🌐 Platform

This is a responsive web application, optimized for desktop and mobile browsers. No native app is planned at this stage.

🎯 Project Goals

To help users plan and discover meals efficiently while:

Supporting both registered accounts and guests

Allowing recipe exploration with minimal friction

Laying groundwork for nutrition tracking and shopping list generation

Keeping navigation simple and intuitive with a consistent navbar + dashboard

👥 Target Users

Guests curious about exploring recipes without committing

Busy professionals or parents needing quick meal planning

Health-conscious individuals who want a personalized planner

Future audience: fitness enthusiasts, meal preppers, and people with dietary needs

📆 Key Features
Core (MVP, implemented)

👤 User authentication (signup, login, logout)

🧑‍🍳 Guest mode (browse preloaded recipes & mock meal planning)

📖 Recipe browsing and favorites

🗓️ Meal plan creation & display

🧭 Navbar for navigation (authenticated + guest-aware)

Stretch Goals (planned)

🛒 Auto-generated shopping lists

📊 Nutrition tracking by meal/day

🌍 Multi-language support

🗞 Export meal plans or lists (PDF/CSV)

🔔 Notifications & reminders

🔐 Security & Data Handling

User passwords securely hashed with bcrypt

JWTs for authentication

Guest mode stores no persistent data

Minimal sensitive data stored — only email + hashed password required

🧬 Current Data Model

Currently lightweight (contexts + static guest data).
Planned full schema will expand into relational storage.

User

id

email

password_hash

preferences (future dietary settings)

Recipe

id

name

description

instructions

nutrition_info (future)

is_guest (to differentiate static guest recipes)

MealPlan

id

user_id

week_start_date

entries (recipes by day/meal)

🔄 User Flow

Guests can immediately enter Guest Mode from the landing page

Guests see recipes, can mock-create plans (but data resets on refresh)

Authenticated users log in and land on the dashboard

Navbar dynamically adjusts:

Guests: Login | Signup | Guest Mode

Users: Dashboard | Logout

Dashboard gives quick access to:

Meal planner

Recipe browsing

Favorites

📖 Story-Driven UX

Sarah isn’t sure if she wants to sign up. She clicks Guest Mode, tries a few recipes, and experiments with a meal plan.
Later, she decides to create an account, logs in, and can now save her favorites and meal plans. The transition from guest → user feels natural and rewarding.

🔨 Tasks Breakdown
Task	Status	Description
Layout & Providers	✅ Done	Set up Auth, Recipe, MealPlan, Favorites, Guest contexts
Auth System	✅ Done	Signup/login/logout with JWT + bcrypt
Guest Mode	✅ Done	Static dataset & GuestContext
Navbar	✅ Done	Dynamic nav based on auth state
Dashboard	⚠️ WIP	Empty for logged-in users, needs population
Recipe Features	⚠️ WIP	Displaying cards, hooking favorites + planner
Meal Plans	⚠️ WIP	Form exists, needs tighter integration
Stretch Features	⏳ Later	Nutrition tracking, shopping lists, export
🚀 Running the Project
# Install dependencies
npm install

# Start dev server
npm run dev

# Visit in browser
http://localhost:3000

📖 Notes for Contributors

Keep components modular (Navbar, Cards, Forms, etc.)

Wrap all pages in proper providers (layout.tsx handles this)

Guest mode should never break when API is down

Always run npm run dev locally to test flows before commits