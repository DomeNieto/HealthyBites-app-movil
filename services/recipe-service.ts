import axios from "axios";
import { CreateRecipe, RecipeResponse } from "../types/create-recipe";
import { InfoRecipe } from "../types/info-recipe";
import { API_URL } from "../config";
import { getTokenCleaned } from "../utitlity/utility";

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
        id: i.ingredientId,
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
        id: i.ingredientId,
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
