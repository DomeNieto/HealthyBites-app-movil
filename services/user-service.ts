import axios from "axios";
import { loginInfo } from "../types/login-info";
import { userRegister } from "../types/user-register";
import asyncStorageService from "./async-storage-service";

const API_URL = "http://192.168.0.123:8082/api/v1/users";
const API_URL_LOGIN = "http://192.168.0.123:8082/api/auth/login";

export const registerNewUser = async (data: userRegister): Promise<number> => {
  try {
    const newUserRegister = {
      name: data.name,
      email: data.email,
      password: data.password,
      infoUser: {
        height: data.infoUser.height,
        weight: data.infoUser.weight,
        activityLevel: data.infoUser.activityLevel,
      },
    };

    console.log("envio datos al back: ", newUserRegister);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserRegister),
    });

    console.log("Status:", response.status);

    return response.status;
  } catch (err: any) {
    console.error("Error:", err.message || err);
    return 500;
  }
};

const registerLogin = async (data: loginInfo) => {
  try {
    const response = await axios.post(API_URL_LOGIN, {
      email: data.email,
      password: data.password,
    });
    if (response.status == 200) {
      await asyncStorageService.saveUser("user-token", response.data?.accessToken);
      await asyncStorageService.saveUser("user-email", data.email);
      return response.status;
    } else {
      return null;
    }
  } catch (e) {
    console.log(`Fetch Error: ${e}`);
  }
};

const getUserByEmail = async (email: string) => {
  try {
    const response = await fetch(`${API_URL}/by-email?email=${email}`);
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


const userService = {
  registerNewUser,
  registerLogin,
  getUserByEmail,
};

export default userService;
