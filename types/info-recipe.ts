/**
 * The InfoRecipe type in TypeScript represents a recipe with an id, name, preparation instructions,
 * and an array of IngredientInfo objects.
 * @property {number} id - The `id` property in the `InfoRecipe` type represents a unique identifier
 * for a recipe. It is of type `number`.
 * @property {string} name - The `InfoRecipe` type includes the following properties:
 * @property {string} preparation - The `preparation` property in the `InfoRecipe` type represents the
 * steps or instructions on how to prepare the recipe. It typically includes details such as the
 * cooking methods, order of steps, and any specific instructions for preparing the dish.
 * @property {IngredientInfo[]} ingredients - The `ingredients` property in the `InfoRecipe` type is an
 * array of `IngredientInfo` objects. Each `IngredientInfo` object likely contains information about a
 * specific ingredient used in the recipe, such as its name, quantity, and any additional details.
 */
export type InfoRecipe = {
  id: number;
  name: string;
  preparation: string;
  ingredients: IngredientInfo[];
};   

/**
 * The type `IngredientInfo` defines properties for an ingredient including id, name, quantity, active
 * status, and quantity of calories.
 * @property {number} id - The `id` property in the `IngredientInfo` type represents the unique
 * identifier of an ingredient.
 * @property {string} name - The `name` property in the `IngredientInfo` type represents the name of
 * the ingredient.
 * @property {number} quantity - The `quantity` property in the `IngredientInfo` type represents the
 * amount or quantity of a particular ingredient. It is a numeric value that indicates how much of the
 * ingredient is available or required.
 * @property {boolean} active - The `active` property in the `IngredientInfo` type indicates whether
 * the ingredient is currently active or not. It is a boolean value, where `true` typically means the
 * ingredient is active and `false` means it is inactive.
 * @property {number} quantityCalories - The `quantityCalories` property in the `IngredientInfo` type
 * likely represents the number of calories in the specified quantity of the ingredient. This property
 * would store the calorie content per unit of the ingredient, allowing for easy calculation of total
 * calories when the quantity is known.
 */
export type IngredientInfo = {
  id: number;
  name: string;
  quantity: number;
  active: boolean;
  quantityCalories: number; 
};
