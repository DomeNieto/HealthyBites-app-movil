export type DrawerParamList = {
  Home: undefined;
  Recetas: undefined;
  Ajustes: undefined;
  Logout : undefined;
  NewRecipe: { mode?: "edit" | "create"; recipeId?: number };
  addIngredient: { mode: "edit" | "create"; recipeId?: number };
};
