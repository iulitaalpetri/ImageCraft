import React from 'react';
import { View, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './PhotoPreviewScreen.styles';
import { uploadPhoto } from '../../src/api/photo_api';  // Adjust the import path as necessary

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

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Image source={{ uri: photoUri }} style={styles.image} />
            <TouchableOpacity style={styles.saveButton} onPress={handleSavePhoto}>
                <Text style={styles.backButtonText}>Save Photo</Text>
            </TouchableOpacity>
        </View>
    );
};

export default PhotoPreviewScreen;
