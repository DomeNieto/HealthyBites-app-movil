import AsyncStorage from "@react-native-async-storage/async-storage";


/**
 * This module provides utility functions for managing user-related data in AsyncStorage.
 * It includes functions to save, retrieve, and delete user information such as token and email.
 * 
 * @module asyncStorageService
 */
const KEYS = {
  userToken: 'user-token',
  userEmail: 'user-email',
}

/**
 * Retrieves a value from AsyncStorage by its key.
 * 
 * @param {string} key - The key of the item to retrieve.
 * @returns {Promise<string | null>} - The retrieved value or null if not found.
 */
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

/**
 * Saves a value to AsyncStorage with the specified key.
 * 
 * @param {string} key - The key to save the item under.
 * @param {string} value - The value to save.
 */
const saveItemStorage = async (key:string, value: string) => {
  try {
    if (value !== null) {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    }
  } catch (e) {
    console.log(`AsyncStorage Error: ${e}`);
  }
}

/**
 * Deletes an item from AsyncStorage by its key.
 * 
 * @param {string} key - The key of the item to delete.
 */
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