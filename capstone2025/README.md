🍽️ Recipe & Meal Planner App (Capstone Project)
================================================

**A full-stack web application built with Next.js and MongoDB, designed to simplify meal planning, manage grocery lists, and track nutrition through personalized recipes and weekly planners.**

* * * * *

Project Overview
----------------

This web app allows users to:

-   Discover and save recipes tailored to dietary needs or available ingredients.

-   Create, customize, and save weekly meal plans.

-   Automatically generate categorized shopping lists.

-   Log daily food intake to track nutrition.

-   Receive personalized suggestions and motivational nudges via the dashboard.

The application uses **Next.js API routes**, **React components**, and **MongoDB** for scalable, flexible data storage.

* * * * *

Tech Stack
----------

**Frontend**

-   Next.js (React framework)

-   Context API for state management

-   CSS Modules (with dark mode support)

-   Axios for backend communication

**Backend**

-   Next.js API Routes (server-side endpoints)

-   MongoDB with Mongoose ORM

**Authentication**

-   JWT (JSON Web Tokens)

-   bcrypt for password hashing

**Validation**

-   Zod schemas for form validation (stored in `src/schemas/`)

**External API**

-   [Spoonacular](https://spoonacular.com/food-api?utm_source=chatgpt.com) for recipes, ingredients, and nutritional data

> ⚠️ External API risks: usage limits, incomplete data, commercial restrictions. Fallbacks implemented via static datasets or custom endpoints.

**Deployment**

-   Render or Vercel for hosting (frontend + backend)

-   Version control with GitHub

* * * * *

Platform
--------

-   Fully responsive **web application**, optimized for **desktop and mobile browsers**.

-   No native app included at this stage.

* * * * *

Project Goals
-------------

-   Accommodate dietary restrictions.

-   Minimize food waste.

-   Save time on shopping and meal prep.

-   Track nutrition goals (calories, macros, etc.).

* * * * *

Target Users
------------

-   Busy professionals and parents.

-   Health-conscious individuals.

-   People with dietary restrictions (gluten-free, keto, vegetarian, etc.).

-   Fitness enthusiasts tracking macros.

-   Beginners in meal prep.

Key Features
------------

**Core Features**

-   🔍 **Recipe search & filtering** by diet, ingredient, cuisine.

-   🧠 **Personalized suggestions** based on user preferences.

-   🗓️ **Drag-and-drop weekly meal planner**.

-   🛒 **Auto-generated shopping lists**, grouped by category.

-   🥑 **Pantry-aware recipe recommendations**.

-   📊 **Nutrition tracking** by meal and day.

-   👤 **User profile management**, dietary settings, dark mode toggle.

**Stretch Goals**

-   🗞 Export lists (PDF/CSV).

-   🔁 Recurring meal planning & calendar sync.

-   🔔 Notifications & reminders.

-   🧪 Guided onboarding quizzes.

-   🌍 Multi-language support.

* * * * *

Security & Data Handling
------------------------

-   Passwords hashed using **bcrypt**.

-   **JWT** for session security.

-   **Protected API routes** for authenticated operations.

-   Only non-sensitive user data stored.

* * * * *

Database Models (MongoDB / Mongoose)
------------------------------------

Updated to reflect **Zod schemas** and new structure:

**User (`src/models/User.ts`)**

`{
  email: String,
  passwordHash: String,
  preferences: Object,
  avatarUrl: String
}`

**Recipe (`src/models/Recipe.ts`)**

`{
  title: String,
  description: String,
  instructions: String[],
  servings: Number,
  cuisine: String,
  source: "user" | "spoonacular",
  ingredients: [{ ingredientId: String, quantity: Number, unit?: String }],
  userId: String
}`

**Ingredient (`src/models/Ingredient.ts`)**

`{
  name: String,
  unit: String,
  defaultQuantity: Number,
  nutritionInfo: Object
}`

**MealPlan (`src/models/MealPlan.ts`)**

`{
  userId: String,
  weekStartDate: Date,
  notes: String,
  entries: [
    {
      recipeId: String,
      dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday",
      mealType: "breakfast" | "lunch" | "dinner" | "snack",
      servings: Number
    }
  ]
}`

**ShoppingList (`src/models/ShoppingList.ts`)**

`{
  userId: String,
  mealPlanId: String,
  createdAt: Date,
  items: [{ ingredientId: String, quantity: Number, unit: String, purchased: Boolean }]
}`

**FoodIntake (`src/models/FoodIntake.ts`)**

`{
  userId: String,
  date: Date,
  mealType: "breakfast" | "lunch" | "dinner" | "snack",
  quantity: Number,
  unit: String,
  recipeId?: String,
  ingredientId?: String
}`

User Flow
---------

1.  User **signs up or logs in** → redirected to **Dashboard**.

2.  **Dashboard** allows users to:

    -   Plan meals via wizard or drag/drop interface.

    -   View/edit saved meal plans.

    -   Generate shopping lists automatically.

    -   Search/add recipes (user-submitted or from Spoonacular).

    -   Track daily food intake & nutrition.

    -   Update profile preferences (dietary settings, dark mode).

📍 [Full User Flow Diagram](https://github.com/KierstinS2024/Capstone2025/blob/main/UserFlowDiagram.md?utm_source=chatgpt.com)

* * * * *

API Overview (Next.js API Routes)
---------------------------------

**Authentication**

-   `POST /api/auth/signup` → Register user

-   `POST /api/auth/login` → Login & receive JWT

-   `GET /api/auth/me` → Get current user profile (JWT required)

-   `PUT /api/auth/me` → Update profile/preferences (JWT required)

**Recipes**

-   `GET /api/recipes` → List/search recipes

-   `GET /api/recipes/:id` → Retrieve recipe by ID

-   `POST /api/recipes` → Create recipe (JWT required)

-   `PUT /api/recipes/:id` → Update recipe (JWT required)

-   `DELETE /api/recipes/:id` → Delete recipe (JWT required)

**Meal Plans**

-   `POST /api/meal-plans` → Create meal plan

-   `GET /api/meal-plans` → List user meal plans

-   `GET /api/meal-plans/:id` → Retrieve plan by ID

-   `POST /api/meal-plans/:id/entries` → Add recipe entry

-   `PUT /api/meal-plans/entries/:entryId` → Update entry

-   `DELETE /api/meal-plans/entries/:entryId` → Remove recipe entry

**Shopping Lists**

-   `POST /api/shopping-lists` → Generate new list

-   `GET /api/shopping-lists` → List user lists

-   `GET /api/shopping-lists/:id` → Retrieve list by ID

-   `POST /api/shopping-lists/:id/items` → Add item

-   `PATCH /api/shopping-lists/items/:itemId` → Update item

-   `DELETE /api/shopping-lists/items/:itemId` → Remove item

**Food Intake**

-   `POST /api/food-intake` → Log food consumption

-   `GET /api/food-intake` → List intake logs

-   `DELETE /api/food-intake/:id` → Remove entry

**Misc**

-   `GET /api/health` → Health check

* * * * *

Example Requests
----------------

**Register User**

`POST /api/auth/signup
{
  "email": "sarah@example.com",
  "password": "myStrongPassword"
}`

**Login User**

`POST /api/auth/login
{
  "email": "sarah@example.com",
  "password": "myStrongPassword"
}`

**Create Recipe**

`POST /api/recipes
Authorization: Bearer <JWT>
{
  "title": "Chicken Stir Fry",
  "description": "Quick dinner",
  "cuisine": "Asian",
  "instructions": ["Cook chicken", "Add vegetables", "Stir fry"],
  "servings": 2,
  "ingredients":[{ "ingredientId":"123","quantity":200,"unit":"grams" }]
}`

**Generate Shopping List**

`POST /api/shopping-lists
{
  "mealPlanId": "456"
}`

* * * * *

Deployment
----------

1.  Push repo to **GitHub**.

2.  Configure environment variables on **Render** or **Vercel**:

    -   `MONGODB_URI`

    -   `JWT_SECRET`

    -   Spoonacular API key

3.  Deploy frontend + backend (Next.js handles both).

* * * * *

Story-Driven UX Walkthrough
---------------------------

Sarah signs up, plans meals, generates shopping lists, logs nutrition, and personalizes preferences:

-   Signup/Login → redirected to **Dashboard**

-   **Dashboard** → Meal Plan Wizard → Save plan

-   **Dashboard** → Generate Shopping List → Print/Export

-   **Dashboard** → Recipe Search → Add Your Own → Save

-   Recipe Details → Track Nutrition

-   View/Update Saved Recipes & Meal Plans

-   Settings → Preferences, Notifications, Dark Mode

-   Nutrition Tracker → Weekly/Monthly Progress

> [Full Story Walkthrough & Diagram](https://github.com/KierstinS2024/Capstone2025/blob/main/UserFlowDiagram.md?utm_source=chatgpt.com)