import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Photo } from "../models/Photo.model";
import { DetectedFaces } from "../models/DetectedFaces.model";
import { getDetectedFacesImage } from "./detected_faces_api";

const BACKEND_URL = "";


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
    const imageId = response.data.id;
    console.log("Image ID:", imageId);
  


    return response.data;
  } catch (error: any) {
    // Handle errors
    console.log(`Error uploading photo to backend: ${JSON.stringify(error)}`)
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('An error occurred during photo upload');
  }
};

// ----- delete photo ----
// API call to delete a photo
interface DeletePhotoResponse {
  message: string;
  status: number;
}

export const deletePhoto = async (photoId: number): Promise<DeletePhotoResponse> => {
  const token = await SecureStore.getItemAsync('jwt'); // Retrieve the JWT token from secure storage

  try {
      const response = await axios.post<DeletePhotoResponse>(
          `${BACKEND_URL}/photo/delete/${photoId}`,  // Ensure this matches your actual API endpoint
          {},
          {
              headers: {
                  Authorization: `Bearer ${token}`,  // Use the JWT token for authorization
                  'Content-Type': 'application/json',
              },
          }
      );
      console.log("Delete response:", response.data);
      return response.data;
  } catch (error: any) {
      // Handle errors
      if (error.response && error.response.data) {
          throw error.response.data;
      }
      throw new Error('Failed to delete the photo');
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

// ---get current uri ---
interface CurrentUriResponse{
  message : string;
  status: number;
  current_uri: string;
  current_base64: string;

}



export const getCurrentUri = async (): Promise<CurrentUriResponse> => {
  const token = await SecureStore.getItemAsync('jwt');

  try {
    const response = await axios.get<CurrentUriResponse>(
      `${BACKEND_URL}/photo/currenturi`,
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
    throw new Error('Failed to get current uri');
  }
}


//---- crop ----
interface CropParams {
  left: string;
  upper: string;
  rght: string;
  bottom: string;
}

interface CropResponse {
  message: string;
  status: number;
  current_uri: string;
}

export const cropImage = async (photoId: number, cropParams: CropParams): Promise<CropResponse> => {
  const token = await SecureStore.getItemAsync('jwt');

  try {
    const response = await axios.post<CropResponse>(
      `${BACKEND_URL}/photo/crop`,
      cropParams,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Use the JWT token for authorization
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response.data)
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Failed to crop the image');
  }
};  


// ---- rotate ------
interface RotateImageResponse {
  message: string;
  status: number;
  current_uri: string;
}

export const rotateImage = async (photoId: number, angle: number): Promise<RotateImageResponse> => {
  const token = await SecureStore.getItemAsync('jwt');

  try {
    const response = await axios.post<RotateImageResponse>(
      `${BACKEND_URL}/photo/rotate`,
      { angle },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Use the JWT token for authorization
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("Rotate response:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Failed to rotate the image');
  }
};


// ---- resize ---
interface ResizeImageResponse {
  message: string;
  status: number;
  current_uri: string;
}


export const resizeImage = async (photoId: number, width: number, height: number): Promise<ResizeImageResponse> => {
  const token = await SecureStore.getItemAsync('jwt');  // Assuming you're using Expo's SecureStore to handle JWT tokens

  try {
    const response = await axios.post<ResizeImageResponse>(
      `${BACKEND_URL}/photo/resize`, // Make sure this URL matches your Django URL pattern
      { width, height },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Use the JWT token for authorization
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("Resize response:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Failed to resize the image');
  }
};


//-- flip ---
interface FlipParams {
  axis: 'horizontal' | 'vertical';
}

interface FlipResponse {
  message: string;
  status: number;
  current_uri: string;
}

export const flipImage = async (photoId: number, axis: 'horizontal' | 'vertical'): Promise<FlipResponse> => {
  const token = await SecureStore.getItemAsync('jwt');

  try {
    const response = await axios.post<FlipResponse>(
      `${BACKEND_URL}/photo/flip`, // Adjust if your URL requires a different format
      { axis },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Flip response:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Failed to flip the image');
  }
};


// brightness
interface BrightnessParams {
  factor: number;  // Factor by which to adjust the brightness
}

interface BrightnessResponse {
  message: string;
  status: number;
  current_uri: string;
}

export const adjustBrightness = async (photoId: number, brightnessParams: BrightnessParams): Promise<BrightnessResponse> => {
  const token = await SecureStore.getItemAsync('jwt');  // Retrieve the JWT token from secure storage

  try {
    const response = await axios.post<BrightnessResponse>(
      `${BACKEND_URL}/photo/brightness`,  // Ensure the endpoint matches your Django URL pattern
      brightnessParams,
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Use the JWT token for authorization
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("Brightness response:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Failed to adjust brightness');
  }
};

//contrast 
interface ContrastParams {
  factor: number;  // Factor by which to adjust the contrast
}

interface ContrastResponse {
  message: string;
  status: number;
  current_uri: string;
}


export const adjustContrast = async (photoId: number, contrastParams: ContrastParams): Promise<ContrastResponse> => {
  const token = await SecureStore.getItemAsync('jwt');  // Assuming you're using Expo's SecureStore to handle JWT tokens

  try {
    const response = await axios.post<ContrastResponse>(
      `${BACKEND_URL}/photo/contrast`,  // Ensure the endpoint matches your Django URL pattern
      contrastParams,
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Use the JWT token for authorization
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("Contrast response:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Failed to adjust contrast');
  }
};


// --- sharpness ---
// nu cred ca este bineeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
interface SharpnessParams {
  factor: number;  // Factor by which to adjust the sharpness
}

interface SharpnessResponse {
  message: string;
  status: number;
  current_uri: string;
}


export const adjustSharpness = async (photoId: number, sharpnessParams: SharpnessParams): Promise<SharpnessResponse> => {
  const token = await SecureStore.getItemAsync('jwt');  // Retrieve the JWT token from secure storage

  try {
    const response = await axios.post<SharpnessResponse>(
      `${BACKEND_URL}/photo/sharpness`,  // Adjust if your URL requires a different format
      sharpnessParams,
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Use the JWT token for authorization
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("Sharpness response:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Failed to adjust sharpness');
  }
};


// --- grayscale ---
interface GrayscaleResponse {
  message: string;
  status: number;
  current_uri: string;
}


export const convertToGrayscale = async (photoId: number): Promise<GrayscaleResponse> => {
  const token = await SecureStore.getItemAsync('jwt');  // Retrieve the JWT token from secure storage

  try {
    const response = await axios.post<GrayscaleResponse>(
      `${BACKEND_URL}/photo/color`, // Make sure the endpoint URL matches your Django URL pattern
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Use the JWT token for authorization
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("Grayscale response:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Failed to convert to grayscale');
  }
};


// denoise ---------------
interface DenoiseResponse {
  message: string;
  status: number;
  current_uri: string;
}

export const denoiseImage = async (photoId: number): Promise<DenoiseResponse> => {
  const token = await SecureStore.getItemAsync('jwt');  // Retrieve the JWT token from secure storage

  try {
    const response = await axios.post<DenoiseResponse>(
      `${BACKEND_URL}/photo/denoise`,  // Ensure the endpoint matches your Django URL pattern
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Use the JWT token for authorization
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("Denoise response:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Failed to denoise the image');
  }
};



// --- save changes ---
interface SaveChangesResponse {
  message: string;
  status: number;
}


export const saveChanges = async (): Promise<SaveChangesResponse> => {
  const token = await SecureStore.getItemAsync('jwt');  // Retrieve the JWT token from secure storage

  try {
    const response = await axios.post<SaveChangesResponse>(
      `${BACKEND_URL}/photo/save`,  // Ensure the endpoint matches your Django URL pattern
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Use the JWT token for authorization
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("Save changes response:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Failed to save changes');

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



// --- undo changes ---

interface UndoResponse {
  message: string;
  status: number;
  current_uri?: string; // This might not be present if it's an error
}

// API call to undo changes
export const undoChanges = async (photoId: number): Promise<UndoResponse> => {
  const token = await SecureStore.getItemAsync('jwt'); // Assuming you're using Expo's SecureStore for token management

  try {
    const response = await axios.post<UndoResponse>(
      `${BACKEND_URL}/photo/undo`, // Ensure this matches your Django URL for undoing changes
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // JWT token for authorization
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("Undo response:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Failed to undo changes');
  }
};



// --- gallery apis ----
interface Photo {
  id: number;
  image: string | null;
  date: string;
  detectedObjects: any[];
  detectedFaces: any[];
  cats: boolean;
  dogs: boolean;
}

interface PhotosResponse {
  photos: Photo[];
}

// Fetch all photos associated with the user
export const getAllPhotos = async (): Promise<Photo[]> => {
  const token = await SecureStore.getItemAsync('jwt'); // Retrieve the JWT token from secure storage

  try {
    const response = await axios.get<Photo[]>(`${BACKEND_URL}/photo/all`, {
      headers: {
        Authorization: `Bearer ${token}`, // Use the JWT token for authorization
      },
    });

    console.log("Photos response:", response.data);

    // Assuming the API directly returns an array of Photo objects
    // If the response structure is different, you'll need to adjust the mapping accordingly
    return response.data.map(photo => ({
      ...photo,
      // add backend url to the image path
      image: `${BACKEND_URL}${photo.image}`,
      detectedObjects:  [],
      detectedFaces:  []
    }));
  }
  catch (error: any) {
    console.error('Error fetching photos:', error);
    // Improved error handling
    if (axios.isAxiosError(error)) {
      // Handling errors returned from Axios specifically
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.error('Error data:', error.response.data);
        throw new Error(`Failed to fetch photos: ${error.response.status} ${error.response.statusText}`);
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response received from the server');
      }
    }
    // Throw a generic error message if the error format is not as expected
    throw new Error('Failed to fetch photos');
  }
};


// get all person photo
export const getAllPhotosWithPerson = async (personId: string): Promise<any[]> => {
  try {
      const response = await axios.get(`${BACKEND_URL}/photo/person/${personId}`, {
          withCredentials: true, 
      });

      // Convert relative image paths to absolute URLs
      const photosWithAbsolutePaths = response.data.map(photo => ({
          ...photo,
          image: `${BACKEND_URL}${photo.image}`  // Append the BACKEND_URL to the relative path
      }));

      return photosWithAbsolutePaths; 
  } catch (error) {
      console.error('Error fetching photos:', error);
      throw error;
  }
};


// Function to fetch happy photos
export const getHappyPhotos = async (): Promise<Photo[]> => {
  const token = await SecureStore.getItemAsync('jwt'); // Retrieve the JWT token from secure storage

  try {
    const response = await axios.get<Photo[]>(`${BACKEND_URL}/photo/happy`, {
      headers: {
        Authorization: `Bearer ${token}`, // Use the JWT token for authorization
      },
    });

    console.log("Happy Photos response:", response.data);

    // Assuming the API directly returns an array of Photo objects
    // If the response structure is different, you'll need to adjust the mapping accordingly
    return response.data.map(photo => ({
      ...photo,
      image: `${BACKEND_URL}${photo.image}`, // Append the BACKEND_URL to the image path if necessary
    }));
  } catch (error: any) {
    console.error('Error fetching happy photos:', error);
    // Improved error handling
    if (axios.isAxiosError(error)) {
      // Handling errors returned from Axios specifically
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.error('Error data:', error.response.data);
        throw new Error(`Failed to fetch happy photos: ${error.response.status} ${error.response.statusText}`);
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response received from the server');
      }
    }
    // Throw a generic error message if the error format is not as expected
    throw new Error('Failed to fetch happy photos');
  }
};


