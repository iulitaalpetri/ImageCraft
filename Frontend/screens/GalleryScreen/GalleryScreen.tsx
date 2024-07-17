import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, Button } from 'react-native';
import NavBar from '../../components/NavBar/NavBar';
import { getAllPhotos } from '../../src/api/photo_api';
import { useIsFocused } from '@react-navigation/native';
import styles from './GalleryScreen.styles';
import { fetchDetectedFaces } from '../../src/api/detected_faces_api';
import { getAllPersons } from '../../src/api/person_api';
import { getAllPhotosWithPerson } from '../../src/api/photo_api';
import { getHappyPhotos } from '../../src/api/photo_api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import Icon component
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';



const GalleryScreen = ({ navigation }) => {
  const [albums, setAlbums] = useState([]);
  const [showNoImagesModal, setShowNoImagesModal] = useState(false);
  const isFocused = useIsFocused();


    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
      });



      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        navigation.navigate('PhotoPreviewScreen', { photoUri: uri });
    }
    };

    const takePhoto = async () => {
      let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          aspect: [4, 3],
          quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        navigation.navigate('PhotoPreviewScreen', { photoUri: uri });
    }
    }

  useEffect(() => {
    const fetchAndProcessPhotos = async () => {
      if (isFocused) {
        try {
          const photos = await getAllPhotos();
          if (photos.length > 0) {
            const processedAlbums = await processAlbums(photos);
            setAlbums(processedAlbums);
            setShowNoImagesModal(false);
          } else {
            setAlbums([]);
            setShowNoImagesModal(true);
          }
        } catch (error) {
          console.error('Failed to load photos', error);
          Alert.alert('Error', 'Failed to load photos');
        }
      }
    };
  
    fetchAndProcessPhotos();
  }, [isFocused]);
  
  const processAlbums = async (photos) => {
    const albums = [];
  
    albums.push({
      id: "1",
      title: "My Photos",
      photos: photos.slice(0, 1),     
      photo_list: photos
    });
  
    const catsPhotos = photos.filter(photo => photo.cats);
    if (catsPhotos.length > 0) {
      albums.push({
        id: "2",
        title: "Cats",
        photos: catsPhotos.slice(0, 1),
        photo_list: catsPhotos
      });
    }
  
    const dogsPhotos = photos.filter(photo => photo.dogs);
    if (dogsPhotos.length > 0) {
      albums.push({
        id: "3",
        title: "Dogs",
        photos: dogsPhotos.slice(0, 1),
        photo_list: dogsPhotos
      });
    }
  
    const photosWithFaces = await Promise.all(photos.map(async photo => {
      const faces = await fetchDetectedFaces(photo.id);
      return { ...photo, faces };
    }));
  
    const facesPhotos = photosWithFaces.filter(photo => photo.faces.length > 0);
    if (facesPhotos.length > 0) {
      albums.push({
        id: "4",
        title: "Friends & Family",
        photos: facesPhotos.slice(0, 1),
        photo_list: facesPhotos
      });

      
    }

    

    const persons = await getAllPersons();
  let albumId = 5; // Start from 5 assuming you have 4 predefined albums (My Photos, Cats, Dogs, Friends & Family)
  await Promise.all(persons.map(async (person) => {

    const personPhotos = await getAllPhotosWithPerson(person.id);
    
    if (personPhotos.length > 0) {
      albums.push({
        id: `album-${albumId++}`, // Increment the albumId for each new album
        title: person.name,
        photos: personPhotos.slice(0, 1),  
        photo_list: personPhotos
      });
    }
  }));

  const happyPhotos = await getHappyPhotos();
  if (happyPhotos.length > 0) {
    albums.push({
      id: "5", // Ensure this ID is unique and does not conflict with other album IDs
      title: "Happy Moments",
      photos: happyPhotos.slice(0, 1), // Show first happy photo as album cover
      photo_list: happyPhotos
    });
  }

  
    return albums;
  };
  
  

  const renderAlbum = ({ item }) => (
  <TouchableOpacity
    style={styles.albumContainer}
    onPress={() => navigation.navigate('AlbumImagesScreen', {
      albumId: item.title,
      photo_list: item.photo_list
    })}
  >
    {item.photos[0] ? <Image source={{ uri: item.photos[0].image }} style={styles.image} /> : null}
    <Text style={styles.albumTitle}>{item.title}</Text>
  </TouchableOpacity>
);


  

  return (
    <View style={styles.container}>
      {albums.length > 0 ? (
        <FlatList
          data={albums}
          renderItem={renderAlbum}
          keyExtractor={item => item.name + item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.noImagesContainer}>
  <Text style={styles.noImagesText}>You have no photos. Upload or take a photo and start your journey.</Text>
  <TouchableOpacity style={styles.button} onPress={pickImage}>
    <Icon name="cloud-upload" size={24} color="#FFFFFF" />
    <Text style={styles.buttonText}>Upload Photo</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.button} onPress={takePhoto}>
    <Icon name="camera" size={24} color="#FFFFFF" />
    <Text style={styles.buttonText}>Take Photo</Text>
  </TouchableOpacity>
</View>
      )}
    </View>
  );
};

export default GalleryScreen;
