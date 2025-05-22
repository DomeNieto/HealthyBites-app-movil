import axios from "axios";
import { loginInfo, LoginResponse } from "../types/login-info";
import { userRegister } from "../types/user-register";
import asyncStorageService, { getToken } from "./async-storage-service";
import { API_URL } from "../config";
import { getTokenCleaned } from "../utitlity/utility";
import { UserApiResponse } from "../types/response-interfase";

export const registerNewUser = async (data: userRegister) => {
  try {
    const newUserRegister = {
      name: data.name,
      email: data.email,
      password: data.password,
      infoUser: {
        height: data.infoUser.height,
        weight: data.infoUser.weight,
        activityLevel: data.infoUser.activityLevel,
        age: data.infoUser.age,
        sex: data.infoUser.sex,
      },
    };

    const response = await axios.post(
      `${API_URL}api/v1/users`,
      newUserRegister,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log(data);
    return response.status;
  } catch (error) {
    console.error("registerNewUser error:", error);
    return 500;
  }
};

export const registerLogin = async (data: loginInfo) => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}api/auth/login`,
      {
        email: data.email,
        password: data.password,
      }
    );

    if (response.status === 200) {
      await asyncStorageService.saveUser(
        asyncStorageService.KEYS.userToken,
        response.data.accessToken
      );
      await asyncStorageService.saveUser(
        asyncStorageService.KEYS.userEmail,
        data.email
      );
      return response.status;
    }
    console.log(data);
    return null;
  } catch (error) {
    console.error("registerLogin error:", error);
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const token = await getTokenCleaned();
    const response = await axios.get<UserApiResponse>(
      `${API_URL}api/v1/users/by-email`,
      {
        params: { email },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status >= 200 && response.status < 300) return response.data;
    console.error("getUserByEmail bad response:", response.status);
    return null;
  } catch (error) {
    console.error("getUserByEmail error:", error);
    return null;
  }
};

export const updateUser = async (
  //Pasar el id por parametro
  userId: string,
  updatedUserData: userRegister
): Promise<number> => {
  try {
    const bodyToSend = {
      name: updatedUserData.name,
      email: updatedUserData.email,
      password: updatedUserData.password,
      infoUser: {
        height: updatedUserData.infoUser.height,
        weight: updatedUserData.infoUser.weight,
        activityLevel: updatedUserData.infoUser.activityLevel,
        sex: updatedUserData.infoUser.sex,
        age: updatedUserData.infoUser.age,
      },
    };

    const token = await getTokenCleaned();

    const response = await axios.put(
      `${API_URL}api/v1/users/${userId}`,
      bodyToSend,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await asyncStorageService.deleteTokenUser(
      asyncStorageService.KEYS.userToken
    );
    await asyncStorageService.deleteTokenUser(
      asyncStorageService.KEYS.userEmail
    );

    return response.status;
  } catch (error) {
    console.error("updateUser error:", error);
    return 500;
  }
};

const userService = {
  registerNewUser,
  registerLogin,
  getUserByEmail,
  updateUser,
};

export default userService;
