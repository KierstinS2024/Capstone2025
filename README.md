🍽️ Recipe & Meal Planner App (Capstone Project)
================================================

A **full-stack web application** built with **Next.js** and **MongoDB**, designed to simplify meal planning, manage grocery lists, and track nutrition through personalized recipes and intuitive weekly planners.

* * * * *

Project Overview
----------------

This web app allows users to:

-   Discover and save recipes tailored to dietary needs or available ingredients

-   Create, customize, and save weekly meal plans

-   Automatically generate categorized shopping lists

-   Log daily food intake to track nutrition

-   Receive personalized suggestions and motivational nudges via the dashboard

The application uses **Next.js API routes**, **React components**, and **MongoDB** for scalable, flexible data storage.

* * * * *

Tech Stack
----------

**Frontend**

-   Next.js (React framework)

-   Context API for state management

-   CSS Modules for styling (ready for dark mode)

-   Axios for backend communication

**Backend**

-   Next.js API Routes for server-side endpoints

-   MongoDB with Mongoose ORM

**Authentication**

-   JWT (JSON Web Tokens)

-   bcrypt for password hashing

**External APIs**

-   [Spoonacular](https://spoonacular.com/food-api?utm_source=chatgpt.com) for recipes & nutrition

-   [Edamam](https://developer.edamam.com/?utm_source=chatgpt.com) for nutritional data

-   [Open Food Facts](https://world.openfoodfacts.org/?utm_source=chatgpt.com) for ingredient info

> ⚠️ External API risks: usage limits, incomplete data, commercial restrictions. Fallbacks implemented with static datasets or custom endpoints.

**Deployment**

-   Render or Vercel for hosting (frontend + backend)

-   Version control with GitHub

* * * * *

Platform
--------

Fully responsive **web application**, optimized for **desktop and mobile browsers**. No native app included at this stage.

* * * * *

Project Goals
-------------

-   Accommodate dietary restrictions

-   Minimize food waste

-   Save time on shopping and meal prep

-   Track nutrition goals (calories, macros, etc.)

* * * * *

Target Users
------------

-   Busy professionals and parents

-   Health-conscious individuals

-   People with dietary restrictions (gluten-free, keto, vegetarian, etc.)

-   Fitness enthusiasts tracking macros

-   Beginners in meal prep

* * * * *

Key Features
------------

**Core Features**

-   🔍 Recipe search & filtering by diet, ingredient, cuisine

-   🧠 Personalized suggestions based on user preferences

-   🗓️ Drag-and-drop weekly meal planner

-   🛒 Auto-generated shopping lists, grouped by category

-   🥑 Pantry-aware recipe recommendations

-   📊 Nutrition tracking by meal and day

-   👤 User profile management, dietary settings, dark mode toggle

**Stretch Goals**

-   🗞 Export lists (PDF/CSV)

-   🔁 Recurring meal planning & calendar sync

-   🔔 Notifications & reminders

-   🧪 Guided onboarding quizzes

-   🌍 Multi-language support

* * * * *

Security & Data Handling
------------------------

-   Passwords hashed using bcrypt

-   JWT for session security

-   Protected API routes

-   Only non-sensitive user data stored

* * * * *

Database Models (MongoDB / Mongoose)
------------------------------------

**User**

`{
  email: String,
  passwordHash: String,
  preferences: Object,
  avatarUrl: String
}`

**Recipe**

`{
  name: String,
  description: String,
  instructions: [String],
  nutritionInfo: Object,
  cuisine: String,
  userSubmitted: Boolean,
  createdByUserId: ObjectId
}`

**Ingredient**

`{
  name: String,
  unit: String,
  defaultQuantity: Number,
  nutritionInfo: Object
}`

**MealPlan**

`{
  userId: ObjectId,
  weekStartDate: Date,
  notes: String,
  entries: [
    {
      recipeId: ObjectId,
      dayOfWeek: String,
      mealType: String,
      servings: Number
    }
  ]
}`

**ShoppingList**

`{
  userId: ObjectId,
  mealPlanId: ObjectId,
  createdAt: Date,
  items: [
    { ingredientId: ObjectId, quantity: Number, unit: String, purchased: Boolean }
  ]
}`

**FoodIntake**

`{
  userId: ObjectId,
  recipeId: ObjectId,
  ingredientId: ObjectId,
  date: Date,
  quantity: Number,
  unit: String,
  nutritionSnapshot: Object
}`

* * * * *

User Flow
---------

1.  Guests browse recipes as read-only

2.  Signup/Login → redirected to **Dashboard**

3.  Dashboard allows users to:

    -   Plan meals via wizard and drag/drop interface

    -   View/edit meal plans

    -   Generate shopping lists

    -   Search/add recipes

    -   Track meals & nutrition

    -   Update profile & preferences

📍 [Full User Flow Diagram](https://github.com/KierstinS2024/Capstone2025/blob/main/UserFlowDiagram.md?utm_source=chatgpt.com)

* * * * *

Implementation Checklist
------------------------

| Task | Status |
| --- | --- |
| Project Setup | ✅ Completed |
| Auth System (JWT + bcrypt) | ✅ Completed |
| Database Models (Mongoose) | ✅ Completed |
| API Routes (CRUD) | ✅ Completed |
| Frontend Pages (Recipes, Meal Plans, Shopping Lists, Food Intake, Dashboard, Login/Signup) | ✅ Completed |
| State Management (Context API) | ✅ Completed |
| ProtectedRoute + NavBar wrapping | ✅ Completed |
| Redirect after login/signup | ✅ Completed |
| Styling (CSS Modules / Dark Mode) | ⬜ Pending |
| Testing (unit + integration) | ⬜ Pending |
| Deployment | ⬜ Pending |
| Documentation | ✅ Completed |

* * * * *

API Overview (Next.js API Routes)
---------------------------------

**Authentication**

-   `POST /api/auth/register` → Register user

-   `POST /api/auth/login` → Login user & receive JWT

-   `GET /api/auth/me` → Get current user profile (JWT required)

-   `PUT /api/auth/me` → Update profile/preferences (JWT required)

**Recipes**

-   `GET /api/recipes` → List/search recipes

-   `GET /api/recipes/:id` → Get recipe by ID

-   `POST /api/recipes` → Create recipe (JWT required)

-   `PUT /api/recipes/:id` → Update recipe (JWT required)

-   `DELETE /api/recipes/:id` → Delete recipe (JWT required)

**Meal Plans**

-   `POST /api/meal-plans` → Create meal plan

-   `GET /api/meal-plans` → List user meal plans

-   `GET /api/meal-plans/:id` → Retrieve plan by ID

-   `POST /api/meal-plans/:id/entries` → Add recipe

-   `PUT /api/meal-plans/entries/:entryId` → Update entry

-   `DELETE /api/meal-plans/entries/:entryId` → Remove recipe

**Shopping Lists**

-   `POST /api/shopping-lists` → Generate list

-   `GET /api/shopping-lists` → List user lists

-   `GET /api/shopping-lists/:id` → Get list by ID

-   `POST /api/shopping-lists/:id/items` → Add item

-   `PATCH /api/shopping-lists/items/:itemId` → Update item

-   `DELETE /api/shopping-lists/items/:itemId` → Remove item

**Food Intake**

-   `POST /api/food-intake` → Log consumption

-   `GET /api/food-intake` → List intake logs

-   `DELETE /api/food-intake/:id` → Remove entry

**Misc**

-   `GET /api/health` → Health check

* * * * *

Example Requests
----------------

**Register User**

`POST /api/auth/register
{ "email": "sarah@example.com", "password": "myStrongPassword" }`

**Login User**

`POST /api/auth/login
{ "email": "sarah@example.com", "password": "myStrongPassword" }`

**Create Recipe**

`POST /api/recipes
Authorization: Bearer <JWT>
{ "name": "Chicken Stir Fry", "description": "Quick dinner", "cuisine": "Asian", "ingredients":[{ "id":"123","quantity":200,"unit":"grams" }] }`

**Generate Shopping List**

`POST /api/shopping-lists
{ "mealPlanId": "456" }`

* * * * *

Deployment
----------

1.  Push repo to GitHub

2.  Configure environment variables on **Render** or **Vercel**:

    -   `MONGODB_URI`

    -   `JWT_SECRET`

    -   API keys

3.  Deploy frontend + backend (Next.js handles both)

* * * * *

Story-Driven UX Walkthrough
---------------------------

Sarah signs up, plans meals, generates shopping lists, logs nutrition, and personalizes preferences.

-   Guest → Signup/Login → Dashboard

-   Dashboard → Meal Plan Wizard → Save plan

-   Dashboard → Generate Shopping List → Print/Export

-   Dashboard → Recipe Search → Add Your Own → Save

-   Recipe Details → Track Nutrition

-   View/Update Saved Recipes & Meal Plans

-   Settings → Preferences, Notifications, Dark Mode

-   Nutrition Tracker → Weekly/Monthly Progress

> [Full Story Walkthrough & Diagram](https://github.com/KierstinS2024/Capstone2025/blob/main/UserFlowDiagram.md?utm_source=chatgpt.com)