const API_URL = "http://192.168.0.123:8082/api/v1";

const getAllIngredients = async () => {
  try {
    const res = await fetch(`${API_URL}/ingredients`);
    const json = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return json.data as { id: number; name: string }[];
  } catch (e) {
    console.error("getAllIngredients:", e);
    return [];
  }
};


const ingredientsService = {
  getAllIngredients,
};

export default ingredientsService;