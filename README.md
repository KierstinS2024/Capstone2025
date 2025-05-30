# 🍽️ Recipe & Meal Planner App (Capstone Project)

A full-stack application designed to help users simplify meal planning, manage grocery lists, and track nutrition through personalized recipes and intuitive weekly planners.

---

## ✅ Project Overview

This web application allows users to:
- Discover recipes based on dietary needs or available ingredients
- Create, customize, and save weekly meal plans
- Automatically generate categorized shopping lists
- Track nutrition by logging daily food intake
- Receive smart suggestions and motivational nudges via the dashboard

---

## 🧰 Tech Stack

**Frontend**
- React.js with Vite
- React Router
- Custom CSS with dark mode toggle
- Axios for API communication

**Backend**
- Node.js + Express
- PostgreSQL (for relational data storage)

**Authentication**
- JWT (JSON Web Tokens)
- bcrypt (for password hashing)

**External APIs**
- [Spoonacular](https://spoonacular.com/food-api)
- [Edamam](https://developer.edamam.com/)
- [Open Food Facts](https://world.openfoodfacts.org/data)

> ⚠️ *External API risks include usage limits, incomplete data, and restrictions on commercial use. A fallback strategy includes using static datasets or creating a custom API.*

**Deployment**
- Frontend + Backend: Render
- Version Control: GitHub

---

## 🌐 Platform

This will be a **responsive web application**, optimized for both desktop and mobile browsers. No native app is planned at this stage.

---

## 🎯 Project Goals

To help users plan healthy meals efficiently while:
- Accommodating dietary restrictions
- Minimizing food waste
- Saving time on shopping and prep
- Tracking nutrition goals (macros, calories, etc.)

---

## 👥 Target Users

- Busy professionals and parents
- Health-conscious individuals
- People with dietary restrictions (e.g., gluten-free, keto)
- Fitness enthusiasts tracking macros
- Beginners in meal prep

---

## 📆 Key Features

### Core
- 🔍 Recipe search & filtering by diet, ingredient, cuisine
- 🧠 Personalized suggestions based on preferences
- 🗓️ Drag-and-drop meal planner by day/meal
- 🛒 Auto-generated shopping lists, grouped by category
- 🥑 Pantry-aware recommendations
- 📊 Nutrition tracking by meal and day
- 👤 User profile, dietary settings, dark mode

### Stretch Goals
- 🗞 Export lists (PDF/CSV)
- 🔁 Recurring meal planning & calendar sync
- 🔔 Notifications & reminders
- 🧪 Quizzes or guided onboarding
- 🌍 Multi-language support

---

## 🔐 Security & Data Handling

- User passwords hashed using bcrypt
- JWTs for session security
- Secure user-only access to saved data
- No sensitive financial or medical data stored

---

## 🧬 Database Schema (Detailed)

![Revised_CrowFoot_ERD](https://github.com/user-attachments/assets/366bb82c-5a73-4133-b378-f8c16baeff87)


This application leverages a relational database (PostgreSQL) to ensure data integrity, consistency, and efficient querying of complex relationships.

### User
- `id` (Primary Key, e.g., UUID or Integer)
- `email` (String, unique, required)
- `password_hash` (String, required)
- `preferences` (JSONB, for flexible dietary/calorie targets)
- `avatar_url` (String)

### Recipe
- `id` (Primary Key)
- `name` (String, required)
- `description` (String)
- `instructions` (TEXT[], array of strings or JSONB for ordered steps)
- `nutrition_info` (JSONB, containing calories, protein, fat, carbs)
- `cuisine` (String)
- `user_submitted` (Boolean, default: false)
- `created_by_user_id` (Foreign Key to User.id, optional)

### Ingredient
- `id` (Primary Key)
- `name` (String, required)
- `unit` (String, e.g., 'grams', 'ml', 'pcs')
- `default_quantity` (Numeric)
- `nutrition_info` (JSONB, containing calories, protein, fat, carbs per unit)

### RecipeIngredient (Join Table for Many-to-Many: Recipe ↔ Ingredient)
- `recipe_id` (Foreign Key to Recipe.id)
- `ingredient_id` (Foreign Key to Ingredient.id)
- `quantity` (Numeric, amount of this ingredient in this recipe)
- `unit` (String, unit for this specific ingredient in this recipe)
- Primary Key: (`recipe_id`, `ingredient_id`)

### MealPlan
- `id` (Primary Key)
- `user_id` (Foreign Key to User.id, required)
- `week_start_date` (Date, e.g., Monday of the week)
- `notes` (String)

### MealPlanEntry (Join Table for Many-to-Many: MealPlan ↔ Recipe)
- `id` (Primary Key)
- `meal_plan_id` (Foreign Key to MealPlan.id)
- `recipe_id` (Foreign Key to Recipe.id)
- `day_of_week` (String, e.g., 'monday', 'tuesday')
- `meal_type` (String, e.g., 'breakfast', 'lunch', 'dinner', 'snack')
- `servings` (Numeric, number of servings of the recipe in this meal slot)
- Primary Key: (`id`)

### ShoppingList
- `id` (Primary Key)
- `user_id` (Foreign Key to User.id, required)
- `meal_plan_id` (Foreign Key to MealPlan.id, optional, if generated from a specific plan)
- `created_at` (Timestamp)

### ShoppingListItem (One-to-Many: ShoppingList ↔ Item)
- `id` (Primary Key)
- `shopping_list_id` (Foreign Key to ShoppingList.id)
- `ingredient_id` (Foreign Key to Ingredient.id)
- `quantity` (Numeric)
- `unit` (String)
- `purchased` (Boolean, default: false)
- Primary Key: (`id`)

### FoodIntake
- `id` (Primary Key)
- `user_id` (Foreign Key to User.id, required)
- `recipe_id` (Foreign Key to Recipe.id, optional, if logging a recipe)
- `ingredient_id` (Foreign Key to Ingredient.id, optional, if logging a single ingredient)
- `date` (Date, or Timestamp)
- `quantity` (Numeric, amount consumed)
- `unit` (String, unit of quantity consumed)
- `nutrition_snapshot` (JSONB, actual nutrition for the consumed portion)

### Optional: PantryItem (Stretch Feature)
- `id` (Primary Key)
- `user_id` (Foreign Key to User.id, required)
- `ingredient_id` (Foreign Key to Ingredient.id, required)
- `quantity` (Numeric)
- `unit` (String)
- `expiration_date` (Date)
- Primary Key: (`id`)

---

## 🔄 User Flow

The app follows a logical, intuitive flow:
- Guests can browse recipes before signing up
- After signup/login, users land on the **dashboard**
- From the dashboard, they can:
  - Plan meals (via wizard)
  - View existing plans
  - Generate a shopping list
  - Search recipes or add custom ones
  - Track meals and nutrition
  - Adjust profile/settings
- Users log food and monitor goals via the **nutrition tracker**

📍 **User Flow Diagram**  
[View Full Diagram](https://github.com/KierstinS2024/Capstone2025/blob/main/UserFlowDiagram.md)

---

## 📖 Story-Driven UX

I found it more engaging to pretend someone was using the app: Sarah signs up, plans meals, shops, logs nutrition, and personalizes her experience, illustrating each major feature and its value.

> [📖 See Full Story Walkthrough](https://github.com/KierstinS2024/Capstone2025/blob/main/UserFlowDiagram.md)

---

## 🔨 Tasks Breakdown

| Task               | Description                                     |
|--------------------|-------------------------------------------------|
| Database Design    | Define schema for users, recipes, meals, logs   |
| API Integration    | Connect to Spoonacular or Edamam                |
| Frontend Setup     | Scaffold Vite + React + Router                  |
| Backend Setup      | Create Express API with routes                  |
| Auth System        | JWT + bcrypt login/signup                     |
| Core Features      | Dashboard, planner, tracker, search             |
| Nutrition Engine   | Calculate macro totals per meal/day             |
| Stretch Features   | Reminders, recipe sharing, pantry, dark mode    |
