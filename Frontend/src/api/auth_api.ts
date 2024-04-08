import axios from "axios";
import { User } from "../models/user";
import { API_URL } from "../config";
import { BASE_URL } from '@env';


const BACKEND_URL = process.env.BASE_URL;



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

export const registerUser = async(
  userData: RegistrationData
): Promise<RegistrationResponse> => {
  try {
    const response = await axios.post(`${BACKEND_URL}/user/register/`, userData);
    return response.data;
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(error.response?.data?.detail || 'An error occurred during registration');
  }
};    




export const loginUser = async (
  email: string,
  password: string,
): Promise<User> => {
  try {
    const response = await axios.post(`${BACKEND_URL}/login/`, {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.detail || 'An error occurred during login');
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await axios.post(`${BACKEND_URL}/logout/`);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error(error.response?.data?.detail || 'An error occurred during logout');
  }
};


interface UpdateUserData {
  username?: string;
  email?: string;
  password?: string;
}

// Function to update user data
export const updateUser = async (userData: UpdateUserData): Promise<AxiosResponse<any>> => {
  try {
    const response = await axios.patch(`${BACKEND_URL}/update/`, userData, {
      withCredentials: true // This is necessary to send cookies with the request
    });
    return response;
  } catch (error: any) {
    console.error('Update error:', error);
    throw new Error(error.response?.data?.detail || 'An error occurred during the update');
  }
};

// Function to delete the logged user
export const deleteUser = async (): Promise<AxiosResponse<any>> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/delete/`, {
      withCredentials: true // This is necessary to send cookies with the request
    });
    return response;
  } catch (error: any) {
    console.error('Deletion error:', error);
    throw new Error(error.response?.data?.detail || 'An error occurred during the deletion');
  }
};