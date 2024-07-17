// CropImageScreen.js
import React from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

const CropImageScreen = ({ navigation, route }) => {
  const { imageUri } = route.params;

  const handleCrop = () => {
    ImagePicker.openCropper({
      path: imageUri,
      width: 300,
      height: 400
    }).then(image => {
      console.log('Cropped image', image.path);
      // Here you might want to navigate back or update the state with the new image
      navigation.goBack();
    }).catch(error => {
      console.log('Crop failed:', error);
    });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <Button title="Crop Image" onPress={handleCrop} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 400,
    resizeMode: 'contain',
  }
});

export default CropImageScreen;
