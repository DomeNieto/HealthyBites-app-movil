import { userRegister } from "../types/user-register";

const API_URL = "http://192.168.0.123:8082/api/v1/users";

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

export default { registerNewUser };
