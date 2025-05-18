import axios from "axios";
import { CreateRecipe, CreateRecipeResponse } from "../types/create-recipe";
import userService from "./user-service";
import { InfoRecipe } from "../types/info-recipe";

let API_URL = "http://192.168.0.123:8082/api/v1/recipes";


const createRecipe = async (data: CreateRecipe): Promise<InfoRecipe> => {
  console.log("OBJETO A CREAAAR:", data);
  const response = await axios.post<CreateRecipeResponse>(API_URL, data);
  console.log("HTTP status:", response.status);

  const dto = response.data.data;

  return {
    id: dto.id,
    name: dto.name,
    preparation: dto.preparation,
    ingredients: dto.ingredients.map((i: any) => ({
      id: i.id,
      name: i.name,
      quantityCalories: i.quantityCalories,
    })),
  };
};

const deleteRecipe = async (recipeId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${recipeId}`);
    console.log("respuesta:", response.status);
    return response;
  } catch (e) {
    console.error("error en deleteRecipe:", e);
    throw e;
  }
}

const addIngredientToRecipe = async (
  recipeId: number,
  ingredientId: number,
  quantity: number
) => {
  const response = await axios.post(
    `${API_URL}/${recipeId}/ingredients`,
    { ingredientId, quantity }
  );
  return response.status === 200;
};


const getAllRecipesByUser = async () => {
  try {
    const user = await userService.getInfoUser();
    if (!user) {
      console.error("No se pudo obtener el usuario");   
    } 
    const userId = user.id;
    const response = await fetch(`${API_URL}/user/${userId}`);
    const json = await response.json();
    console.log("Respuesta del back:", json);

    if (response.ok) {
      return { data: json.data as InfoRecipe[] };
    } else {
      console.error("Error en la respuesta HTTP:", response.status);
      return null;
    }
  } catch (err) {
    console.error("Error de red o fetch:", err);
    return null;
  }
};



const getIngredientsByRecipe = async (recipeId : number) => {
  try {
    const response = await fetch(`${API_URL}/user/${recipeId}/ingredients`);
    const json = await response.json();
    console.log("Respuesta del getIngredientsByRecipe:", json);
    if (response.ok) {
      return json;
    } else {
      console.error("Error en la respuesta HTTP:", response.status);
      return null;
    }
  } catch (err) {
    console.error("Error de red o fetch:", err);
    return null;
  }
};

const getRecipeById = async (recipeId: number) => {
  try {
    const response = await fetch(`${API_URL}/${recipeId}`);
    const json = await response.json();
    console.log("receta :", json);
    if (response.ok) {
      return json;
    } else {
      console.error("Error en la respuesta HTTP:", response.status);
      return null;
    }
  } catch (err) {
    console.error("Error de red o fetch:", err);
    return null;
  }
}

const updateRecipe = async (recipeId: number, data: CreateRecipe) => {
  try {
    const response = await axios.put<CreateRecipeResponse>(`${API_URL}/${recipeId}`, data);
    console.log("HTTP status:", response.status);

    const dto = response.data.data;

    return {
      id: dto.id,
      name: dto.name,
      preparation: dto.preparation,
      ingredients: dto.ingredients.map((i: any) => ({
        id: i.id,
        name: i.name,
        quantityCalories: i.quantityCalories,
      })),
    };
  } catch (error) {
    console.error("Error al actualizar la receta:", error);
    throw error;
  }
}

const recipesService = {
  getAllRecipesByUser,
  createRecipe,
  getIngredientsByRecipe,
  addIngredientToRecipe,
  deleteRecipe,
  getRecipeById,
  updateRecipe
};

export default recipesService;