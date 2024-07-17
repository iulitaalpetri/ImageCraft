import { View, Text, StyleSheet, Image, FlatList } from 'react-native';


const styles = StyleSheet.create({
    container: {
    marginTop: 40,
      paddingHorizontal: 10, // Add padding to the container
      backgroundColor: '#f0f0f0'
    },
    itemContainer: {
      flex: 1,
      alignItems: 'center',
      margin: 10,
      width: 110, // Set a fixed width for each item
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 50, // Makes the image rounded
    },
    name: {
      fontSize: 16,
      color: '#333',
      marginTop: 8,
      textAlign: 'center' // Center-align the text
    }
  });


export default styles;

