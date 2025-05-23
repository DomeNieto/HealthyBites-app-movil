import axios from "axios";
import { loginInfo } from "../types/login-info";
import { userRegister } from "../types/user-register";
import asyncStorageService from "./async-storage-service";
import { API_URL } from "../config";
import { getTokenCleaned } from "../utitlity/utility";
import { UserApiResponse } from "../types/response-interfase";

/**
 * The function `registerNewUser` asynchronously registers a new user by sending a POST request to an API endpoint,
 * using the provided user data, and returns the HTTP status of the response.
 * @param data 
 * @returns 
 */
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
    console.log("registerNewUser error:", error);
    return 500;
  }
};

/**
 * The function `registerLogin` asynchronously logs in a user by sending a POST request to an API endpoint,
 * using the provided login information, and returns the HTTP status of the response.
 * It also saves the user's token and email in AsyncStorage for future use.
 * @param data 
 * @returns data or null
 */
export const registerLogin = async (data: loginInfo) => {
  try {
    const response = await axios.post(
      `${API_URL}api/auth/login`,
      {
        email: data.email,
        password: data.password,
      }
    );

    if (response.status == 200) {
      await asyncStorageService.saveItemStorage(
        asyncStorageService.KEYS.userToken,
        (response.data as { accessToken: string }).accessToken
      );
      await asyncStorageService.saveItemStorage(
        asyncStorageService.KEYS.userEmail,
        data.email
      );
      return response.status;
    }
    console.log(data);
    return null;
  } catch (error) {
    console.log("registerLogin error:", error);
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  const token = await getTokenCleaned();
  try {
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
    console.log("getUserByEmail bad response:", response.status);
    return null;
  } catch (error) {
    console.log("getUserByEmail error:", error);
    return null;
  }
};

/**
 * The function `updateUser` asynchronously updates a user's information by sending a PUT request to an API endpoint,
 * using the provided user ID and updated user data, and returns the HTTP status of the response.
 * It also deletes the user's token and email from AsyncStorage.
 * @param userId 
 * @param updatedUserData 
 * @returns 
 */
export const updateUser = async ( userId: string, updatedUserData: userRegister) => {
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

    await asyncStorageService.deleteItemStorage(
      asyncStorageService.KEYS.userToken
    );
    await asyncStorageService.deleteItemStorage(
      asyncStorageService.KEYS.userEmail
    );

    return response.status;
  } catch (error) {
    console.log("updateUser error:", error);
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
