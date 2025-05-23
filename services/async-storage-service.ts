import AsyncStorage from "@react-native-async-storage/async-storage";


const KEYS = {
  userToken: 'user-token',
  userEmail: 'user-email',
}
const getInfoStorage = async (key: string) => {
  try {
    const stored = await AsyncStorage.getItem(key);
    if (!stored) return null;
    return stored;
  } catch (e) {
    console.log(`AsyncStorage Error: ${e}`);
    return null;
  }
};


const saveItemStorage = async (key:string, value: string) => {
  try {
    if (value !== null) {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("user-token", jsonValue);
    }
  } catch (e) {
    console.log(`AsyncStorage Error: ${e}`);
  }
}

const deleteItemStorage = async (key: string)  => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(`AsyncStorage Error: ${e}`);
  }
};

const asyncStorageService = {
  KEYS,
  saveItemStorage,
  getInfoStorage,
  deleteItemStorage,
};

export default asyncStorageService;