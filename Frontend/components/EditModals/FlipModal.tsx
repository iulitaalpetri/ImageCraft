import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import { flipImage } from '../../src/api/photo_api'; // Adjust the import path as necessary

const FlipImageModal = ({ visible, onClose, photoId, updateCurrentUri }) => {
  const [axis, setAxis] = useState('horizontal'); // Default to horizontal

  const handleFlip = async () => {
    try {
      const response = await flipImage(photoId, axis);
      Alert.alert('Success', response.message);
      updateCurrentUri();  // Assuming you pass a function to refresh the displayed image
      Alert.alert('Success', response.message);

      onClose();  // Close the modal after operation
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to flip the image');
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
          <Text style={styles.modalText}>Choose Flip Axis</Text>
          <View style={styles.buttonContainer}>
            <Button title="Horizontal" onPress={() => setAxis('horizontal')} color={axis === 'horizontal' ? 'blue' : 'gray'} />
            <Button title="Vertical" onPress={() => setAxis('vertical')} color={axis === 'vertical' ? 'blue' : 'gray'} />
          </View>
          <Button title="Apply Flip" onPress={handleFlip} />
          <Button title="Back" onPress={onClose} color="red" />
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
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20
  }
});

export default FlipImageModal;
