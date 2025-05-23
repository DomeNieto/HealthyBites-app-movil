/* These TypeScript types are defining the structure of objects related to creating recipes and
handling recipe responses. Here's a breakdown of each interface: */
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
  active: boolean;
  quantityCalories?: number; 
}
export type RecipeResponse = {
  data: {
    id: number;
    name: string;
    preparation: string;
    ingredients: IngredientInfoRecipe[];
  };
}