# **Capstone Project Proposal: Recipe & Meal Planner App (Using Vite)**

## **1. Tech Stack**

For this project, I will utilize the **MERN** (MongoDB, Express, React, Node.js) tech stack (that we have been learning), enhanced with **Vite** for a faster and more efficient frontend development experience. Specifically:

- **Frontend**: **React.js** with **Vite** will be used to build a dynamic and interactive user interface for the app. Vite will replace traditional bundlers like Webpack, providing faster development builds and optimized production bundling.
- **Backend**: **Node.js** with **Express** will handle API requests, manage backend logic, and interact with the MongoDB database.
- **Database**: **MongoDB** will store user data, recipes, meal plans, shopping lists, and other relevant data.
- **Authentication**: **JWT (JSON Web Tokens)** and **Passport.js** will be used for secure user authentication and authorization.
- **APIs**: I plan to incorporate external APIs like **Spoonacular** or **Edamam** for recipe suggestions, nutritional analysis, and product data.

## **2. Focus**

This will be an evenly focused full-stack application, with both the frontend and backend working seamlessly to deliver a complete meal planning solution. **Vite** will significantly improve the frontend experience by ensuring faster build times, hot module reloading (HMR), and optimized production builds, allowing for more efficient development and smooth deployment.

- **Frontend**: The main UI will feature various user inputs for meal planning, recipe display, and interaction with external APIs. Vite will ensure fast and reliable frontend development, with easy integration to React components, API calls, and smooth state management.
- **Backend**: Node.js with Express will manage user authentication, interact with the database, and integrate with external APIs for recipes and nutritional data. The backend will expose endpoints to handle all interactions with the frontend.

## **3. Platform**

The app will be developed as a **web app** using **React** with **Vite**. The app will be optimized for desktop and mobile browsers, ensuring a smooth experience across all screen sizes.

## **4. Project Goal**

The primary goal of this project is to create an app that helps users plan their meals effectively while considering their dietary restrictions, preferences, and nutritional goals.

Key features will include:
- Personalized recipe recommendations based on dietary restrictions (e.g., vegan, gluten-free, etc.)
- Meal planning with customizable weekly plans and time-saving features
- Shopping list generation that maps out ingredients and quantities
- Nutritional tracking and analysis, helping users monitor caloric intake and macronutrients
- Ingredient-based recipe suggestions, helping users cook based on what’s available in their pantry
- User account management (sign-up, login, profile management, and picture upload)

## **5. Target Users**

The target demographic for this app includes:
- **Health-conscious individuals** looking for meal prep ideas and nutritional tracking
- **People with dietary restrictions** (e.g., gluten-free, vegan, low-carb, or keto)
- **Busy professionals or parents** who need a convenient meal planning and shopping solution
- **Fitness enthusiasts** who want to track macronutrients and calories effectively
- **Anyone looking to save time** on grocery shopping and meal prep, while maintaining nutritional balance
- **Stay-at-home parents** looking for an easy meal planning solution to feed their families and save time.

## **6. Data Collection and APIs**

External APIs will be integrated for recipe suggestions, nutritional analysis, and product information. These include:
- **Spoonacular API** or **Edamam API** for recipe suggestions, ingredients, nutritional data, and analysis. [Spoonacular API Documentation](https://spoonacular.com/food-api)
- **Open Food Facts API** for product barcodes, ingredient details, and nutritional data for products. [Open Food Facts API Documentation](https://world.openfoodfacts.org/data)

User data will include account information (sign-up, profile), preferences (dietary needs), meal plans, shopping lists, and tracked food intake.

## **7. Non-Technical User Flow**

### **1. Landing Page (Home)**
- The user arrives on the app’s homepage.
  - **Options available:**
    - **Sign Up / Log In**: If the user is not logged in, they can choose to create an account or log in.
    - **Explore Recipes**: The user can explore popular recipes, meal plans, and ingredients.
    - **Search Bar**: Users can search for specific recipes or ingredients.

### **2. Sign Up / Log In**
- **Sign Up Process**:  
  - The user provides their email, password, and optional dietary preferences (e.g., vegan, gluten-free).  
  - After submitting, the user will receive a confirmation email and can activate their account.
- **Log In Process**:  
  - The user logs in using their email and password.
  - If the user forgets their password, they can reset it using their email.

### **3. User Dashboard**
- After logging in, the user is taken to their **Dashboard**.  
  - **Options available:**
    - **View Profile**: User can view and update their account information, dietary preferences, and photo.
    - **Create Meal Plan**: User can begin creating a weekly meal plan by selecting recipes.
    - **View Meal Plans**: User can view meal plans they've previously created or select from suggested ones.
    - **Generate Shopping List**: User can generate a shopping list based on selected recipes.

### **4. Create Meal Plan**
- **Meal Plan Wizard**: The user is guided to create a meal plan by selecting recipes for breakfast, lunch, dinner, and snacks.  
  - For each meal type, the user can choose multiple recipes or a single recipe to add to that day’s plan.
  - **Personalized Recommendations**: Based on their dietary preferences, the app suggests meal ideas.
  - **Adjust Portion Sizes**: The user can modify serving sizes to fit the number of people they are preparing meals for.

### **5. Shopping List Generation**
- **Generate Shopping List**: After completing the meal plan, the user is prompted to generate a shopping list.
  - The app automatically pulls ingredients from the selected recipes and creates a list with ingredient names, quantities, and instructions on where to find them.
  - The user can modify the shopping list by removing or adding ingredients.

### **6. Search Recipes**
- **Search Bar**: The user can search for recipes by ingredients, name, or dietary preference (e.g., "gluten-free", "low-carb").
  - The search results show relevant recipes with basic details, including ingredients, nutritional information, and cooking instructions.
  - **Filter Options**: The user can filter results by dietary preference, cuisine, or meal type (e.g., breakfast, lunch, dinner).

### **7. View Recipe Details**
- Once the user clicks on a recipe, they can see the detailed page with:
  - **Ingredients List**: All ingredients with their quantities.
  - **Instructions**: Step-by-step cooking instructions.
  - **Nutritional Information**: Calories, protein, fat, carbs, and other details per serving.
  - **Save Recipe**: The user can save the recipe to their profile for future use.

### **8. Track Nutritional Intake**
- **Daily Log**: The user can log their daily food intake by selecting the meals they've eaten from their meal plan.
  - Nutritional data will be displayed, showing the total calories, protein, carbs, fats, etc., based on the user’s input.

### **9. Log Out**
- The user can log out from the app at any time from the dashboard or settings page.

## **8. Non-Technical Database Schema**

Here is an explanation of the database schema used in the app:

### **Tables:**

#### **Recipes**
- **id**: Unique identifier for the recipe.
- **name**: Name of the recipe.
- **description**: Description of the recipe.
- **ingredients**: List of ingredients needed for the recipe.
- **instructions**: Step-by-step instructions for making the recipe.
- **serving_size**: Number of servings the recipe makes.
- **calories**: Number of calories per serving.
- **protein**: Number of grams of protein per serving.
- **fat**: Number of grams of fat per serving.
- **carbs**: Number of grams of carbs per serving.
- **cuisine**: Type of cuisine (e.g., American, Italian, Mexican).

#### **Meal Plans**
- **id**: Unique identifier for the meal plan.
- **name**: Name of the meal plan.
- **breakfast**: List of recipes for breakfast.
- **lunch**: List of recipes for lunch.
- **dinner**: List of recipes for dinner.
- **snacks**: List of recipes for snacks.

#### **Shopping List**
- **id**: Unique identifier for the shopping list.
- **recipe_id**: ID of the recipe that the ingredient is needed for.
- **ingredient_id**: ID of the ingredient needed for the recipe.
- **quantity**: Amount of the ingredient needed.

---

### **Relationships:**
- One recipe can be included in many meal plans (one-to-many relationship between **Recipes** and **Meal Plans**).
- One recipe can be included in many shopping lists (one-to-many relationship between **Recipes** and **Shopping List**).
- One meal plan can include many recipes (many-to-one relationship between **Meal Plans** and **Recipes**).
- One shopping list can include ingredients for many recipes (many-to-one relationship between **Shopping List** and **Recipes**).

## **9. Breaking Down Your Project**

Below is a breakdown of some common tasks involved in the project:

| Task Name               | Description                                                   | Example                           |
|-------------------------|---------------------------------------------------------------|-----------------------------------|
| **Design Database Schema** | Determine the models and database schema required for your project. | [MongoDB Documentation on Schema Design](https://docs.mongodb.com/manual/core/data-modeling-introduction/) |
| **Source Your Data**         | Determine where your data will come from. You may use an existing API or create your own. | [Spoonacular API Documentation](https://spoonacular.com/food-api) |
| **User Flows**               | Determine user flow(s) - think about the user's experience while navigating the app. | [Example User Flow Diagram](https://creately.com/diagram/example/infr91h4/user-flow-example) |
| **Setup Backend and Database** | Configure environment and set up the database for development. | [Node.js Environment Setup](https://nodejs.org/en/docs/guides/) |
| **Setup Frontend with Vite**  | Set up Vite with React and link it to the backend

 with a simple API call. | [Vite Setup Guide](https://vitejs.dev/guide/) |
| **User Authentication**      | Full-stack feature - ability to authenticate (login/signup) as a user. | [JWT Authentication Guide](https://jwt.io/introduction/) |

## **10. GitHub Repository**

Once your proposal is finalized, ensure that your project code is stored on **GitHub**. Create a repository and link it for your mentor’s review. All code and documentation should be added to this repository.
