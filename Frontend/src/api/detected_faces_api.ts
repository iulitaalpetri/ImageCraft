import axios from 'axios';
import * as SecureStore from "expo-secure-store";



const BACKEND_URL = "";


interface DetectedFace {
    id: number;
    image: string;
    emotion: string;
  }
  
  interface FetchFacesResponse {
    detectedFaces: DetectedFace[];
  }
  
  // Function to fetch detected faces associated with a specific image
  export const fetchDetectedFaces = async (imageId: number): Promise<DetectedFace[]> => {
    // Retrieve the JWT token from storage
    const token = await SecureStore.getItemAsync('jwt');
  
    try {
      const response = await axios.get<FetchFacesResponse>(`${BACKEND_URL}/detected_face/all/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
    const updatedFaces = response.data.map(face => ({
      ...face,
      image: `${BACKEND_URL}${face.image}` // Prepend the backend URL to the image path
    }));
  
    console.log(updatedFaces);
    return updatedFaces;
    } catch (error) {
      console.error('Failed to fetch detected faces:', error);
      throw new Error('Failed to fetch detected faces');
    }
  };



export const isDetectedFacePerson = async (detectedFaceId: string): Promise<string | boolean> => {
    try {
        const response = await axios.get(`${BACKEND_URL}/detected_face/isperson/${detectedFaceId}`, {
            withCredentials: true, // Assuming cookies are used for auth
        });

        return response.data; // This could be the person's name or false
    } catch (error) {
        console.error('Error checking detected face:', error);
        throw error;
    }
};