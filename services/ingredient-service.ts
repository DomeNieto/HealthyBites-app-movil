import axios from "axios";
import { API_URL } from "../config";
import { getTokenCleaned } from "../utitlity/utility";

/**
 * The function `getAllIngredients` asynchronously fetches data from an API URL and returns an array of
 * objects with `id` and `name` properties, handling errors gracefully.
 * @returns The `getAllIngredients` function is returning an array of objects with `id` as a number and
 * `name` as a string. If there is an error during the fetching process, an empty array will be
 * returned.
 */
type Ingredient = { id: number; name: string };

/**
 * The `getAllIngredients` function asynchronously fetches a list of active ingredients from an API
 * endpoint, using a token for authorization, and returns the data.
 * @returns An array of `Ingredient` objects.
 */
const getAllIngredients = async () => {
  const token = await getTokenCleaned();
  console.log("Token enviado:", token);
  try {
    const res = await axios.get<{ data: Ingredient[] }>(
      `${API_URL}api/v1/ingredients/active`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
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