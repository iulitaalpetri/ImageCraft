import React from 'react';
import { View, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './PhotoPreviewScreen.styles';
import { uploadPhoto, startEditSession } from '../../src/api/photo_api';  // Adjust the import path as necessary

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

    const handleSavePhoto = async () => {
        try {
            const photoData = { image: { uri: photoUri, type: 'image/jpeg', name: 'photo.jpg' } };
            const response = await uploadPhoto(photoData);
            Alert.alert('Success', 'Photo uploaded successfully!');
            // Optional: navigate or do other actions after successful upload
        } catch (error) {
            Alert.alert('Error', 'Failed to upload photo: ' + error.message);
        }
    };

    const handleStartEdit = async () => {
        try {
            // salvam poza si trebuie sa trimitem id ul spre pagina de editare si atat
            const photoData = { image: { uri: photoUri, type: 'image/jpeg', name: 'photo.jpg' } };
            const response = await uploadPhoto(photoData);
            const photoId = response.id;
            const resp = await startEditSession(photoId);
            Alert.alert('Success', 'Edit session started successfully!');
            // Navigate to the edit screen and pass the photo ID and the URI
            navigation.navigate('EditPhotoScreen', { photoId, photoUri });
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to start edit session');
        }
      };

      return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Image source={{ uri: photoUri }} style={styles.image} />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSavePhoto}>
                    <Text style={styles.backButtonText}>Save Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleStartEdit}>
                    <Text style={styles.backButtonText}>Edit Photo</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PhotoPreviewScreen;
