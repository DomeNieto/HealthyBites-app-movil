import axios from "axios";
import { getToken } from "./async-storage-service";

const API_URL = "http://192.168.0.18:8082/api/v1/ingredients/active";

/**
 * The function `getAllIngredients` asynchronously fetches data from an API URL and returns an array of
 * objects with `id` and `name` properties, handling errors gracefully.
 * @returns The `getAllIngredients` function is returning an array of objects with `id` as a number and
 * `name` as a string. If there is an error during the fetching process, an empty array will be
 * returned.
 */
type Ingredient = { id: number; name: string };

const getAllIngredients = async () => {
  const token = await getToken();
  const cleanedToken = token!.replace(/['"]+/g, "");

  try {
    const res = await axios.get<{ data: Ingredient[] }>(
      `${API_URL}`,
      {
        headers: {
          Authorization: `Bearer ${cleanedToken}`,
        },
      }
    );

    return res.data.data;
  } catch (error) {
    console.error("getAllIngredients unexpected error:", error);
    return [];
  }
};

const ingredientsService = {
  getAllIngredients,
};

export default ingredientsService;