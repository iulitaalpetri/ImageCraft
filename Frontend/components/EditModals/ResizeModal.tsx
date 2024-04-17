import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { resizeImage } from '../../src/api/photo_api'; // Adjust import path as necessary

const ResizeModal = ({ photoId, visible, onClose, updateCurrentUri }) => {
  const [dimensions, setDimensions] = useState({
    width: '',
    height: ''
  });

  const handleResize = async () => {
    if (dimensions.width && dimensions.height) {
      try {
        const response = await resizeImage(photoId, parseInt(dimensions.width), parseInt(dimensions.height));
        Alert.alert('Success', 'Image resized successfully.');
        updateCurrentUri();
        Alert.alert('Success', response.message);

        onClose(); 
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to resize the image.');
      }
    } else {
      Alert.alert('Error', 'Please enter valid dimensions.');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Resize Image</Text>
          <TextInput
            style={styles.input}
            value={dimensions.width}
            onChangeText={text => setDimensions({...dimensions, width: text})}
            placeholder="Width"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={dimensions.height}
            onChangeText={text => setDimensions({...dimensions, height: text})}
            placeholder="Height"
            keyboardType="numeric"
          />
          <Button title="Apply" onPress={handleResize} />
          <Button title="Back" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
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
    textAlign: 'center'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  }
});

export default ResizeModal;
