import { IngredientInfo } from "./info-recipe";

export type CreateRecipe = {
  name: string;
  preparation: string;
  userId: number;
  ingredients: IngredientInfoRecipe[];
}

export type IngredientInfoRecipe = {
  ingredientId: number;
  name?: string;
  quantity: number;
  quantityCalories: number;
}
export type RecipeResponse = {
  data: {
    id: number;
    name: string;
    preparation: string;
    ingredients: IngredientInfo[];
  };
}