# 🍽️ Recipe & Meal Planner App (Capstone Project)

A full-stack MERN application designed to help users simplify meal planning, manage grocery lists, and track nutrition through personalized recipes and intuitive weekly planners.

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
- MongoDB (Mongoose)

**Authentication**
- JWT (JSON Web Tokens)
- Passport.js

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

### User
- `_id` (ObjectId)
- `email` (String, unique, required)
- `passwordHash` (String, required)
- `preferences` (Object)
  - `dietType`, `allergies`, `calorieTarget`, etc.
- `avatarUrl` (String)
- `savedRecipes` (Array of ObjectId references)

### Recipe
- `_id` (ObjectId)
- `name` (String)
- `description` (String)
- `ingredients` (Array of Ingredient subdocuments)
- `instructions` (Array of strings)
- `nutrition` (Object)
  - `calories`, `protein`, `fat`, `carbs`
- `cuisine` (String)
- `userSubmitted` (Boolean)
- `createdBy` (User ObjectId, optional)

### Ingredient
- `_id` (ObjectId)
- `name` (String)
- `unit` (String)
- `defaultQuantity` (Number)
- `nutrition` (Object)
  - `calories`, `protein`, `fat`, `carbs`

### MealPlan
- `_id` (ObjectId)
- `userId` (ObjectId, required)
- `weekStartDate` (Date)
- `days` (Object)
  - `monday` → `{ breakfast: [], lunch: [], dinner: [], snacks: [] }`
  - `tuesday` → same structure …
- `notes` (String)

### ShoppingList
- `_id` (ObjectId)
- `userId` (ObjectId)
- `mealPlanId` (ObjectId)
- `items` (Array of objects)
  - `ingredientId`, `quantity`, `unit`, `purchased`

### FoodIntake
- `_id` (ObjectId)
- `userId` (ObjectId)
- `recipeId` (ObjectId)
- `date` (Date)
- `quantity` (Number)
- `nutritionSnapshot` (Object)

### Optional: PantryItem (Stretch Feature)
- `_id` (ObjectId)
- `userId` (ObjectId)
- `ingredientId` (ObjectId)
- `quantity`, `unit`, `expirationDate`

### Relationships
- One user → many meal plans, food logs, and shopping lists
- Many-to-many: Recipes ↔ Ingredients, MealPlans ↔ Recipes
- Shopping lists aggregate ingredients from meal plans

![Revised_CrowFoot_ERD](https://github.com/user-attachments/assets/f5e280a2-cc62-4b4c-8d9d-6af7d5be1f2c)


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

| Task               | Description                                     |
|--------------------|-------------------------------------------------|
| Database Design    | Define schema for users, recipes, meals, logs   |
| API Integration    | Connect to Spoonacular or Edamam                |
| Frontend Setup     | Scaffold Vite + React + Router                  |
| Backend Setup      | Create Express API with routes                  |
| Auth System        | JWT + Passport login/signup                     |
| Core Features      | Dashboard, planner, tracker, search             |
| Nutrition Engine   | Calculate macro totals per meal/day             |
| Stretch Features   | Reminders, recipe sharing, pantry, dark mode    |


