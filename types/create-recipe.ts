export interface CreateRecipe {
  name: string;
  preparation: string;
  userId: number;
  ingredients: IngredientInfoRecipe[];
}

export interface IngredientInfoRecipe {
  ingredientId: number;
  quantity: number;
}
