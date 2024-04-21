import React, { useState } from 'react';
import { View, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity, Modal, Text, Button, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { deletePhoto, startEditSession } from '../../src/api/photo_api';

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
      <TouchableOpacity style={styles.deleteButton} onPress={() => setShowDeleteModal(true)}>
        <MaterialIcons name="delete" size={28} color="red" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.editButton} onPress={handleStartEdit}>
        <MaterialIcons name="edit" size={28} color="blue" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to delete this photo?</Text>
            <Button title="Yes" onPress={handleDelete} color="red" />
            <Button title="No" onPress={() => setShowDeleteModal(false)} color="blue" />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNoPhotosModal}
        onRequestClose={() => {
          setShowNoPhotosModal(false);
          navigation.goBack(); // Go back after closing the modal
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>You have no more photos.</Text>
            <Button title="OK" onPress={() => {
              setShowNoPhotosModal(false);
              navigation.goBack();
            }} color="blue" />
          </View>
        </View>
      </Modal>
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
  },
  fullImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  deleteButton: {
    position: 'absolute',
    top: 45,
    right: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    color: '#FFF',
  }
});

export default ImageScreen;
