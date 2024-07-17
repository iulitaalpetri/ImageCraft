import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export const TOKEN_KEY = "USER_AUTH_TOKEN";
const EXPIRATION_KEY = "TOKEN_EXPIRATION";

export const saveAuthToken = async (token: string): Promise<void> => {
  const expirationDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); 
  try {
    await SecureStore.setItem(TOKEN_KEY, token);
    await SecureStore.setItem(EXPIRATION_KEY, expirationDate.toISOString());
  } catch (error) {
    console.error("Error saving the auth token:", error);
  }
};




