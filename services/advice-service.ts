import axios from "axios";
import userService from "./user-service";
import asyncStorageService, { getToken } from "./async-storage-service";
import { InfoAdvice } from "../types/info-advice";

let API_URL = "http://192.168.0.18:8082/api/v1/advices";

/**
 * The function `getAllAdvice` fetches data from an API and returns it, handling errors along the way.
 * @returns The `getAllAdvice` function returns a Promise that resolves to the JSON data fetched from
 * the API if the response is successful (status code 200), or `null` if there is an error in the
 * response or during the fetch process.
 */
const getAllAdvice = async () => {
  const token = await getToken();
  const cleanedToken = token!.replace(/['"]+/g, "");

  try {
    const res = await axios.get<{data: InfoAdvice}>(
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


const adviceService = {
  getAllAdvice,
};

export default adviceService;
