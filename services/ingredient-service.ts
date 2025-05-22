import { API_URL } from "../config";
import { Ingredient } from "../types/ingredient";
import { getTokenCleaned } from "../utitlity/utility";

const getAllIngredients = async () => {
  const token = await getTokenCleaned();

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
