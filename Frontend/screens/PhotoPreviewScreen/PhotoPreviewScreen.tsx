import React, {useState} from 'react';
import { View, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './PhotoPreviewScreen.styles';
import { uploadPhoto, startEditSession } from '../../src/api/photo_api';  // Adjust the import path as necessary
import Icon from 'react-native-vector-icons/MaterialIcons';
import LoadingOverlay from '../../components/LoadingPage/LoadingPage';
import { getAllPhotos } from '../../src/api/photo_api';



interface PhotoPreviewScreenProps {
    route: {
        params: {
            photoUri: string;
        };
    };
}

const PhotoPreviewScreen: React.FC<PhotoPreviewScreenProps> = ({ route }) => {
    const { photoUri } = route.params;
    console.log("Received URI in PhotoPreviewScreen:", photoUri);
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);


//     const handleSavePhoto = async () => {
//   setIsLoading(true);

//   try {
//     const photoData = { image: { uri: photoUri, type: 'image/jpeg', name: 'photo.jpg' } };
//     const uploadResponse = await uploadPhoto(photoData);

//     if (uploadResponse) {
//       // Assuming the uploadResponse contains the ID of the new photo
//       const newPhotoId = uploadResponse.id;

//       // Fetch all photos to get the updated list
//       const updatedPhotos = await getAllPhotos();
      
//       // Find the newly uploaded photo in the list to pass its details to the ImageScreen
//       const newPhoto = updatedPhotos.find(p => p.id === newPhotoId);

//       if (newPhoto) {
//         // Navigate to ImageScreen with new photo details
//         navigation.navigate('ImageScreen', { photo: newPhoto, photos: updatedPhotos });
//       } else {
//         throw new Error("New photo details not found after upload.");
//       }
//     }
//   } catch (error) {
//     Alert.alert('Error', 'Failed to upload photo: ' + error.message);
//   }
  
//   setIsLoading(false);
// };


const handleSavePhoto = async () => {
    setIsLoading(true);
  
    try {
      const photoData = { image: { uri: photoUri, type: 'image/jpeg', name: 'photo.jpg' } };
      const uploadResponse = await uploadPhoto(photoData);
  
      if (uploadResponse) {
        const newPhotoId = uploadResponse.id;
  
        const updatedPhotos = await getAllPhotos();
        
        const newPhoto = updatedPhotos.find(p => p.id === newPhotoId);
  
        if (newPhoto) {
          navigation.replace('ImageScreen', { photo: newPhoto, photos: updatedPhotos });
        } else {
          throw new Error("New photo details not found after upload.");
        }
      }
    } catch (error) {
      console.warn(`${JSON.stringify(error)}`)
      Alert.alert('Error', 'Failed to upload photo: ' + error.message);
    }
    
    setIsLoading(false);
  };
  

    const handleStartEdit = async () => {
        setIsLoading(true);
        try {
            const photoData = { image: { uri: photoUri, type: 'image/jpeg', name: 'photo.jpg' } };
            const response = await uploadPhoto(photoData);
            const photoId = response.id;
            const resp = await startEditSession(photoId);

            // Navigate to the edit screen and pass the photo ID and the URI
            navigation.replace('EditPhotoScreen', { photoId, photoUri });
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to start edit session');
        }
        setIsLoading(false);
      };

      return (
        <View style={styles.container}>
        <LoadingOverlay isLoading={isLoading} />

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color="0c0c33" />
            </TouchableOpacity>
            <Image source={{ uri: photoUri }} style={styles.image} />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSavePhoto}>
                  <Icon name="save" size={24} color="#FFFFFF" />
                    <Text style={styles.backButtonText}>Save Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleStartEdit}>
                  <Icon name="edit" size={24} color="#FFFFFF" />
                    <Text style={styles.backButtonText}>Edit Photo</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PhotoPreviewScreen;
