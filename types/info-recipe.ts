
export type InfoRecipe = {
  id: number;
  name: string;
  preparation: string;
  ingredients: IngredientInfo[];
};   


export type IngredientInfo = {
  id: number;
  name: string;
  quantity: number;
  active: boolean;
  quantityCalories: number; 
};
