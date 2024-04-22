import React, { useState } from 'react';
import { View, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity, Modal, Text, Button, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { deletePhoto, startEditSession } from '../../src/api/photo_api';
import { Ionicons } from '@expo/vector-icons';


const { width, height } = Dimensions.get('window');

const ImageScreen = ({ route, navigation }) => {
  const { photo, photos } = route.params;
  const [photoList, setPhotoList] = useState(photos); // Manage the photo list in the state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNoPhotosModal, setShowNoPhotosModal] = useState(false); // State to control the no photos left modal

  const handleDelete = async () => {
    try {
      const response = await deletePhoto(photo.id);
      alert(response.message);
      const updatedPhotos = photoList.filter(p => p.id !== photo.id);
      setPhotoList(updatedPhotos); // Update the state to remove the deleted photo
      
      if (updatedPhotos.length === 0) {
        setShowNoPhotosModal(true); // Show modal if no photos are left
      } else {
        // Determine new index to display
        let newIndex = photoList.findIndex(p => p.id === photo.id) - 1;
        if (newIndex < 0) newIndex = 0; // If there's no previous, go to the first
        navigation.replace('ImageScreen', { photo: updatedPhotos[newIndex], photos: updatedPhotos }); // Replace to refresh the props
      }
    } catch (error) {
      alert('Failed to delete the photo: ' + error.message);
    }
  };

  const handleStartEdit = async () => {
    try {
      const response = await startEditSession(photo.id);
      Alert.alert('Success', 'Edit session started successfully!');
      navigation.navigate('EditPhotoScreen', { photoId: photo.id, photoUri: photo.image });
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to start edit session');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.image }} style={styles.fullImage} />
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <FlatList
        horizontal
        pagingEnabled
        data={photoList}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        initialScrollIndex={photoList.findIndex(p => p.id === photo.id)}
        getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => setShowDeleteModal(true)}>
          <MaterialIcons name="delete" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleStartEdit}>
          <MaterialIcons name="edit" size={28} color="white" />
        </TouchableOpacity>
      </View>
      {/* Modals and other components */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    top: 10
  },
  fullImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    bottom: 20
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#0c0c33', // Slightly darker grey for the button background
    flexDirection: 'row',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: '',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  editButton: {
    height: 50, // height of the button area
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDD', // optional: style for the button background
  },
  buttonText: {
    color: 'white', // Ensure text is white
    marginLeft: 5, // Give some space between the icon and the text
  },
  backButton: {
    position: 'absolute',
    top: 60, // Adjust as needed for spacing from the top
    left: 10, // Adjust as needed for spacing from the left
    padding: 10,
  },
});

export default ImageScreen;
