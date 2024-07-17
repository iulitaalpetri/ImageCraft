import axios from "axios";
import { saveAuthToken } from "../utils/storage-handler";
import * as SecureStore from "expo-secure-store";
import {TOKEN_KEY} from "../utils/storage-handler";
import { User } from "../models/User.model";



const BACKEND_URL = "";



//---- register user ----
interface RegistrationData {
  username: string;
  email: string;
  password: string;
}

interface RegistrationResponse {
  id: string;
  username: string;
  email: string;
}


export const registerUser = async (userData: RegistrationData): Promise<RegistrationResponse> => {
  try {
      const response = await axios.post(`${BACKEND_URL}/user/register`, userData);
      return response.data;
  } catch (error: any) {
      // Check if error details are in expected format and throw them
      console.warn(`${JSON.stringify(error)}`);
      if (error.response && error.response.data) {
          throw error.response.data; // Throw the detailed error object
      }
      throw new Error('An error occurred during registration'); // General error fallback
  }
};





// ---- login user ----

interface LoginData {
  username: string;
  password: string;
}

interface LoginResponse {
  jwt: string;
}

export const loginUser = async (loginData: LoginData): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${BACKEND_URL}/user/login`, loginData);
    console.log(response.data);
    await saveAuthToken(response.data.jwt); // Save the token using your existing saveAuthToken function
    return response.data;
  } catch (error: any) {
    // Check if error details are in the expected format and throw them
    if (error.response && error.response.data) {
      throw error.response.data; // Throw the detailed error object
    }
    throw new Error('An error occurred during login'); // General error fallback
  }
};


// ---- get logged user ----
export const getUserData = async (): Promise<User> => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) throw new Error('Token not found');

    const response = await axios.get<User>(`${BACKEND_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data; // Throw the detailed error object
    }
    throw new Error('Error fetching user data');
  }
};


// --- logout ---

export const logoutUser = async (): Promise<void> => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) {
      throw new Error('Token not found');
    }

    await axios.get(`${BACKEND_URL}/user/logout`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error: any) {
    
    console.error('An error occurred during logout', error);
    throw error;
  }
};


// ---- delete logged user ----
export const deleteUser = async (): Promise<void> => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) {
      throw new Error('Token not found');
    }

    await axios.get(`${BACKEND_URL}/user/deletelogged`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    await SecureStore.deleteItemAsync(TOKEN_KEY);

  } catch (error: any) {
    console.error('An error occurred during user deletion', error);
    // Throw a detailed error if available or a general error message
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Error deleting user account');
  }
};



// --- check the password before updating the user ---
export const checkPassword = async (password: string): Promise<boolean> => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await axios.post(`${BACKEND_URL}/user/verify`, {password}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('An error occurred during password check', error);
    throw error;
  }
}


// ---- update user ----
interface UpdateData {
  username: string;
  email: string;
  password: string;
}

export const updateUser = async (updateData: UpdateData): Promise<User> => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await axios.patch<User>(`${BACKEND_URL}/user/update`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('An error occurred during user update', error);
    // Parse specific error messages from the backend response
    if (error.response && error.response.data) {
      const errors = error.response.data;
      // Construct a detailed error message based on the backend response
      let errorMessage = 'Error updating user account';
      if (errors.email) {
        errorMessage = `Email error: ${errors.email}`;
      } else if (errors.username) {
        errorMessage = `Username error: ${errors.username}`;
      } else if (typeof errors === 'string') {
        errorMessage = errors;  // Direct string error message from backend
      }
      throw new Error(errorMessage);
    }
    throw new Error('Unknown error updating user account');
  }
};