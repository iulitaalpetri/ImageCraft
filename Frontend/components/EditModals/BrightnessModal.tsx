import React, { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { adjustBrightness } from '../../src/api/photo_api';  // Adjust the import path as necessary


const BrightnessModal = ({ photoId, visible, onClose, updateCurrentUri }) => {
    const [brightnessFactor, setBrightnessFactor] = useState(1);  // Default brightness factor
  
    const handleApplyBrightness = async () => {
      try {
        const response = await adjustBrightness(photoId, { factor: brightnessFactor });
        Alert.alert('Success', response.message);
        updateCurrentUri();  // Update the current URI to reflect changes
        Alert.alert('Success', response.message);

        onClose();  // Close the modal after operation
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to adjust brightness');
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
            <Text style={styles.modalText}>Adjust Brightness</Text>
            <Slider
              style={{width: 200, height: 40}}
              minimumValue={0.1}
              maximumValue={4}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
              step={0.1}
              value={brightnessFactor}
              onValueChange={setBrightnessFactor}
            />
            <Text>Brightness: {brightnessFactor.toFixed(2)}</Text>
            <Button title="Apply" onPress={handleApplyBrightness} />
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
    }
  });
  
  export default BrightnessModal;
  