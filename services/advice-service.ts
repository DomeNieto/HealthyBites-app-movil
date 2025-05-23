import axios from "axios";
import { InfoAdvice } from "../types/info-advice";
import { API_URL } from "../config";
import { getTokenCleaned } from "../utitlity/utility";

/**
 * The function `getAllAdvice` fetches data from an API and returns it, handling errors along the way.
 * @returns The `getAllAdvice` function returns a Promise that resolves to the JSON data fetched from
 * the API if the response is successful (status code 200), or `null` if there is an error in the
 * response or during the fetch process.
 */
const getAllAdvice = async () => {
  const token = await getTokenCleaned();

  try {
    const response = await axios.get<{ data: InfoAdvice[] }>(
      `${API_URL}api/v1/advices`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("getAllAdvices unexpected error:", error);
    return [];
  }
};

const adviceService = {
  getAllAdvice,
};

export default adviceService;