import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import { flipImage } from '../../src/api/photo_api'; // Adjust the import path as necessary
import Icon from 'react-native-vector-icons/MaterialIcons';
import LoadingOverlay from '../LoadingPage/LoadingPage';
 

const FlipImageModal = ({ visible, onClose, photoId, updateCurrentUri }) => {
  const [axis, setAxis] = useState('horizontal'); // Default to horizontal
  const [isLoading, setIsLoading] = useState(false);

  const handleFlip = async () => {
    setIsLoading(true);
    try {
      const response = await flipImage(photoId, axis);
      updateCurrentUri();  // Assuming you pass a function to refresh the displayed image

      onClose();  // Close the modal after operation
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to flip the image');
    }
    setIsLoading(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <LoadingOverlay isLoading={isLoading} />

      <View style={styles.overlay} />
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Choose Flip Axis</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, { backgroundColor: axis === 'horizontal' ? '#333333' : 'gray' }]} onPress={() => setAxis('horizontal')}>
              <Icon name="swap-horiz" size={24} color="#FFF" />
              <Text style={styles.buttonText}>Horizontal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: axis === 'vertical' ? '#333333' : 'gray' }]} onPress={() => setAxis('vertical')}>
              <Icon name="swap-vert" size={24} color="#FFF" />
              <Text style={styles.buttonText}>Vertical</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={handleFlip}>
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',  // Ensures it covers the whole screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent background
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    position: 'relative',
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
    textAlign: 'center',
    fontSize: 18

  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 200,
    marginTop: 20,
    marginBottom: 10
  
  },
  button: {
    backgroundColor: '#0c0c33',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  
  }
});

export default FlipImageModal;
