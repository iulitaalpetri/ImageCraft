import React from 'react';
import { View, StyleSheet } from 'react-native';
import NavBar from '../NavBar/NavBar';
import ProfileBar from '../ProfileBar/ProfileBar';

const MainLayout = () => {
  return (
    <View style={styles.container}>
      <ProfileBar />
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1, // Ensures that this view expands
  }
});

export default MainLayout;
