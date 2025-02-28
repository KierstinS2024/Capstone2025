# Capstone Project Proposal: Recipe & Meal Planner App

## 1. Tech Stack

For this project, I will utilize the **MERN** (MongoDB, Express, React, Node.js) tech stack, as we have been learning it in the course. Specifically:

- **Frontend**: React.js will be used to build a dynamic and interactive user interface for the app.
- **Backend**: Node.js with Express will handle API requests, manage the backend logic, and interact with the database.
- **Database**: MongoDB will store user data, recipes, meal plans, shopping lists, and other relevant data.
- **Authentication**: JWT (JSON Web Tokens) and Passport.js will be used for secure user authentication and authorization.
- **APIs**: I plan to incorporate APIs like [Spoonacular](https://spoonacular.com/) or [Edamam](https://developer.edamam.com/) for recipe suggestions, nutritional analysis, and product data.

## 2. Focus

This will be an evenly focused full-stack application. Both the front-end and back-end will play critical roles in the success of the project.

- **Frontend**: The main UI will feature various user inputs, meal planning, recipe display, and interaction with external APIs.
- **Backend**: It will handle user authentication, API integration, and data management (e.g., saving recipes, meal planning, etc.).

The full-stack approach is essential to ensure the app is both feature-rich and functional, integrating user interaction with real-time data.

## 3. Platform

This app will be developed as a mobile app using [React Native](https://reactnative.dev/) for cross-platform compatibility (iOS and Android). If React Native seems too big of an undertaking initially, I will first develop it as a web app and later convert it to a mobile app.

## 4. Project Goal

The primary goal of this project is to create an app that helps users plan their meals effectively while considering their dietary restrictions, preferences, and nutritional goals.

Key features will include:
- Personalized recipe recommendations
- Meal planning with customizable weekly plans
- Shopping list generation
- Nutritional tracking and analysis
- Ingredient-based recipe suggestions
- User account management (sign-up, login, profile picture upload)

## 5. Target Users

The target demographic for this app includes:
- Health-conscious individuals
- People with dietary restrictions (e.g., gluten-free, vegan, low-carb)
- Busy professionals or parents
- Fitness enthusiasts who need to track macronutrients and calories
- Anyone looking to save time on grocery shopping and meal prep

## 6. Data Collection and APIs

I will utilize external APIs for recipe suggestions, nutritional analysis, and product information. These include:
- [Spoonacular API](https://spoonacular.com/food-api) or [Edamam API](https://developer.edamam.com/) for recipes and nutritional data.
- [Open Food Facts API](https://world.openfoodfacts.org/data) for product barcodes and ingredient details.

User data will include account information, preferences, meal plans, shopping lists, and tracked food intake.

## 7. Breaking Down Your Project

Below is a breakdown of some common tasks involved in the project:

| Task Name               | Description                                                   | Example                           |
|-------------------------|---------------------------------------------------------------|-----------------------------------|
| **Design Database Schema** | Determine the models and database schema required for your project. | [MongoDB Documentation on Schema Design](https://docs.mongodb.com/manual/core/data-modeling-introduction/) |
| **Source Your Data**         | Determine where your data will come from. You may use an existing API or create your own. | [Spoonacular API Documentation](https://spoonacular.com/food-api) |
| **User Flows**               | Determine user flow(s) - think about the user's experience while navigating the app. | [Example User Flow Diagram](https://creately.com/diagram/example/infr91h4/user-flow-example) |
| **Setup Backend and Database** | Configure environment and set up the database for development. | [Node.js Environment Setup](https://nodejs.org/en/docs/guides/) |
| **Setup Frontend**           | Set up frontend framework and link it to the backend with a simple API call. | [React Setup Guide](https://reactjs.org/docs/create-a-new-react-app.html) |
| **User Authentication**      | Full-stack feature - ability to authenticate (login/signup) as a user. | [JWT Authentication Guide](https://jwt.io/introduction/) |

## 8. Labeling Table with Difficulty Levels and Stretch Goals

| Task Name               | Description                                                   | Difficulty | Example                           | Difficulty Description                                                      | Stretch Goal |
|-------------------------|---------------------------------------------------------------|------------|-----------------------------------|----------------------------------------------------------------------------|--------------|
| **Design Database Schema** | Determine the models and database schema required for your project. | Medium     | [MongoDB Documentation on Schema Design](https://docs.mongodb.com/manual/core/data-modeling-introduction/) | Requires careful planning of data relationships and structure. | Add advanced relationships like user preferences and meal ratings. |
| **Source Your Data**         | Determine where your data will come from. You may use an existing API or create your own. | Medium     | [Spoonacular API Documentation](https://spoonacular.com/food-api) | Integrating APIs is moderately difficult, handling data inconsistencies. | Use multiple APIs for different sources (e.g., Spoonacular, Open Food Facts). |
| **User Flows**               | Determine user flow(s) - think about the user's experience while navigating the app. | Easy       | [Example User Flow Diagram](https://creately.com/diagram/example/infr91h4/user-flow-example) | Involves basic diagramming to define user paths. | Implement personalized meal suggestions based on user data and preferences. |
| **Setup Backend and Database** | Set up the backend environment and configure the database. | Medium     | [Node.js Environment Setup](https://nodejs.org/en/docs/guides/) | Setting up backend involves environment configuration and database setup. | Implement caching for faster data retrieval (e.g., Redis). |
| **Setup Frontend**           | Set up the frontend framework and link it to the backend. | Medium     | [React Setup Guide](https://reactjs.org/docs/create-a-new-react-app.html) | Setting up frontend involves linking UI components to backend APIs. | Use advanced UI/UX features like dynamic content loading (lazy loading, animations). |
| **User Authentication**      | Full-stack feature for user authentication (login/signup). | Hard       | [JWT Authentication Guide](https://jwt.io/introduction/) | Handling sensitive data and user sessions requires understanding of security protocols. | Add multi-factor authentication (MFA) for added security. |

## 9. Stretch Goal Descriptions: (NOTE: Stretch goals should be considered "nice-to-have" rather than essential components of the core app. They provide an excellent opportunity to go above and beyond for the capstone project, but should be pursued after core features are fully functional.)

- **Multi-API Integration**: Adds variety and depth by pulling data from several sources (e.g., recipes from Spoonacular and product info from Open Food Facts).
- **Advanced User Flow Features**: Personalizing the user experience, such as meal suggestions based on prior preferences or dietary restrictions.
- **Caching for Performance**: Using technologies like Redis to cache results and speed up the app, reducing load times and making the app more efficient.
- **Advanced UI/UX**: Improving the interface with animations, dynamic content, and user-friendly design elements.
- **Multi-Factor Authentication**: Enhancing the security of user accounts by requiring a second layer of authentication.
- **Ingredient Tracking and Suggestions**: Recommending recipes based on available ingredients in the user’s pantry.
- **Sharing Shopping Lists**: Enabling users to share their grocery lists with others, which is especially useful for family or group meal planning.
- **Progress Tracking and Analytics**: Displaying nutritional progress through graphs, helping users monitor their dietary goals.

## 10. GitHub Repository

Once your proposal is finalized, ensure that your project code is stored on GitHub. Create a repository and link it for your mentor’s review. All code and documentation should be added to this repository.
