import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { rotateImage } from '../../src/api/photo_api'; // Ensure this path is correct

const RotateModal = ({ photoId, visible, onClose, updateCurrentUri }) => {
  const [angle, setAngle] = useState('');

  const handleApply = async () => {
    if (!angle) {
      Alert.alert('Error', 'Please enter a valid angle');
      return;
    }

    try {
      const response = await rotateImage(photoId, parseInt(angle));
      Alert.alert('Success', response.message);
      updateCurrentUri(); // Assuming this function updates the UI with the new image
      Alert.alert('Success', response.message);

      onClose(); // Close the modal
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to rotate the image');
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
          <Text style={styles.modalText}>Rotate Image</Text>
          <TextInput
            style={styles.input}
            value={angle}
            onChangeText={setAngle}
            placeholder="Enter angle"
            keyboardType="numeric"
          />
          <Button title="Apply" onPress={handleApply} />
          <Button title="Back" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
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
    textAlign: "center"
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  }
});

export default RotateModal;
