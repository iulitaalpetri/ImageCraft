import axios from 'axios';
import * as SecureStore from "expo-secure-store";



const BACKEND_URL = "";



export const addPerson = async (detectedFaceId: string, name: string) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/person/add/${detectedFaceId}`, {
            name: name
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error adding person:', error);
        throw error;
    }
};


export const getAllPersons = async (): Promise<any[]> => {
    try {
        const response = await axios.get(`${BACKEND_URL}/person/all`, {
            withCredentials: true, 
        });

        // Assuming the image path needs to be prefixed with the BACKEND_URL to form a complete URL
        const personsWithHttpPaths = response.data.map(person => ({
            ...person,
            image: `${BACKEND_URL}/${person.image}` // Modify the image path
        }));

        return personsWithHttpPaths; 
    } catch (error) {
        console.error('Error fetching persons:', error);
        throw error;
    }
};