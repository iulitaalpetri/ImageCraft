import React, {useEffect, useState, useCallback} from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import styles from './AlbumImagesScreen.styles';
import { getAllPhotos } from '../../src/api/photo_api';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

const AlbumDetailsScreen = ({ route, navigation }) => {
  const { albumId, photo_list } = route.params; // Using albumId from params
  const [photos, setPhotos] = useState([]);

  // Fetch photos and update state
  const fetchPhotos = useCallback(() => {
    if (albumId === "My Photos") {
      getAllPhotos().then(fetchedPhotos => {
        setPhotos(fetchedPhotos);
      }).catch(error => {
        Alert.alert('Error', 'Failed to load photos: ' + error.message);
      });
    }
  }, [albumId]);

  // Use useFocusEffect to fetch photos whenever the screen gains focus
  useFocusEffect(() => {
    fetchPhotos();
  });

  const renderPhoto = ({ item }) => (
    <TouchableOpacity
      style={styles.photoContainer}
      onPress={() => navigation.navigate('ImageScreen', { photo: item, photos })}
    >
      <Image source={{ uri: item.image }} style={styles.photo} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{albumId}</Text>
      <FlatList
        data={photos}
        renderItem={renderPhoto}
        keyExtractor={item => item.id.toString()}  // Ensure each photo has a unique `id`
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default AlbumDetailsScreen;
