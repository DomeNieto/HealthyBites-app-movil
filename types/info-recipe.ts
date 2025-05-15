export type InfoRecipe = {
  id: number;
  name: string;
  preparation: string;
  ingredients: IngredientInfo[];
};   

type IngredientInfo = {
  id: number;
  name: string;
  quantityCalories: number;
};
