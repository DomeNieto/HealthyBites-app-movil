import React, { createContext, useState, ReactNode, useContext } from "react";
import { RecipeContextType } from "../types/recipe-context";
import { InfoRecipe } from "../types/info-recipe";
import recipesService from "../services/recipe-service";
import { CreateRecipe, IngredientInfoRecipe } from "../types/create-recipe";

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipesData, setRecipes] = useState<InfoRecipe[]>([]);

  const fetchRecipes = async () => {
    const res = await recipesService.getAllRecipesByUser();
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

  const addIngredient = (ingredient: IngredientInfoRecipe) =>
    setData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredient],
    }));

  const setIngredients = (ingredients: IngredientInfoRecipe[]) =>
    setData((prev) => ({
      ...prev,
      ingredients,
    }));

  const resetRecipe = () =>
    setData({
      name: "",
      preparation: "",
      userId: 0,
      ingredients: [],
    });

  return (
    <RecipeContext.Provider
      value={{
        data,
        setName,
        setPreparation,
        addIngredient,
        resetRecipe,
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

export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) throw new Error("useRecipe must be used within RecipeProvider");
  return context;
};
