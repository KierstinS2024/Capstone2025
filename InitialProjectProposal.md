---Initial Project Ideas---
First Capstone Project Ideas:
-----------------------------------------------------------------------------------------------------------------------------------------------------------

 Mandarin Chinese Language Learning App (Most Interested)
------------------------------------------------------------------------------------------------------------------------------------------------------------
**Problem**: 

Learning Mandarin Chinese is particularly difficult due to its tonal nature, unique characters, and complex grammar rules. Many learners struggle with pronunciation, remembering vocabulary, and understanding sentence structure. There is a lack of comprehensive, interactive platforms that integrate all aspects of language learning—speaking, listening, reading, and writing—into a unified experience.

**Solution**: 

The app will provide a holistic language learning experience by focusing on vocabulary, pronunciation, grammar, and character recognition. The app will integrate spaced repetition for vocabulary retention, audio clips for pronunciation practice, quizzes for grammar reinforcement, and tools to help users recognize and understand Chinese characters. A personalized learning path will help users track their progress and improve at their own pace.

**Potential APIs**:

Google Cloud Speech API: To provide real-time pronunciation feedback by recognizing the user’s voice and comparing it to native Mandarin pronunciation.

MDBG or CC-CEDICT API: To access Mandarin word definitions, example sentences, and translations.

Mandarin Chinese Audio API (like FluentU): For native speaker audio clips that users can listen to and mimic for pronunciation practice.

Chinese Character Recognition API (like OCR or Google Vision): To help users recognize characters by providing real-time identification and explanations when they scan or input Chinese characters.

------------------------------------------------------------------------------------------------------------------------------------------------------------

 Outdoorsy App (Similar to AllTrails)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------
**Problem**: 

Outdoor enthusiasts often find it difficult to locate suitable trails based on their preferences, such as difficulty level, activity type (hiking, biking, etc.), and geographic location. Furthermore, many existing resources don’t provide enough user-generated content or real-time updates on trail conditions, leaving outdoor adventurers with incomplete or unreliable information.

**Solution**: 

The app will offer a comprehensive platform for discovering and reviewing outdoor trails, including maps, user reviews, ratings, and photos. It will provide users with trail difficulty levels, location-based searches, and suggestions based on personal preferences. Community-driven content (like photos, reviews, and updates) will ensure the app remains current and relevant. Users can save trails, share experiences, and track their outdoor activity history.

**Potential APIs**:

Google Maps API: To provide mapping features, location tracking, and geospatial data for trails.

Trail API (like Open Trails API or Mapbox): For detailed trail data, including trail length, difficulty, and geographic information.

Weather API (like OpenWeather or AccuWeather): To provide weather forecasts and real-time conditions for trails.

Strava API: To allow users to log their outdoor activities (e.g., hikes or bike rides) and share them with the app’s community.

------------------------------------------------------------------------------------------------------------------------------------------------------------------

Recipe & Meal Planner App
------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Problem**: 

Meal planning can be time-consuming, especially for individuals with dietary restrictions, time constraints, or limited knowledge of healthy food options. People often struggle to find recipes that fit their specific nutritional goals and end up wasting time on grocery shopping or meal prep.

**Solution**: 

This app will offer personalized meal planning and recipe recommendations based on the user’s preferences, dietary restrictions, and nutritional goals. It will allow users to save and organize recipes, create shopping lists, and plan meals for the week. Users can input their available ingredients to get recipe suggestions, and the app will provide nutritional information for each meal. It will also allow users to track their food intake and ensure they meet their dietary goals.

**Potential APIs**:

Spoonacular API: For recipe suggestions, nutritional information, and ingredient data.

Edamam API: For nutritional analysis and food database access.

Open Food Facts API: To get detailed data on food products and ingredients, especially for barcode scanning.

TheMealDB API: For a database of meal recipes with categories, ingredient lists, and meal photos.
---

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

> ⚠️ _External API risks include usage limits, incomplete data, and restrictions on commercial use. A fallback strategy includes using static datasets or creating a custom API._

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

| Task                | Description                                      |
| ------------------- | ------------------------------------------------ |
| Database Design     | Define schema for users, recipes, meals, logs    |
| API Integration     | Connect to Spoonacular or Edamam                 |
| Frontend Setup      | Scaffold Vite + React + Router                   |
| Backend Setup       | Create Express API with routes                   |
| Auth System         | JWT + bcrypt login/signup                        |
| Core Features       | Dashboard, planner, tracker, search              |
| Nutrition Engine    | Calculate macro totals per meal/day              |
| Stretch Features    | Reminders, recipe sharing, pantry, dark mode     |

API Specification (tentative) -- Recipe & Meal Planner App

Planned RESTful API endpoints for the backend service. These routes represent how the frontend communicates with the backend of this application.

---

Authentication

- POST /auth/register → Registers a new user. (No authentication required)

- POST /auth/login → Logs in a user and returns a JWT token. (No authentication required)

- GET /me → Gets current user profile/details. (Requires token)

- PUT /me → Updates user profile/preferences. (Requires token)

---

Recipes

- GET /recipes → Browse/search recipes (supports filtering with query parameters). (No authentication required)

- GET /recipes/:id → Retrieve a single recipe by ID. (No authentication required)

- POST /recipes → Create/submit a new recipe. (Requires token)

- PUT /recipes/:id → Update a recipe created by the user. (Requires token)

- DELETE /recipes/:id → Delete a recipe created by the user. (Requires token)

---

Meal Planning

- POST /meal-plans → Create a new weekly meal plan. (Requires token)

- GET /meal-plans → List meal plans created by the current user. (Requires token)

- GET /meal-plans/:id → Retrieve a specific meal plan by ID. (Requires token)

- POST /meal-plans/:id/entries → Add a recipe to a day/meal slot in a plan. (Requires token)

- PUT /meal-plans/entries/:entryId → Update a plan entry (servings, day, etc.). (Requires token)

- DELETE /meal-plans/entries/:entryId → Remove a recipe from a plan. (Requires token)

---

Shopping Lists

- POST /shopping-lists → Generate a list from a meal plan or create one manually. (Requires token)

- GET /shopping-lists → List shopping lists for the user. (Requires token)

- GET /shopping-lists/:id → Retrieve a single shopping list by ID. (Requires token)

- POST /shopping-lists/:id/items → Manually add an item to a list. (Requires token)

- PATCH /shopping-lists/items/:itemId → Update quantity or mark item as purchased. (Requires token)

- DELETE /shopping-lists/items/:itemId → Remove an item from the list. (Requires token)

---

Nutrition / Food Intake

- POST /food-intake → Log a consumed recipe/ingredient for a date. (Requires token)

- GET /food-intake → Retrieve logged food intake (supports query by date). (Requires token)

- DELETE /food-intake/:id → Remove a logged intake entry. (Requires token)

---

General / Misc

- GET /health → Health check endpoint -- returns "OK".

- GET / → Optional landing or welcome route.

---

Example Requests & Responses

Register User\
(POST /auth/register)

Request\
{ "email": "sarah@example.com", "password": "myStrongPassword" }

Success Response (201)\
{ "message": "User registered successfully" }

Error Response (400)\
{ "error": "Email is already in use" }

---

Login User\
(POST /auth/login)

Request\
{ "email": "sarah@example.com", "password": "myStrongPassword" }

Success (200)\
{ "token": "eyJhbGci..." }

Error (400)\
{ "error": "Invalid login credentials" }

---

Create Recipe\
(POST /recipes)

Request\
Authorization: Bearer <JWT>\
{ "name": "Chicken Stir Fry", "description": "Quick dinner", "cuisine": "Asian", "ingredients":[{ "id":1,"quantity":200,"unit":"grams" }] }

Success (201)\
{ "message":"Recipe created", "recipeId":42 }

---

Create Meal Plan\
(POST /meal-plans)

Request\
{ "week_start_date":"2025-03-03", "notes":"Meal prep week" }

Success (201)\
{ "mealPlanId": 23, "message": "Meal plan created" }

---

Generate Shopping List\
(POST /shopping-lists)

Request\
{ "meal_plan_id": 23 }

Success (201)\
{ "listId":14, "message":"Shopping list generated" }

---

Log Food Intake\
(POST /food-intake)

Request\
Authorization: Bearer <JWT>\
{ "recipe_id":42,"date":"2025-03-04","quantity":1,"unit":"serving" }

Success (201)\
{ "message":"Intake logged" }

---

Note: Any route marked "Requires token" expects a header formatted as:\
Authorization: Bearer <your-JWT-token-here>

---Initial User Flow---

# User Flow Diagram

![REVISED_UserFlowDiagram](https://github.com/user-attachments/assets/db6c3b87-e505-4975-9f42-0f6f41bd5676)

## [1] Landing Page

- Explore as Guest
  - View sample recipes (read-only)
  - Option to preview meal planner (limited functionality)
- Sign Up
  - Enter email, password, dietary preferences
  - Option: Sign up with Google
  - Receive confirmation email → Verify → Login
- Log In
  - Enter email & password → Redirect to Dashboard
  - Option: Log in with Google

## [2] User Dashboard (after login)

- Overview Panel
  - Quick preview of today’s meals, pending groceries, and nutrition summary
  - Notification for meal log or grocery reminders
- View Profile
  - Edit dietary preferences (e.g., vegan, gluten-free)
  - Upload/change profile photo
- Create New Meal Plan
  - Launch Meal Plan Wizard
  - Select week (Mon–Sun)
  - Meal selection for each day (breakfast, lunch, dinner, snacks)
  - Option: Auto-fill meals or drag-and-drop for customization
  - Adjust serving sizes, use dietary filters
  - Save meal plan → Redirect to Dashboard
- View Existing Meal Plans
  - List of saved plans with options to edit, delete, or clone
- Generate Shopping List
  - Pull ingredients from current meal plan
  - Group ingredients by category (produce, dairy, grains, etc.)
  - Editable quantities, mark as purchased
  - Option to print/export (PDF, CSV)
- Search Recipes
  - Filter by ingredient, dietary preference, cuisine, etc.
  - View recipe cards → Click for details
- Saved Recipes
  - View all saved favorites
  - **Add Your Own Recipe**
    - Input recipe name, ingredients, instructions
    - Enter nutritional info (manual or autofill option)
    - Save and add to Saved Recipes or Meal Plan
- Track Nutrition (Food Intake)
  - Log consumed meals (select from planned recipes or manual entry)
  - Autofill nutrition info for selected meals
  - View daily nutrition summary (calories, protein, carbs, fat)
- Settings
  - Change password
  - Set notification preferences (meal logging, grocery reminders)
  - Toggle Dark Mode
- Log Out

## [3] Recipe Details Page

- Ingredients List
- Step-by-Step Instructions
  - Cooking Mode (Fullscreen, one step at a time)
- Nutritional Info (calories, macros)
- Save to Profile (favorite recipe)
- Add to Meal Plan

## [4] Meal Plan Wizard (Step-by-Step Flow)

- Select Week (Mon–Sun)
- For Each Day:
  - Choose Breakfast Recipe(s)
  - Choose Lunch Recipe(s)
  - Choose Dinner Recipe(s)
  - Add Optional Snacks
- AI-Based Recipe Recommendations (based on profile preferences)
- Adjust Serving Sizes
- Save Plan → Redirect to Dashboard

## [5] Generate Shopping List

- Based on Selected Meal Plan
- Group Ingredients by Category (e.g., Produce, Dairy, Grains)
- Editable Quantities (adjust portion sizes)
- Mark Items as Purchased
- Option to Print or Export (PDF/CSV)

## [6] Nutrition Tracker

- Daily Logging
  - Select Meal(s) Eaten (from meal plan or manual entry)
  - Autofill Nutrition Info for Selected Meals
- View Nutrition Summary
  - Calories, Protein, Carbs, Fats
  - Compare with Daily Goals (user-set)
- View Weekly/Monthly Progress
  - Line charts or bar graphs for trends
  - Option to update and set custom nutrition goals (calories, macros)

---

# 📖 Story-Driven Walkthrough

## Chapter 1: The Discovery – Landing Page

It’s the first time Sarah visits the Recipe & Meal Planner App. She’s not sure if it’s right for her yet, so she chooses to explore as a guest. Instantly, she’s greeted with a sample recipe gallery, showcasing delicious dishes that catch her eye. A banner invites her to try out the meal planner, but she’s still unsure, so she takes a peek at the meal options without signing up.  
A few days later, intrigued by the meal ideas, Sarah decides to sign up. She enters her email, password, and a few dietary preferences like "vegetarian" and "low-carb." After a quick confirmation email, she verifies her account and is ready to go. With a click, Sarah logs in and is welcomed to the dashboard where everything she needs is just a few clicks away.

## Chapter 2: Personalized Space – User Dashboard

As Sarah enters her dashboard, she’s immediately greeted with a quick overview of her day: what she has for breakfast, lunch, dinner, and even snacks. She can see pending groceries she still needs to buy and track her daily nutrition summary—calories, protein, and macros all in one place.  
Her first task: Sarah clicks on View Profile to edit her preferences. She updates her dietary restrictions, uploads a new profile photo, and adjusts her settings so that she gets meal reminders and grocery notifications. Now, it’s time for Sarah to plan her meals.

## Chapter 3: Building the Perfect Plan – Meal Plan Wizard

She starts with the Create New Meal Plan button. This launches the Meal Plan Wizard, where Sarah chooses a week (Monday through Sunday) to begin planning. For each day, she selects what she wants for breakfast, lunch, dinner, and even snacks. She enjoys how easy it is to drag and drop meals into place, and the app even recommends meals based on her dietary preferences (e.g., vegan recipes). She adjusts portion sizes for some meals to meet her calorie goals, and once everything is set, Sarah clicks Save Plan.  
Her plan is now live, and she’s ready to proceed with the next step.

## Chapter 4: Grocery Shopping Made Easy – Shopping List

Next, Sarah decides to generate her Shopping List. With one click, the app pulls all the ingredients she needs from her newly created meal plan. Ingredients are neatly organized by category: produce, dairy, grains, and more. Sarah loves the flexibility to edit quantities—she can adjust based on what she already has at home.  
Before heading to the store, she checks off the items she already has, and the list is editable for any changes. Once everything’s perfect, she prints the list in PDF format and heads to the store.

## Chapter 5 (Revised): Discovering and Creating Recipes – Recipe Search & Add Your Own

Sarah loves exploring new recipes, but she also has a few of her own favorites that she’s been making for years. After browsing through the Recipe Search section and discovering some new ideas, Sarah decides to add one of her own signature dishes to the app.  
She navigates to the Add Recipe section, where she can input the name, ingredients, and step-by-step instructions for her recipe. The app also asks her to input the nutritional information (calories, protein, carbs, fats) so she can track the recipe’s nutrition. If she doesn’t know the exact breakdown, the app provides a helpful tool to estimate the nutrition based on the ingredients she’s listed.  
Once Sarah has entered all the details, she clicks Save Recipe. The app now adds her recipe to her Saved Recipes and makes it available for use in her Meal Plan Wizard, allowing her to select it just like any other recipe.

## Chapter 6: Cooking and Tracking – Recipe Details Page & Nutrition Tracker

On the Recipe Details Page, Sarah sees the ingredients she needs and the step-by-step instructions. The app also provides the nutritional information: calories, protein, carbs, and fats—everything she needs for her nutrition goals.  
After cooking her meals, she uses the Track Nutrition feature. She selects the meal she’s eaten from her meal plan and logs it. The app autofills the nutrition details, so Sarah doesn’t have to worry about tracking calories or macros manually. She checks her daily summary to see how close she is to meeting her goals.

## Chapter 7: Revisiting and Refining – Saved Recipes & Meal Plans

Sarah returns to her Saved Recipes section and revisits some of her favorite meals. She decides to add a few to her Meal Plan for next week. It’s easy to browse her collection, add new meals, and adjust her plan as needed.  
She also likes to revisit her existing meal plans to see how they’re working for her. With options to edit, delete, or clone her plans, Sarah can quickly adjust her weekly meals to stay on track.

## Chapter 8: Customizing Experience – Settings & Preferences

When Sarah wants to make changes to her account, she heads to Settings. Here, she can update her password, set notification preferences for meal logging or grocery reminders, and toggle the dark mode for a more comfortable experience.

## Chapter 9: Reaching Her Goals – Nutrition Tracker (Weekly/Monthly Progress)

A few weeks in, Sarah is curious about her progress. She checks out her weekly and monthly nutrition trends. Visual charts show her calories, protein, carbs, and fats over time, and she can see how close she is to meeting her custom goals. She sets new goals for the next month and is excited to continue her meal planning journey.

## Chapter 10: The Journey Continues

Sarah is now fully engaged with the app. From meal planning, shopping lists, recipe discovery, and nutrition tracking, she has everything she needs to make smarter choices and stay on track. With notifications, personalized meal suggestions, and a streamlined workflow, Sarah is excited to keep cooking, eating healthy, and achieving her goals.

**End of Story.**
