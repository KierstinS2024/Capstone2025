🍽️ Recipe & Meal Planner App (Capstone Project)
================================================

A full-stack web application built with **Next.js** and **MongoDB**, designed to simplify meal planning, manage grocery lists, and track nutrition through personalized recipes and intuitive weekly planners.

* * * * *

## Project Overview
------------------

This web application allows users to:

-   Discover recipes based on dietary needs or available ingredients

-   Create, customize, and save weekly meal plans

-   Automatically generate categorized shopping lists

-   Track nutrition by logging daily food intake

-   Receive smart suggestions and motivational nudges via the dashboard

This version uses **Next.js API routes**, **React components**, and **MongoDB** for scalable, flexible data storage.

* * * * *

## Tech Stack
-------------

**Frontend**

-   Next.js (React framework)

-   React Router (if needed for additional routing)

-   Context API for state management

-   CSS Modules / Custom CSS with dark mode toggle

-   Axios / Fetch API for backend communication

**Backend**

-   Next.js API Routes (replacing Express)

-   MongoDB with Mongoose ORM for data modeling

**Authentication**

-   JWT (JSON Web Tokens)

-   bcrypt (for password hashing)

**External APIs**

-   [Spoonacular](https://spoonacular.com/food-api?utm_source=chatgpt.com)

-   [Edamam](https://developer.edamam.com/?utm_source=chatgpt.com)

-   [Open Food Facts](https://world.openfoodfacts.org/data?utm_source=chatgpt.com)

> ⚠️ External API risks: usage limits, incomplete data, commercial restrictions. Fallback: static datasets or custom endpoints.

**Deployment**

-   Frontend + Backend: Render / Vercel

-   Version Control: GitHub

* * * * *

## Platform
-----------

Fully responsive web application, optimized for **desktop and mobile browsers**. Native app not included in this stage.

* * * * *

## Project Goals
----------------

-   Accommodate dietary restrictions

-   Minimize food waste

-   Save time on shopping and meal prep

-   Track nutrition goals (macros, calories, etc.)

* * * * *

## Target Users
---------------

-   Busy professionals and parents

-   Health-conscious individuals

-   People with dietary restrictions (gluten-free, keto, etc.)

-   Fitness enthusiasts tracking macros

-   Beginners in meal prep

* * * * *

## Key Features
---------------

### Core

-   🔍 Recipe search & filtering by diet, ingredient, cuisine

-   🧠 Personalized suggestions based on preferences

-   🗓️ Drag-and-drop meal planner by day/meal

-   🛒 Auto-generated shopping lists, grouped by category

-   🥑 Pantry-aware recommendations

-   📊 Nutrition tracking by meal and day

-   👤 User profile, dietary settings, dark mode

### Stretch Goals

-   🗞 Export lists (PDF/CSV)

-   🔁 Recurring meal planning & calendar sync

-   🔔 Notifications & reminders

-   🧪 Guided onboarding quizzes

-   🌍 Multi-language support

* * * * *

## Security & Data Handling
---------------------------

-   Passwords hashed using bcrypt

-   JWT for session security

-   Protected API routes via middleware

-   Only non-sensitive user data stored

* * * * *

## Database Models (MongoDB / Mongoose)
---------------------------------------

**User**

```js
`{
  email: String,
  passwordHash: String,
  preferences: Object,
  avatarUrl: String
}`
```

**Recipe**

```js
`{
  name: String,
  description: String,
  instructions: [String],
  nutritionInfo: Object,
  cuisine: String,
  userSubmitted: Boolean,
  createdByUserId: ObjectId
}`
```

**Ingredient**

```js
`{
  name: String,
  unit: String,
  defaultQuantity: Number,
  nutritionInfo: Object
}`
```

**MealPlan**

```js
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
```

**ShoppingList**

```js
`{
  userId: ObjectId,
  mealPlanId: ObjectId,
  createdAt: Date,
  items: [
    { ingredientId: ObjectId, quantity: Number, unit: String, purchased: Boolean }
  ]
}`
```

**FoodIntake**

```js
`{
  userId: ObjectId,
  recipeId: ObjectId,
  ingredientId: ObjectId,
  date: Date,
  quantity: Number,
  unit: String,
  nutritionSnapshot: Object
}`
```

* * * * *

## User Flow
------------

1.  Guests browse recipes before signing up

2.  Signup/Login → redirected to **dashboard**

3.  Dashboard allows:

    -   Meal planning (wizard + drag/drop)

    -   Viewing/editing meal plans

    -   Generating shopping lists

    -   Searching/adding recipes

    -   Tracking meals & nutrition

    -   Updating profile/settings

📍 [Full User Flow Diagram](https://github.com/KierstinS2024/Capstone2025/blob/main/UserFlowDiagram.md?utm_source=chatgpt.com)

* * * * *

🔨 Implementation Tasks
-----------------------

| Task | Description |
| --- | --- |
| Project Setup | Next.js scaffold, folder structure, MongoDB connection |
| Auth System | JWT + bcrypt, middleware for protected routes |
| Database Models | Mongoose schemas for all entities |
| API Routes | Next.js API CRUD routes for recipes, meal plans, shopping lists, intake |
| Frontend | React components, dashboard, meal planner, shopping list |
| State Management | Context API |
| Styling | CSS Modules, dark mode |
| Testing | Unit + integration tests for components & API |
| Deployment | Render or Vercel, environment variables configured |
| Documentation | Updated README.md, API docs, user flow |

* * * * *

🔗 API Overview (Next.js API Routes)
------------------------------------

**Authentication**

-   `POST /api/auth/register` → Register user

-   `POST /api/auth/login` → Login user & receive JWT

-   `GET /api/auth/me` → Get current user profile (JWT required)

-   `PUT /api/auth/me` → Update profile/preferences (JWT required)

**Recipes**

-   `GET /api/recipes` → List/search recipes

-   `GET /api/recipes/:id` → Get recipe by ID

-   `POST /api/recipes` → Create recipe (JWT required)

-   `PUT /api/recipes/:id` → Update user recipe (JWT required)

-   `DELETE /api/recipes/:id` → Delete user recipe (JWT required)

**Meal Plans**

-   `POST /api/meal-plans` → Create new meal plan

-   `GET /api/meal-plans` → List user's meal plans

-   `GET /api/meal-plans/:id` → Retrieve a plan by ID

-   `POST /api/meal-plans/:id/entries` → Add recipe to plan

-   `PUT /api/meal-plans/entries/:entryId` → Update entry

-   `DELETE /api/meal-plans/entries/:entryId` → Remove recipe from plan

**Shopping Lists**

-   `POST /api/shopping-lists` → Generate list from meal plan or manual

-   `GET /api/shopping-lists` → List user shopping lists

-   `GET /api/shopping-lists/:id` → Get list by ID

-   `POST /api/shopping-lists/:id/items` → Add item

-   `PATCH /api/shopping-lists/items/:itemId` → Update item

-   `DELETE /api/shopping-lists/items/:itemId` → Remove item

**Food Intake**

-   `POST /api/food-intake` → Log recipe/ingredient consumption

-   `GET /api/food-intake` → Get intake logs

-   `DELETE /api/food-intake/:id` → Remove intake entry

**Misc**

-   `GET /api/health` → Health check

* * * * *

📦 Example Requests
-------------------

**Register User**

```json
`POST /api/auth/register
{ "email": "sarah@example.com", "password": "myStrongPassword" }`
```

**Login User**

```json
`POST /api/auth/login
{ "email": "sarah@example.com", "password": "myStrongPassword" }`
```

**Create Recipe**

```json
`POST /api/recipes
Authorization: Bearer <JWT>
{ "name": "Chicken Stir Fry", "description": "Quick dinner", "cuisine": "Asian", "ingredients":[{ "id":"123","quantity":200,"unit":"grams" }] }`
```

**Generate Shopping List**

```json
`POST /api/shopping-lists
{ "mealPlanId": "456" }`
```
* * * * *

🚀 Deployment
-------------

1.  Push repository to GitHub

2.  Configure environment variables on **Render** or **Vercel**:

-   `MONGODB_URI`

-   `JWT_SECRET`

-   API keys

1.  Deploy frontend + backend (Next.js handles both)

* * * * *

📖 Story-Driven UX
------------------

*Sarah signs up → plans meals for the week → generates shopping list → logs nutrition → personalizes preferences.*

Demonstrates value of core features, drag-and-drop planner, and nutrition tracking.

> [Full Story Walkthrough](https://github.com/KierstinS2024/Capstone2025/blob/main/UserFlowDiagram.md?utm_source=chatgpt.com)
