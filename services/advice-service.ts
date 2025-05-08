let API_URL = "http://192.168.0.123:8082/api/v1/advices";

const getAllAdvice = async () => {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    console.log("Respuesta del back:", json);

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

const adviceService = {
  getAllAdvice,
};

export default adviceService;
