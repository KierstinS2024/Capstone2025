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
