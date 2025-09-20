🍽️ Recipe & Meal Planner App (Capstone2025)

A full-stack application designed to help users simplify meal planning, explore recipes, and manage shopping — fully personalized for authenticated users.

✅ Project Overview

This web application allows users to:

Discover recipes (custom user recipes + Spoonacular integration)

Create, customize, and save weekly meal plans

Add recipes to shopping list (per ingredient or bulk from plan)

Check off, delete, or clear shopping list items

Navigate intuitively with a user-friendly dashboard and navbar

🧰 Tech Stack

Frontend

Next.js 15 (App Router + React)

TypeScript

CSS Modules (no Tailwind)

Context API for global state (Auth, Recipes, Meal Plans, Shopping List)

Backend

Next.js API Routes

MongoDB + Mongoose for data persistence

JWT-based authentication & session management

bcrypt for password hashing

Deployment

Vercel (Next.js hosting)

GitHub for version control

🌐 Platform

Responsive web application optimized for desktop and mobile browsers. No native app planned at this stage.

🎯 Project Goals

Help users plan and discover meals efficiently

Allow recipe exploration and meal planning with minimal friction

Enable shopping list generation from recipes and meal plans

Maintain simple, intuitive navigation with consistent navbar + dashboard

👥 Target Users

Busy professionals or parents needing quick meal planning

Health-conscious individuals who want a personalized planner

Fitness enthusiasts, meal preppers, or people with dietary needs

📆 Key Features

Core (MVP, implemented)

👤 User authentication (signup, login, logout)

📖 Recipe browsing (custom + Spoonacular)

🗓️ Meal plan creation & display (weekly view)

🛒 Shopping list: manual add, bulk-add from recipe or meal plan, check, delete, clear

🧭 Navbar for navigation (authenticated users)

Stretch Goals (planned)

📊 Nutrition tracking by meal/day

🌍 Multi-language support

🗞 Export meal plans or lists (PDF/CSV)

🔔 Notifications & reminders

🔐 Security & Data Handling

Passwords hashed securely with bcrypt

JWTs for authentication

Minimal sensitive data stored — only email + hashed password required

MongoDB used for all persistent data (users, recipes, meal plans, shopping list)

🧬 Current Data Model

User

_id

email

passwordHash

preferences (future dietary settings)

Recipe

_id

title

description

ingredients

instructions

source (user / Spoonacular)

MealPlan

_id

userId

weekStartDate

meals (recipes by day/meal)

ShoppingList

_id

userId

items (name, checked state)

🔄 User Flow

Users log in → land on Dashboard

Dashboard shows current week’s meal plan (3 cards per day: breakfast, lunch, dinner)

Users can:

Add/edit recipes for each meal

Generate shopping list for today or entire week

Add ingredients individually or in bulk from recipes

Shopping list panel allows checking off, deleting, or clearing all items

/meal-plans page allows full week planning in a calendar interface

/recipes page allows search, detail view, adding to plan, pushing ingredients to shopping list

📖 Story-Driven UX

Sarah logs in and sees her weekly meal plan on the dashboard. Breakfast is empty, so she clicks + Add meal and selects a recipe. The shopping list panel automatically populates ingredients for today. Later, she decides to plan for the entire week, generates the full shopping list, and marks items as purchased while cooking. Everything stays in one persistent shopping list tied to her account.

🔨 Tasks Breakdown
Task	Status	Description
Layout & Providers	✅ Done	Set up Auth, Recipe, MealPlan, ShoppingList contexts
Auth System	✅ Done	Signup/login/logout with JWT + bcrypt
Navbar	✅ Done	Dynamic navigation based on auth state
Dashboard	✅ Done	Shows active meal plan + shopping list panel
Recipe Features	⚠️ WIP	Displaying cards, hook favorites, add to plan, push ingredients
Meal Plans	⚠️ WIP	Weekly planner, edit meals, generate shopping list
Stretch Features	⏳ Later	Nutrition tracking, multi-language, export, notifications
🚀 Running the Project
# Install dependencies
npm install

# Start dev server
npm run dev

# Visit in browser
http://localhost:3000

📖 Notes for Contributors

Keep components modular (Navbar, Cards, Forms, Panels)

Wrap all pages in proper providers (layout.tsx handles this)

Shopping list panel should always reflect meal plan or recipe bulk-adds

Always run npm run dev locally to test flows before commits