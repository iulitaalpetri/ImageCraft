import axios from "axios";
import { User } from "../models/user";
import { API_URL } from "../config";
import { BASE_URL } from '@env';
import { saveAuthToken } from "../utils/storage-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";
import {TOKEN_KEY} from "../utils/storage-handler";
import { Photo } from "../models/Photo.model";


const BACKEND_URL = "http://:8000";


// -- add photo - --
interface PhotoData {
    image: File; // This should be a File object containing the image
  }
  
  interface PhotoResponse {
    id: number;
    image: string;
    date: string; // Assuming date is returned as a string
    detectedObjects: any[];
    detectedFaces: any[];
  }

  
// va trebui schimbat in functie de cum adaug poza
export const uploadPhoto = async (photoData: PhotoData): Promise<PhotoResponse> => {
  // Retrieve the JWT token from secure storage
  const token = await SecureStore.getItemAsync('jwt');

  // Prepare FormData
  const formData = new FormData();
  formData.append('image', {
    uri: photoData.image.uri,
    type: 'image/jpeg', // Or whichever file type your image is
    name: 'upload.jpg', // This should be the filename
  });

  try {
    const response = await axios.post<PhotoResponse>(`${BACKEND_URL}/photo/add`, formData, {
      headers: {
        Authorization: `Bearer ${token}`, // Make sure your backend expects the token as a Bearer token
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data)

    return response.data;
  } catch (error: any) {
    // Handle errors
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('An error occurred during photo upload');
  }
};


// --- edit ---

interface StartEditSessionResponse {
  message: string;
  status: number;
}



export const startEditSession = async (photoId: number): Promise<StartEditSessionResponse> => {

  const token = await SecureStore.getItemAsync('jwt');

  try {
    const response = await axios.post<StartEditSessionResponse>(
      `${BACKEND_URL}/photo/startedit/${photoId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Use the JWT token for authorization
        },
      }
    );
    return response.data;
  } catch (error: any) {


    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Failed to start edit session');
  }
};

interface DismissChangesResponse {
  message: string;
  status: number;
}


export const dismissChanges = async (photoId: number): Promise<DismissChangesResponse> => {
  const token = await SecureStore.getItemAsync('jwt');

  try {
    const response = await axios.post<DismissChangesResponse>(
      `${BACKEND_URL}/photo/dismiss`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Use the JWT token for authorization
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Failed to dismiss changes');
  }
};
