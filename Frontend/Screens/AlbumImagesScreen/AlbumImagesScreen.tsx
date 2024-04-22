import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAllPhotos } from '../../src/api/photo_api';
import styles from './AlbumImagesScreen.styles';

const AlbumDetailsScreen = ({ route }) => {
  const { albumId } = route.params;
  const [photos, setPhotos] = useState([]);
  const navigation = useNavigation();

  const fetchPhotos = useCallback(() => {
    if (albumId === "My Photos") {
      getAllPhotos().then(fetchedPhotos => {
        setPhotos(fetchedPhotos);
      }).catch(error => {
        Alert.alert('Error', 'Failed to load photos: ' + error.message);
      });
    }
  }, [albumId]);

  useFocusEffect(
    useCallback(() => {
      fetchPhotos();
    }, [fetchPhotos])
  );

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
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <FlatList
        data={photos}
        renderItem={renderPhoto}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        numColumns={3}  // Display three images per row
      />
    </View>
  );
};

export default AlbumDetailsScreen;
