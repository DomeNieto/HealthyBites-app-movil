import { CreateRecipe, IngredientInfoRecipe } from "./create-recipe";
import { InfoRecipe } from "./info-recipe";

/* This interface defines the functions returned by the RecipeContext context. */
export interface RecipeContextType {
  data: CreateRecipe;
  setName: (name: string) => void;
  setPreparation: (preparation: string) => void;
  addIngredient: (ingredient: IngredientInfoRecipe) => void;
  recipesData: InfoRecipe[];
  fetchRecipes: () => Promise<void>;
  addRecipe: (recipe: InfoRecipe) => void;
  deleteRecipeInList: (id: number) => void;
  setIngredients: (ingredients: IngredientInfoRecipe[]) => void;
  updateRecipeInList: (updatedRecipe: InfoRecipe) => void;
}
