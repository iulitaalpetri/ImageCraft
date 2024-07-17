// UploadPhotoScreen.tsx
import React from 'react';
import { Button, View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import styles from './UploadPhotoScreen.styles';

const UploadPhotoScreen = () => {
    const navigation = useNavigation();

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
      });

      console.log("Image Picker Result:", result); // Check the entire result object


      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        console.log("Image URI:", uri); // Ensure this logs correctly
        navigation.navigate('PhotoPreviewScreen', { photoUri: uri });
    }
    };

    return (
        <View style={styles.container}>
            <Button title="Select Photo" onPress={pickImage} />
        </View>
    );
};

export default UploadPhotoScreen;
