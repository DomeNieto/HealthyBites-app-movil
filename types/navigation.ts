/**
 * The `DrawerParamList` type in TypeScript defines the possible screens and navigation parameters for
 * a drawer navigator in a mobile app.
 * @property Home - The `Home` property in the `DrawerParamList` type represents the screen for the
 * home page in the navigation drawer. It is associated with the `undefined` value, indicating that it
 * does not expect any additional parameters when navigating to this screen.
 * @property Recetas - The `DrawerParamList` type defines the possible screens that can be accessed in
 * a drawer navigation. In this case, the `Recetas` property represents a screen for displaying
 * recipes.
 * @property Ajustes - The property "Ajustes" in the DrawerParamList type represents a screen or page
 * in the application related to settings or adjustments. It is likely used for navigating to a
 * settings screen where users can customize their app preferences or make adjustments to certain
 * features.
 * @property Logout - The `Logout` property in the `DrawerParamList` type represents a screen or action
 * that allows the user to log out of the application. When this option is selected from the drawer
 * menu, it typically triggers the user to be logged out of their current session and redirects them to
 * the login screen or
 * @property NewRecipe - The `NewRecipe` property in the `DrawerParamList` type represents a screen for
 * creating or editing a recipe. It has an optional `mode` property that can be either "edit" or
 * "create", and an optional `recipeId` property that is a number.
 * @property addIngredient - The `addIngredient` property in the `DrawerParamList` type represents a
 * screen for adding ingredients to a recipe. It has a `mode` property that can be either "edit" or
 * "create" to indicate whether the user is editing an existing ingredient or creating a new one. The `
 */
export type DrawerParamList = {
  Home: undefined;
  Recetas: undefined;
  Ajustes: undefined;
  Logout : undefined;
  NewRecipe: { mode?: "edit" | "create"; recipeId?: number };
  addIngredient: { mode: "edit" | "create"; recipeId?: number };
};
