// src/services/storageService.js
import * as SecureStore from "expo-secure-store";

export const storageService = {
  // Save data
  setItem: async (key, value) => {
    try {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Error saving data:", error);
      return false;
    }
  },

  // Get data
  getItem: async (key) => {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Error reading data:", error);
      return null;
    }
  },

  // Remove data
  removeItem: async (key) => {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (error) {
      console.error("Error removing data:", error);
      return false;
    }
  },
};
