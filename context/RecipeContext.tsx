import React, { createContext, useState, ReactNode, useContext } from "react";
import { RecipeContextType } from "../types/recipe-context";
import { InfoRecipe, IngredientInfo } from "../types/info-recipe";
import recipesService from "../services/recipe-service";
import { CreateRecipe, IngredientInfoRecipe } from "../types/create-recipe";
import asyncStorageService from "../services/async-storage-service";
import userService from "../services/user-service";
import { Alert } from "react-native";

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

  const fetchRecipes = async () => {
    const email = await asyncStorageService.getInfoStorage(asyncStorageService.KEYS.userEmail);
    const cleanEmail = email?.replace(/^"(.*)"$/, "$1");
    if (!cleanEmail) {
      console.error("Email no encontrado");
      return;
    }
    const user = await userService.getUserByEmail(cleanEmail);
    if (!user?.data) {
      console.error("Usuario no encontrado");
      return;
    }
    const res = await recipesService.getAllRecipesByUser(user.data.id.toString());
    if (res?.data) {
      const unique = Array.from(new Map(res.data.map(r => [r.id, r])).values());
      setRecipes(unique);
    }
  };

  const addRecipe = (recipe: InfoRecipe) => setRecipes(prev => [...prev, recipe]);

  const deleteRecipeInList = (id: number) => setRecipes(prev => prev.filter(recipe => recipe.id !== id));

  const updateRecipeInList = (updated: InfoRecipe) => setRecipes(prev => prev.map(recipe => recipe.id === updated.id ? updated : recipe));

  const [data, setData] = useState<CreateRecipe>({
    name: "",
    preparation: "",
    userId: 0,
    ingredients: [],
  });

  const setName = (name: string) => setData((prev) => ({ ...prev, name }));
  const setPreparation = (preparation: string) => setData((prev) => ({ ...prev, preparation }));

  const addIngredient = (newIngredient: IngredientInfoRecipe) => {
    setData(prev => {
      const exists = prev.ingredients.some(ing => ing.ingredientId === newIngredient.ingredientId);
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
        updateRecipeInList
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
