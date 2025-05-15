import { CreateRecipe, IngredientInfoRecipe } from "./create-recipe";
import { InfoRecipe } from "./info-recipe";

export interface RecipeContextType {
  data: CreateRecipe;
  setName: (name: string) => void;
  setPreparation: (preparation: string) => void;
  addIngredient: (ingredient: IngredientInfoRecipe) => void;
  resetRecipe: () => void;
  recipesData: InfoRecipe[];
  fetchRecipes: () => Promise<void>;
  addRecipe: (recipe: InfoRecipe) => void;
  deleteRecipeInList: (id: number) => void;
}
