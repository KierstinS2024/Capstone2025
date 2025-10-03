🧭 **User Flow Diagram**
------------------------
<img width="2056" height="947" alt="MealMate_UserFlow" src="https://github.com/user-attachments/assets/813d5182-34f8-4791-a639-cba0deb49b5c" />

### [1] Landing Page

**Sign Up / Log In**

-   User can **create an account** with email and password.

-   On successful signup, the user is **automatically logged in**.

-   Existing users can log in with their credentials.

-   No Google sign-in or email verification.

-   After logging in, the user is redirected to the **Dashboard**.

-   Auth-protected routes: unauthenticated users are redirected to the landing page.

* * * * *

### [2] Dashboard (after login)

**Overview Panel**

-   If a **meal plan exists for the current date range**, it's displayed at a glance.

-   If **no active meal plan** exists, the user sees a message and a **button linking to the Meal Plan page** to create one.

**Quick Actions**

-   Navigate to create or view the current meal plan.

-   Navigate to Recipes (search or saved).

-   Navigate to the Shopping List.

* * * * *

### [3] Recipes

**Search (Spoonacular)**

-   Users can search recipes by any Spoonacular-supported parameters (e.g., keyword, ingredient, cuisine, etc.).

-   Results are displayed as recipe cards.

**Save Recipes**

-   From search results, users can **save recipes** to their personal collection for future use.

**Custom Recipes**

-   Users can **create their own recipes**, entering title, ingredients, and instructions manually.

**Manage Recipes**

-   Saved or custom recipes can be **viewed, edited, or deleted**.

-   Recipes can be added to **meal plans** and **shopping lists** individually (not in bulk).

* * * * *

### [4] Meal Plan Page

**Create & Edit Plans**

-   Users can **create a new meal plan** for a specific date range (e.g., a week).

-   There is only **one active meal plan per user**.

-   The meal plan is displayed in a **calendar grid** with **Breakfast, Lunch, Dinner** slots for each day.

-   Recipes from the user's collection or search can be **dragged and dropped** into meal slots.

-   Users can **edit the plan** by dragging recipes to different slots or removing them.

-   Users can **delete the entire meal plan**.

**View by Date Range**

-   When navigating to different date ranges, the app fetches the plan for that range if it exists.

* * * * *

### [5] Shopping List

**Manual List Management**

-   Users can **manually add items** to their shopping list.

-   Users can add ingredients from **individual recipes**.

-   Items can be **checked off** as purchased.

-   Items can be **deleted individually** or the list can be **cleared entirely**.

**Note:**

-   There is **no bulk "generate shopping list"** from a whole plan yet.

-   Items are **not automatically added** to the list when creating meal plans.

* * * * *

### [6] Logout

-   Users can **log out**, which returns them to the landing page and clears their session.

* * * * *

📖 **Story-Driven Walkthrough**
-------------------------------

**Chapter 1: Signing Up**\
Alex signs up with an email and password. They're immediately logged in and redirected to the Dashboard.

**Chapter 2: Exploring Recipes**\
Alex searches Spoonacular for "chicken pasta," saves a few results, and adds their own "Family Chili" recipe.

**Chapter 3: Planning Meals**\
They open the Meal Plan page, set a date range for next week, and drag recipes into each day's breakfast, lunch, and dinner slots. They tweak a few meals by dragging to different days and save the plan.

**Chapter 4: Grocery Prep**\
Alex goes to the Shopping List, manually adds a few staples, and then adds ingredients from individual recipes they want to shop for. They check items off as they shop.

**Chapter 5: Returning Later**\
When Alex logs in next time, the Dashboard shows their current plan at a glance. If no plan exists for that range, a button prompts them to create one.

**Chapter 6: Managing Content**\
Over time, Alex builds up saved recipes, edits a few custom ones, deletes some they don't use anymore, and occasionally replaces their active meal plan with a new date range.
