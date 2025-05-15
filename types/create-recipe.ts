export interface CreateRecipe {
  name: string;
  preparation: string;
  userId: number;
  ingredients: IngredientInfoRecipe[];
}

export interface IngredientInfoRecipe {
  ingredientId: number;
  name?: string;
  quantity: number;
}
export interface CreateRecipeResponse {
  data: {
    id: number;
    name: string;
    preparation: string;
    ingredients: IngredientInfoRecipe[];
  };
}