import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, Button } from 'react-native';
import NavBar from '../../components/NavBar/NavBar';
import { getAllPhotos } from '../../src/api/photo_api';
import { useIsFocused } from '@react-navigation/native';
import styles from './GalleryScreen.styles';

const GalleryScreen = ({ navigation }) => {
  const [albums, setAlbums] = useState([]);
  const [showNoImagesModal, setShowNoImagesModal] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getAllPhotos().then(photos => {
        if (photos.length > 0) {
          const myPhotosAlbum = {
            title: "My Photos",
            photos: [photos[0]],
            photo_list: photos
          };
          const otherAlbums = processAlbums(photos);
          setAlbums([myPhotosAlbum, ...otherAlbums]);
          setShowNoImagesModal(false);
        } else {
          setAlbums([]);
          setShowNoImagesModal(true); // Show the modal when no photos are returned
        }
      }).catch((error) => {
        console.error('Failed to load photos', error);
        Alert.alert('Error', 'Failed to load photos');
      });
    }
  }, [isFocused]);

  const processAlbums = (photos) => {
    return []; // Implement your album processing logic here
  };

  const renderAlbum = ({ item }) => (
    <TouchableOpacity
      style={styles.albumContainer}
      onPress={() => navigation.navigate('AlbumImagesScreen', { albumId: item.title, photo_list: item.photo_list })}
    >
      {item.photos[0] ? <Image source={{ uri: item.photos[0].image }} style={styles.image} /> : null}
      <Text style={styles.albumTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const navigateToUploadScreen = () => {
    // Navigate to the Upload Photo screen
    navigation.navigate('UploadPhotoScreen');
    setShowNoImagesModal(false);
  };

  const navigateToCameraScreen = () => {
    // Navigate to the Camera screen
    navigation.navigate('TakePhotoScreen');
    setShowNoImagesModal(false);
  };

  return (
    <View style={styles.container}>
      <NavBar navigation={navigation} />
      <FlatList
        data={albums}
        renderItem={renderAlbum}
        keyExtractor={item => item.title}
        contentContainerStyle={styles.listContainer}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNoImagesModal}
        onRequestClose={() => setShowNoImagesModal(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>You have no images. Would you like to upload or take a photo?</Text>
            <Button title="Upload Photo" onPress={navigateToUploadScreen} color="blue" />
            <Button title="Take Photo" onPress={navigateToCameraScreen} color="green" />
            <Button title="Close" onPress={() => setShowNoImagesModal(false)} color="gray" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GalleryScreen;
