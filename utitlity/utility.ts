import { getToken } from "../services/async-storage-service";

export const getTokenCleaned = async () => {
  const token = await getToken();

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
