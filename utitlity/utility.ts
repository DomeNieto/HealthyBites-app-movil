import asyncStorageService from "../services/async-storage-service";
import { UserApiResponse } from "../types/response-interfase";

const IMC_MIN = 10;
const IMC_MAX = 40;

/**
 * getTokenCleaned is an asynchronous function that retrieves a token from AsyncStorage,
 * cleans it by removing any surrounding quotes, and returns the cleaned token.
 * @returns 
 */
export const getTokenCleaned = async () => {
  const token = await asyncStorageService.getInfoStorage(asyncStorageService.KEYS.userToken);

  if (!token) {
    return null;
  }
  return token.replace(/['"]+/g, "");
};

/**
 * getBmiCategory is a function that takes a BMI value as input and returns the corresponding BMI category.
 * The categories are defined as follows:
 * @param val 
 * @returns 
 */
export const getBmiCategory = (val: number) => {
  if (val < 18.5) return "Bajo peso";
  if (val < 25) return "Peso Saludable";
  if (val < 30) return "Sobrepeso";
  return "Obesidad";
};

/**
 * cleanEmail is a function that takes an email string as input and removes any surrounding quotes.
 * If the email is null, it logs an error message to the console.
 * @param email 
 * @returns 
 */
export const cleanEmail = (email: string) => {
  if (email == null) {
    console.error("Email no existente");
    return;
  }
  return email?.replace(/^"(.*)"$/, "$1");
};

/**
 * getBmiImage is a function that takes a BMI value as input and returns the corresponding image based on the BMI category.
 * The images are defined as follows:
 * @param val 
 * @returns 
 */
export const getBmiImage = (val: number) => {
  if (val < 18.5) {
    return require("./../assets/images/delgado.png");
  } else if (val < 25) {
    return require("./../assets/images/normal.png");
  } else {
    return require("./../assets/images/gordito.png");
  }
};

/**
 * getMarkerPercent is a function that takes a BMI value as input and returns the percentage position of the BMI value
 * within the defined range of BMI values (10 to 40).
 * @param val 
 * @returns 
 */
export const getMarkerPercent = (val: number) => {
  if (val < IMC_MIN) {
    return 0;
  }

  if (val > IMC_MAX) {
    return 100;
  }

  const rango = IMC_MAX - IMC_MIN;
  const posicion = val - IMC_MIN;
  const porcentaje = (posicion / rango) * 100;

  return porcentaje;
};

/**
 * calculateRecommendedCalories is an asynchronous function that calculates the recommended daily caloric intake
 * for a user based on their personal information
 * 
 * */
export const calculateRecommendedCalories = async (fullInfo: UserApiResponse) => {
  try {
    if (!fullInfo || !fullInfo.data.infoUser) {
      throw new Error("Datos de usuario incompletos o inválidos");
    }
    const { sex, weight, height, age, activityLevel } = fullInfo.data.infoUser;

    const weightNum = Number(weight);
    const heightNum = Number(height);
    const ageNum = Number(age);
    const activityLevelNormalized = activityLevel?.toLowerCase();
    const sexNormalized = sex?.toLowerCase();

    if (!sexNormalized || isNaN(weightNum) || isNaN(heightNum) || isNaN(ageNum) || !activityLevelNormalized) {
      throw new Error("Datos de usuario incompletos o inválidos");
    }

    const factoresActivity: Record<string, number> = {
      baja: 1.2,
      moderada: 1.55,
      alta: 1.725,
    };

    const factorActivity = factoresActivity[activityLevelNormalized] || 1.2;

    let tmb = 0;
    if (sexNormalized === "femenino") {
      tmb = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    } else {
      tmb = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    }

    const totalCalories = tmb * factorActivity;
    return totalCalories;
  } catch (error) {
    console.error("Error al obtener info usuario o calcular calorías:", error);
  }
};
