import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  userToken: "user-token",
  userEmail: "user-email",
};

const getUser = async (key: string): Promise<string | null> => {
  try {
    const stored = await AsyncStorage.getItem(key);
    if (!stored) return null;
    if (stored.startsWith('"') && stored.endsWith('"')) {
      return stored.slice(1, -1);
    }
    return stored;
  } catch (e) {
    console.log(`AsyncStorage Error: ${e}`);
    return null;
  }
};

async function saveUser<T>( //store
  key: string,
  value: T
): Promise<void | null | undefined> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(`AsyncStorage Error: ${e}`);
  }
}

const deleteTokenUser = async (key: string): Promise<any | null> => {
  try {
    const v = await AsyncStorage.removeItem(key);
    console.log(v);
  } catch (e) {
    console.log(`AsyncStorage Error: ${e}`);
  }
  return null;
};

////////////////////////////////////////////////////////////////////////
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem("user-token");
  } catch (e) {
    console.error("AsyncStorage: Error al obtener el token:", e);
    return null;
  }
};

export const storeData = async (value: string | null) => {
  try {
    if (value !== null) {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("user-token", jsonValue);
    }
  } catch (e) {
    console.error("AsyncStorage: Error guardando el token:", e);
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("user-token");
  } catch (e) {
    console.log(`AsyncStorage Error: ${e}`);
  }
};

////////////////////////////////////////////////////////////////////////

const asyncStorageService = {
  KEYS,
  saveUser,
  getUser,
  deleteTokenUser,
};

export default asyncStorageService;
