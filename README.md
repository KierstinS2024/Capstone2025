🍽️ Recipe & Meal Planner App (Capstone Project)
================================================

A full-stack application designed to help users simplify meal planning, manage grocery lists, and track nutrition through personalized recipes and intuitive weekly planners.

* * * * *

✅ Project Overview
------------------

This web application allows users to:

-   Discover recipes based on dietary needs or available ingredients

-   Create, customize, and save **one weekly meal plan per user**

-   Automatically generate categorized shopping lists

-   Track nutrition by logging daily food intake

-   Receive smart suggestions via the dashboard

* * * * *

🧰 Tech Stack
-------------

**Frontend**

-   React.js with Next.js App Router

-   React Context API for state management

-   CSS Modules for styling

-   Axios for API communication

-   Drag-and-drop via [`@hello-pangea/dnd`](https://www.npmjs.com/package/@hello-pangea/dnd)

**Backend**

-   Node.js + Next.js API routes

-   MongoDB with Mongoose for data modeling

**Authentication**

-   JWT (JSON Web Tokens)

-   bcrypt (for password hashing)

**External APIs**

-   [Spoonacular](https://spoonacular.com/food-api)

> ⚠️ *External API risks include usage limits, incomplete data, and restrictions on commercial use. A fallback strategy includes using static datasets or creating a custom API.*

**Deployment**

-   Frontend + Backend: Render

-   Version Control: GitHub

* * * * *

🌐 Platform
-----------

This is a **responsive web application**, optimized for both desktop and mobile browsers. No native app is planned at this stage.

* * * * *

🎯 Project Goals
----------------

To help users plan healthy meals efficiently while:

-   Accommodating dietary restrictions

-   Minimizing food waste

-   Saving time on shopping and prep

-   Tracking nutrition goals (macros, calories, etc.)

* * * * *

👥 Target Users
---------------

-   Busy professionals and parents

-   Health-conscious individuals

-   People with dietary restrictions (e.g., gluten-free, keto)

-   Fitness enthusiasts tracking macros

-   Beginners in meal prep

* * * * *

📆 Key Features
---------------

### Core

-   🔍 Recipe search & filtering by diet, ingredient, cuisine

-   🧠 Personalized suggestions based on preferences

-   🗓️ Drag-and-drop meal planner by day/meal (only one plan per user)

-   🛒 Auto-generated shopping lists, grouped by category

-   📊 Nutrition tracking by meal and day

-   👤 User profile, dietary settings

### Stretch Goals

-   🗞 Export lists (PDF/CSV)

-   🔁 Recurring meal planning & calendar sync

-   🔔 Notifications & reminders

* * * * *

🔐 Security & Data Handling
---------------------------

-   User passwords hashed using bcrypt

-   JWTs for session security

-   Secure user-only access to saved data

-   No sensitive financial or medical data stored

* * * * *

🧬 Database Schema (Mongoose / MongoDB)
---------------------------------------

![MongoDB_ERD](https://github.com/KierstinS2024/Capstone2025/blob/main/MongoDB_ERD.png)

This application leverages MongoDB with Mongoose to ensure flexible, document-based storage, while maintaining references between collections.

### User

-   `_id` (ObjectId)

-   `email` (String, unique, required)

-   `passwordHash` (String, required)

-   `preferences` (JSON, for dietary/calorie targets)

-   `createdAt` (Date)

-   `updatedAt` (Date)

### Recipe

-   `_id` (ObjectId)

-   `name` (String, required)

-   `description` (String)

-   `instructions` (Array of strings or JSON for ordered steps)

-   `nutritionInfo` (JSON: calories, protein, fat, carbs)

-   `cuisine` (String)

-   `userSubmitted` (Boolean, default: false)

-   `createdBy` (ObjectId reference to User, optional)

-   `createdAt`, `updatedAt` (Date)

### Ingredient

-   `_id` (ObjectId)

-   `name` (String, required)

-   `unit` (String, e.g., 'grams', 'ml', 'pcs')

-   `defaultQuantity` (Number)

-   `nutritionInfo` (JSON: calories, protein, fat, carbs per unit)

### RecipeIngredient (Embedded in Recipe or as a Sub-collection)

-   `ingredientId` (ObjectId reference to Ingredient)

-   `quantity` (Number)

-   `unit` (String)

### MealPlan

-   `_id` (ObjectId)

-   `userId` (ObjectId reference to User, required)

-   `weekStartDate` (Date, Monday of the week)

-   `notes` (String)

-   Only **one meal plan per user**

### MealPlanEntry (Embedded in MealPlan)

-   `recipeId` (ObjectId reference to Recipe)

-   `dayOfWeek` (String: 'monday', 'tuesday', etc.)

-   `mealType` (String: 'breakfast', 'lunch', 'dinner', 'snack')

-   `servings` (Number)

### ShoppingList

-   `_id` (ObjectId)

-   `userId` (ObjectId reference to User)

-   `mealPlanId` (ObjectId reference to MealPlan, optional)

-   `createdAt` (Date)

-   `items` (Array of embedded ShoppingListItem)

### ShoppingListItem

-   `ingredientId` (ObjectId reference to Ingredient)

-   `quantity` (Number)

-   `unit` (String)

-   `purchased` (Boolean, default: false)

### FoodIntake

-   `_id` (ObjectId)

-   `userId` (ObjectId reference to User)

-   `recipeId` (ObjectId reference to Recipe, optional)

-   `ingredientId` (ObjectId reference to Ingredient, optional)

-   `date` (Date)

-   `quantity` (Number)

-   `unit` (String)

-   `nutritionSnapshot` (JSON: actual nutrition consumed)

* * * * *

🔄 User Flow
------------

The app follows a logical, intuitive flow:

-   Users sign up/login and land on the **dashboard**

-   From the dashboard, they can:

    -   Plan meals for the week

    -   View the existing meal plan

    -   Generate a shopping list

    -   Search recipes or add custom recipes

    -   Log meals and track nutrition

    -   Adjust profile/settings

📍 **User Flow Diagram**\
[View Full Diagram](https://github.com/KierstinS2024/Capstone2025/blob/main/UserFlowDiagram.md)

* * * * *

📖 Story-Driven UX
------------------

Example: Sarah signs up, creates her weekly meal plan, generates a shopping list, logs her meals, and monitors nutrition. This walkthrough illustrates each major feature and its value.

> [📖 See Full Story Walkthrough](https://github.com/KierstinS2024/Capstone2025/blob/main/UserFlowDiagram.md)

* * * * *

🔨 Tasks Breakdown
------------------

| Task                | Description                                      |
| --- | --- |
| Database Design    | Define Mongoose schemas for users, recipes, meals, logs  |
| API Helpers        | Create API helper functions for Axios requests  |
| Frontend Setup      | Scaffold Next.js App Router + React + Context API |
| Backend Setup      | Create Next.js API routes (src/app/api/**/route.ts) |
| Auth System        | JWT + bcrypt login/signup                      |
| Core Features      | Dashboard, planner, nutrition tracker, recipe search |
| Nutrition Engine    | Calculate macro totals per meal/day              |
| Stretch Features    | Drag-and-drop, notifications, pantry management |

* * * * *

🔌 API Specification
--------------------

All endpoints are implemented as **Next.js API routes** under `src/app/api/**/route.ts`.

### Authentication

-   `POST /api/auth/signup` → Registers a new user

-   `POST /api/auth/login` → Logs in a user, returns JWT

-   `GET /api/auth/me` → Current user profile (requires token)

-   `PUT /api/auth/me` → Update user profile/preferences (requires token)

### Recipes

-   `GET /api/recipes` → Browse/search recipes

-   `GET /api/recipes/:id` → Retrieve a single recipe

-   `POST /api/recipes` → Create a recipe (requires token)

-   `PUT /api/recipes/:id` → Update a recipe (requires token)

-   `DELETE /api/recipes/:id` → Delete a recipe (requires token)

### Meal Planning

-   `POST /api/meal-plans` → Create weekly meal plan (requires token)

-   `GET /api/meal-plans` → Get current user's meal plan (requires token)

-   `GET /api/meal-plans/:id` → Retrieve meal plan by ID (requires token)

-   `POST /api/meal-plans/:id/entries` → Add recipe to day/meal slot (requires token)

-   `PUT /api/meal-plans/entries/:entryId` → Update plan entry (requires token)

-   `DELETE /api/meal-plans/entries/:entryId` → Remove recipe from plan (requires token)

### Shopping Lists

-   `POST /api/shopping-lists` → Generate list from meal plan (requires token)

-   `GET /api/shopping-lists` → List user's shopping lists (requires token)

-   `GET /api/shopping-lists/:id` → Retrieve shopping list by ID (requires token)

-   `POST /api/shopping-lists/:id/items` → Add item manually (requires token)

-   `PATCH /api/shopping-lists/items/:itemId` → Update quantity/purchased (requires token)

-   `DELETE /api/shopping-lists/items/:itemId` → Remove item (requires token)

### Food Intake

-   `POST /api/food-intake` → Log consumed recipe/ingredient (requires token)

-   `GET /api/food-intake` → Retrieve logs (query by date) (requires token)

-   `DELETE /api/food-intake/:id` → Remove log entry (requires token)

### Misc

-   `GET /api/health` → Returns "OK"

-   `GET /` → Optional landing/welcome route

* * * * *

📦 Example Requests & Responses
-------------------------------

### Register User

**POST /api/auth/signup**

Request:

`{ "email": "sarah@example.com", "password": "myStrongPassword" }`

Success (201):

`{ "message": "User registered successfully" }`

Error (400):

`{ "error": "Email is already in use" }`

* * * * *

### Login User

**POST /api/auth/login**

Request:

`{ "email": "sarah@example.com", "password": "myStrongPassword" }`

Success (200):

`{ "token": "eyJhbGci..." }`

Error (400):

`{ "error": "Invalid login credentials" }`

* * * * *

### Create Recipe

**POST /api/recipes**

Request (Authorization: Bearer <JWT>):

`{
  "name": "Chicken Stir Fry",
  "description": "Quick dinner",
  "cuisine": "Asian",
  "ingredients":[
    { "id":"64f9b3...", "quantity":200, "unit":"grams" }
  ]
}`

Success (201):

`{ "message":"Recipe created", "recipeId":"64fa1c..." }`

* * * * *

### Create Meal Plan

**POST /api/meal-plans**

Request:

`{ "weekStartDate":"2025-03-03", "notes":"Meal prep week" }`

Success (201):

`{ "mealPlanId":"64fa2b...", "message": "Meal plan created" }`

* * * * *

### Generate Shopping List

**POST /api/shopping-lists**

Request:

`{ "mealPlanId": "64fa2b..." }`

Success (201):

`{ "listId":"64fa3d...", "message":"Shopping list generated" }`

* * * * *

### Log Food Intake

**POST /api/food-intake**

Request (Authorization: Bearer <JWT>):

`{ "recipeId":"64fa1c...", "date":"2025-03-04","quantity":1,"unit":"serving" }`

Success (201):

`{ "message":"Intake logged" }`

> Note: Any route marked "Requires token" expects a header formatted as:\
> `Authorization: Bearer <your-JWT-token-here>`


✅ Rubric Alignment
------------------

This project was developed following the Capstone rubric requirements. Below is a breakdown of how each requirement was addressed:

| **Requirement** | **Implementation in This Project** |
| --- | --- |
| **Project structure & folder organization** | The project uses the Next.js App Router structure (`src/app`) with clearly defined directories for API routes, pages, components, contexts, hooks, lib helpers, models, styles, and types. This keeps both backend and frontend logic well-organized and modular. |
| **CRUD operations for MongoDB** | All CRUD functionality is implemented using **Mongoose** models (`User`, `Recipe`, `MealPlan`, `ShoppingList`) with corresponding RESTful API routes under `src/app/api/**/route.ts`. Users can create, read, update, and delete recipes, meal plans, and shopping list items. |
| **Data handling (REST or GraphQL)** | The app uses **RESTful API routes** built into Next.js to handle data logic. |
| **Authentication & Authorization** | A custom **email + password authentication** system is implemented. Passwords are hashed with bcrypt. JWT tokens are issued upon login/signup and stored in cookies. `middleware.ts` protects all authenticated routes (`/dashboard`, `/meal-plans`, `/shopping-list`, `/recipes`). |
| **UI Components & Layout (React)** | The UI is built with React components, including forms, cards, modals, sidebars, and drag-and-drop meal plan editors. Pages are rendered through Next.js routing with a shared layout. |
| **Backend integration** | All UI components interact with the backend through centralized helper functions in `/lib` and shared state via React Contexts (`AuthContext`, `MealPlanContext`, `RecipeContext`, `ShoppingListContext`). |
| **State Management** | Implemented using the React Context API and custom hooks to manage authentication, recipes, meal plans, and shopping lists. |
| **Styling** | All styling is done with **CSS Modules and plain CSS** in `/styles`. No Tailwind or external styling frameworks are used. |
| **Testing** | Formal unit/integration tests have not been implemented yet. Functionality has been verified manually during development. |
| **Debugging & Fixes** | The app was developed iteratively, with issues resolved throughout each build step (types, models, API routes, contexts, UI). |
| **Deployment** | The app is ready to be deployed to platforms like Vercel or Render. Environment variables are configured for MongoDB connection and JWT secret. |
| **Documentation** | The repository includes: |

-   A fully updated **README**

-   A clear **User Flow Diagram**

-   Clean, organized code structure following the planned data model and API architecture. |\
    | **Submission / PR** | The project can be submitted by opening a Pull Request from `dev` into `main` without merging, per rubric instructions. |