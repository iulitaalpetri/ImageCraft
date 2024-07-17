
import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from './AlbumImagesScreen.styles';

const AlbumDetailsScreen = ({ route }) => {
  const { albumId, photo_list } = route.params; // Get photo_list from params
  const [photos, setPhotos] = useState([]);
  const navigation = useNavigation();

  // Instead of fetching all photos, use passed photo_list directly
  useEffect(() => {
    setPhotos(photo_list); // Set photos to the list passed via navigation params
  }, [photo_list]);

  const renderPhoto = ({ item }) => (
    <TouchableOpacity
      style={styles.photoContainer}
      onPress={() => navigation.navigate('ImageScreen', { photo: item, photos: photo_list })}
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
        data={photo_list} // Use photo_list directly
        renderItem={renderPhoto}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        numColumns={3}  // Display three images per row

      />
    </View>
  );
};

export default AlbumDetailsScreen;
