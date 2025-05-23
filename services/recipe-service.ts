import axios from "axios";
import { CreateRecipe, RecipeResponse } from "../types/create-recipe";
import { InfoRecipe } from "../types/info-recipe";
import { API_URL } from "../config";
import { getTokenCleaned } from "../utitlity/utility";

/**
 * The function `createRecipe` asynchronously creates a new recipe by sending a POST request to an API endpoint,
 * using a token for authorization, and returns the created recipe data. 
  * It handles errors gracefully and logs them to the console.
 * @param data 
 * @returns 
 */
const createRecipe = async (data: CreateRecipe) => {
  const token = await getTokenCleaned();

  try {
    const response = await axios.post<RecipeResponse>(`${API_URL}api/v1/recipes`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    console.log("HTTP status:", response.status);

    const dto = response.data.data;

    return {
      id: dto.id,
      name: dto.name,
      preparation: dto.preparation,
      ingredients: dto.ingredients.map((i) => ({
        id: i.id,
        name: i.name ?? "",
        quantity: i.quantity,
        quantityCalories: i.quantityCalories ?? 0,
        active: i.active,
      })),
    };
  } catch (error) {
    console.log(error);
  }
};

/**
 * The function `deleteRecipe` asynchronously deletes a recipe by sending a DELETE request to an API endpoint,
 * using a token for authorization, and returns the HTTP status of the response.
 * @param recipeId 
 * @returns 
 */
const deleteRecipe = async (recipeId: number) => {
  const token = await getTokenCleaned();
  try {
    const response = await axios.delete(`${API_URL}api/v1/recipes/${recipeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("respuesta:", response.status);
    return response.status;
  } catch (e) {
    console.error("error en deleteRecipe:", e);
    throw e;
  }
};

/**
 * The function `addIngredientToRecipe` asynchronously adds an ingredient to a recipe by sending a POST request
 * to an API endpoint, using a token for authorization, and returns a boolean indicating success or failure.
 * @param recipeId 
 * @param ingredientId 
 * @param quantity 
 * @returns 
 */
const addIngredientToRecipe = async (recipeId: number, ingredientId: number, quantity: number) => {
  const token = await getTokenCleaned();
  try {
    const response = await axios.post(
      `${API_URL}api/v1/recipes/${recipeId}/ingredients`,
      { ingredientId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.status === 200;
  } catch (error) {
    console.error(error);
  }
};

/**
 * The function `getAllRecipesByUser` asynchronously retrieves all recipes associated with a specific user by sending a GET request to an API endpoint,
 * using a token for authorization, and returns the recipe data.
 * @param userId userId
 * @returns recipe data.
 */
const getAllRecipesByUser = async (userId: string) => {
  const token = await getTokenCleaned();
  try {
    const response = await axios.get<{ data: InfoRecipe[] }>(`${API_URL}api/v1/recipes/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Respuesta del back:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error en getAllRecipesByUser:", err);
    return null;
  }
};

/**
 * The function `getRecipeById` asynchronously retrieves a recipe by its ID by sending a GET request to an API endpoint,
 * using a token for authorization, and returns the recipe data.
 * @param recipeId 
 * @returns recipe data
 */
const getRecipeById = async (recipeId: number) => {
  const token = await getTokenCleaned();
  try {
    const response = await axios.get(`${API_URL}api/v1/recipes/${recipeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("receta :", response.data);
    return response.data as RecipeResponse;
  } catch (err) {
    console.error("Error en getRecipeById:", err);
    return null;
  }
};

/**
 * The function `updateRecipe` asynchronously updates a recipe by sending a PUT request to an API endpoint,
 * using a token for authorization, and returns the updated recipe data.
 * @param recipeId 
 * @param data 
 * @returns updated recipe data
 */
const updateRecipe = async (recipeId: number, data: CreateRecipe): Promise<InfoRecipe> => {
  const token = await getTokenCleaned();
  try {
    const response = await axios.put<RecipeResponse>(`${API_URL}api/v1/recipes/${recipeId}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("HTTP status:", response.status);

    const dto = response.data.data;

    return {
      id: dto.id,
      name: dto.name,
      preparation: dto.preparation,
      ingredients: dto.ingredients.map((i) => ({
        id: i.id,
        name: i.name ?? "",
        quantity: i.quantity,
        quantityCalories: i.quantityCalories ?? 0,
        active: i.active,
      })),
    };
  } catch (error) {
    console.error("Error al actualizar la receta:", error);
    throw error;
  }
};

const recipesService = {
  getAllRecipesByUser,
  createRecipe,
  addIngredientToRecipe,
  deleteRecipe,
  getRecipeById,
  updateRecipe,
};

export default recipesService;
