import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAllPersons } from '../../src/api/person_api';
import { getAllPhotosWithPerson } from '../../src/api/photo_api';
import styles from './FriendsScreen.styles';

const FriendsScreen = () => {
  const [persons, setPersons] = useState([]);
  const navigation = useNavigation();

  const fetchPersonsAndPhotos = async () => {
    try {
      const personsData = await getAllPersons();
      const personsWithPhotos = await Promise.all(personsData.map(async person => {
        const photos = await getAllPhotosWithPerson(person.id);
        return { ...person, photos };
      }));
      setPersons(personsWithPhotos);
    } catch (error) {
      console.error('Failed to fetch persons and photos', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPersonsAndPhotos();
    }, [])
  );

  const handleSelectPerson = (person) => {
    navigation.navigate('AlbumImagesScreen', { albumId: 2, photo_list: person.photos });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleSelectPerson(item)}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={persons}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      numColumns={3}
      contentContainerStyle={styles.container}
    />
  );
};

export default FriendsScreen;
