# User Flow Diagram

![REVISED_UserFlowDiagram](https://github.com/user-attachments/assets/db6c3b87-e505-4975-9f42-0f6f41bd5676)

## [1] Landing Page

- **Explore as Guest**

  - View sample recipes (read-only, fetched from Spoonacular)

  - Option to preview the meal planner (limited demo, no save/export)

- **Sign Up**

  - Enter email, password, dietary preferences

  - Option: Sign up with Google

  - Receive confirmation email → Verify → Login

- **Log In**

  - Enter email & password → Redirect to Dashboard

  - Option: Log in with Google

---

## [2] User Dashboard (after login)

- **Overview Panel**

  - Quick preview of this week's meal plan

  - Pending shopping list items

  - Notifications for expiring meal plans or grocery reminders

- **View Profile**

  - Edit dietary preferences (vegan, keto, gluten-free, etc.)

  - Upload/change profile photo

- **Create New Meal Plan**

  - Launch Meal Plan Wizard (see [4])

  - Save meal plan → Redirect to Dashboard

- **View Existing Meal Plans**

  - List of saved plans with options to edit, delete, or clone

- **Generate Shopping List**

  - Pulls ingredients from the current meal plan

  - Groups items by category (produce, dairy, pantry, etc.)

  - Editable quantities, mark as purchased

  - Export as PDF/CSV

- **Search Recipes (Spoonacular API)**

  - Filter by ingredient, dietary preference, cuisine, or keyword

  - View recipe cards → Click for details

- **Saved Recipes**

  - View and manage all saved favorites

  - **Add Your Own Recipe**

    - Input recipe name, ingredients, instructions

    - (Optional) Upload image

    - Save → Recipe available in Saved Recipes & Meal Plan Wizard

- **Settings**

  - Change password

  - Manage notifications (e.g., grocery reminders)

  - Toggle Dark Mode

- **Log Out**

---

## [3] Recipe Details Page

- Ingredients list

- Step-by-step instructions

- Optional notes (e.g., prep tips)

- Save to Profile (favorite recipe)

- Add to Meal Plan

---

## [4] Meal Plan Wizard (Step-by-Step Flow)

- Select Week (Mon--Sun)

- For Each Day:

  - Choose Breakfast Recipe(s)

  - Choose Lunch Recipe(s)

  - Choose Dinner Recipe(s)

  - Add Optional Snacks

- AI/Rule-Based Recommendations (via Spoonacular + user preferences)

- Adjust serving sizes

- Save Plan → Redirect to Dashboard

---

## [5] Generate Shopping List

- Based on selected meal plan

- Ingredients grouped by category (Produce, Dairy, Pantry, etc.)

- Editable quantities (adjust portion sizes or swap ingredients)

- Mark items as purchased

- Option to Print or Export (PDF/CSV)

---

# 📖 Story-Driven Walkthrough

## Chapter 1: The Discovery -- Landing Page

Sarah visits the Recipe & Meal Planner App for the first time. She's unsure, so she clicks **Explore as Guest**. Instantly, she sees a gallery of sample recipes fetched from Spoonacular. She can even preview the meal planner, but only in demo mode (she can't save).\
A few days later, Sarah decides to **sign up**. She enters her email, password, and dietary preferences like "vegetarian" and "dairy-free." After verifying her account, she logs in and is taken to her personalized dashboard.

## Chapter 2: Personalized Space -- User Dashboard

On her dashboard, Sarah sees a quick overview: this week's planned meals, her pending shopping list, and a reminder about last week's plan. She edits her profile to update her preferences and uploads a new profile picture. Now she's ready to create her first plan.

## Chapter 3: Building the Perfect Plan -- Meal Plan Wizard

Sarah clicks **Create New Meal Plan**. The wizard guides her step by step: choosing a week, then filling in breakfast, lunch, dinner, and snacks for each day. Spoonacular suggests recipes based on her preferences, and she can also pick from her **Saved Recipes**. After customizing portion sizes, she saves her plan.

## Chapter 4: Grocery Shopping Made Easy -- Shopping List

With her plan ready, Sarah generates a **Shopping List**. The app compiles all the ingredients, neatly grouped by category: Produce, Dairy, Pantry, etc. She adjusts quantities, removes items she already has, and exports the list as a PDF for her grocery run.

## Chapter 5: Discovering and Creating Recipes -- Recipe Search & Add Your Own

Sarah explores **Recipe Search** to find new ideas. Using filters like "high protein" and "Italian," she discovers recipes she loves. But she also wants to add her grandmother's pasta dish, so she clicks **Add Recipe**, types in the details, and saves it. Now it's available in both **Saved Recipes** and her next meal plan.

## Chapter 6: Cooking and Using Recipes -- Recipe Details Page

When it's time to cook, Sarah clicks into a recipe. She sees the full ingredients list, step-by-step instructions, and an option to mark the recipe as a favorite or add it to a future meal plan.

## Chapter 7: Revisiting and Refining -- Saved Recipes & Meal Plans

Over time, Sarah builds a collection of favorite recipes and meal plans. She revisits her plans weekly, sometimes cloning one to reuse it with small tweaks. This flexibility helps her stay consistent while still trying new meals.

## Chapter 8: Customizing Experience -- Settings & Preferences

In **Settings**, Sarah changes her password, sets grocery reminder notifications, and switches the app to Dark Mode for easier evening use.

## Chapter 9: The Journey Continues

With meal planning, shopping lists, recipe discovery, and the ability to add her own dishes, Sarah feels fully in control of her cooking life. The app integrates everything she needs in one place, saving her time and helping her enjoy cooking more.

**End of Story.**
