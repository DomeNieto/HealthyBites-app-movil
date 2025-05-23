import asyncStorageService from "../services/async-storage-service";
import { UserApiResponse } from "../types/response-interfase";

const IMC_MIN = 10;
const IMC_MAX = 40;

export const getTokenCleaned = async () => {
  const token = await asyncStorageService.getInfoStorage(asyncStorageService.KEYS.userToken);

  if (!token) {
    return null;
  }
  return token.replace(/['"]+/g, "");
};

export const getBmiCategory = (val: number) => {
  if (val < 18.5) return "Bajo peso";
  if (val < 25) return "Peso Saludable";
  if (val < 30) return "Sobrepeso";
  return "Obesidad";
};

export const cleanEmail = (email: string) => {
  if (email == null) {
    console.error("Email no existente");
    return;
  }
  return email?.replace(/^"(.*)"$/, "$1");
};

export const getBmiImage = (val: number) => {
  if (val < 18.5) {
    return require("./../assets/images/delgado.png");
  } else if (val < 25) {
    return require("./../assets/images/normal.png");
  } else {
    return require("./../assets/images/gordito.png");
  }
};

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
