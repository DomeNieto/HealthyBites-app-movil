import React, { createContext, useState, ReactNode, useContext } from "react";
import { RecipeContextType } from "../types/recipe-context";
import { InfoRecipe, IngredientInfo } from "../types/info-recipe";
import recipesService from "../services/recipe-service";
import { CreateRecipe, IngredientInfoRecipe } from "../types/create-recipe";
import asyncStorageService from "../services/async-storage-service";
import userService from "../services/user-service";
import { Alert } from "react-native";
import { cleanEmail } from "../utitlity/utility";

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

/**
 * The `RecipeProvider` component is a React context provider that manages the state and functions
 * related to recipes, including fetching, adding, deleting, and updating recipes.
 * @param {ReactNode} children - The `children` prop is a ReactNode that represents the child components
 * that will be wrapped by the `RecipeProvider`. It allows the provider to pass down its context to
 * these child components.
 * @returns A `RecipeContext.Provider` component that wraps the `children` prop and provides various
 * recipe-related state and functions to its descendants.
 */
export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipesData, setRecipes] = useState<InfoRecipe[]>([]);
  const [data, setData] = useState<CreateRecipe>({
    name: "",
    preparation: "",
    userId: 0,
    ingredients: [],
  });
  /**
   * The `fetchRecipes` function is an asynchronous function that retrieves the user's email from
   * AsyncStorage, fetches the user data using the email, and then retrieves all recipes associated
   * @returns
   */
  const fetchRecipes = async () => {
    const emailStored = await asyncStorageService.getInfoStorage(asyncStorageService.KEYS.userEmail);
    if (!emailStored) {
      console.log("Error al obtener el email de AsyncStorage");
      return;
    }
    const email = cleanEmail(emailStored);
    if (!email) {
      console.log("Error al tipar el email");
      return;
    }
    const user = await userService.getUserByEmail(email);
    if (!user) {
      console.log("Usuario no encontrado en la solicitud de recetas");
      return;
    }
    const res = await recipesService.getAllRecipesByUser(user.data.id.toString());
    if (res?.data) {
      const unique = Array.from(new Map(res.data.map((r) => [r.id, r])).values());
      setRecipes(unique);
    }
  };

  /**
   * The `addRecipe` function is used to add a new recipe to the list of recipes in the state.
   * @param {InfoRecipe} recipe - The `recipe` parameter is an object of type `InfoRecipe` that represents
   * the recipe to be added to the list of recipes.
   */
  const addRecipe = (recipe: InfoRecipe) => setRecipes((prev) => [...prev, recipe]);

  /**
   * The `deleteRecipeInList` function is used to remove a recipe from the list of recipes in the state
   * based on its ID.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of the
   * recipe to be deleted from the list of recipes.
   */
  const deleteRecipeInList = (id: number) => setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));

  /**
   * The `updateRecipeInList` function is used to update an existing recipe in the list of recipes in
   * the state based on its ID.
   * @param {InfoRecipe} updated - The `updated` parameter is an object of type `InfoRecipe` that
   * represents the updated recipe to be replaced in the list of recipes.
   */
  const updateRecipeInList = (updated: InfoRecipe) => setRecipes((prev) => prev.map((recipe) => (recipe.id === updated.id ? updated : recipe)));

  
  /**
   * The `setName` function is used to update the name of the recipe in the state.
   * @param {string} name - The `name` parameter is a string that represents the new name of the recipe.
   */
  const setName = (name: string) => setData((prev) => ({ ...prev, name }));
  /**
   * The `setPreparation` function is used to update the preparation instructions of the recipe in the state.
   * @param {string} preparation - The `preparation` parameter is a string that represents the new
   * preparation instructions for the recipe.
   */
  const setPreparation = (preparation: string) => setData((prev) => ({ ...prev, preparation }));

  /**
   * The `addIngredient` function is used to add a new ingredient to the recipe in the state.
   * It checks if the ingredient already exists in the list before adding it.
   * @param {IngredientInfoRecipe} newIngredient - The `newIngredient` parameter is an object of type
   * `IngredientInfoRecipe` that represents the new ingredient to be added to the recipe.
   */
  const addIngredient = (newIngredient: IngredientInfoRecipe) => {
    setData((prev) => {
      const exists = prev.ingredients.some((ing) => ing.ingredientId === newIngredient.ingredientId);
      if (exists) {
        Alert.alert("Ingrediente duplicado", "Ya has añadido ese ingrediente.");
        return prev;
      }
      return {
        ...prev,
        ingredients: [...prev.ingredients, newIngredient],
      };
    });
  };

  /**
   * The `setIngredients` function is used to update the list of ingredients in the recipe in the state.
   * @param {IngredientInfoRecipe[]} ingredients - The `ingredients` parameter is an array of objects
   * of type `IngredientInfoRecipe` that represents the new list of ingredients for the recipe.
   */
  const setIngredients = (ingredients: IngredientInfoRecipe[]) =>
    setData((prev) => ({
      ...prev,
      ingredients,
    }));

  return (
    <RecipeContext.Provider
      value={{
        data,
        setName,
        setPreparation,
        addIngredient,
        recipesData,
        fetchRecipes,
        addRecipe,
        deleteRecipeInList,
        setIngredients,
        updateRecipeInList,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

/**
 * The useRecipe function is a custom hook in TypeScript React that retrieves the RecipeContext and
 * throws an error if it is not found.
 * @returns The `useRecipe` custom hook is being returned. It allows components to access the
 * RecipeContext using the useContext hook. If the context is not available, an error is thrown
 * indicating that `useRecipe` must be used within the RecipeProvider.
 */
export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) throw new Error("useRecipe must be used within RecipeProvider");
  return context;
};
