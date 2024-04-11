import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TakePhotoScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is a dummy page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0'
  },
  text: {
    fontSize: 20,
    color: '#333'
  }
});

export default TakePhotoScreen;
