import React, { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet , Alert, TouchableOpacity} from 'react-native';
import Slider from '@react-native-community/slider';
import { adjustSharpness } from '../../src/api/photo_api';  // Adjust the import path as necessary
import LoadingOverlay from '../LoadingPage/LoadingPage';

const SharpnessModal = ({ visible, onClose, photoId, updateCurrentUri }) => {
    const [sharpnessFactor, setSharpnessFactor] = useState(1.0);  
    const [isLoading, setIsLoading] = useState(false);

  
    const handleApply = async () => {
      setIsLoading(true);
      try {
        const response = await adjustSharpness(photoId, { factor: sharpnessFactor });
        updateCurrentUri();  // Refresh the image display
        onClose();  // Close the modal
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to adjust sharpness');
      }
      setIsLoading(false);
    };
  
    return (
      <View style={{ flex: 1 }}>
        <LoadingOverlay isLoading={isLoading} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >

        <View style={styles.overlay} />
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Adjust Sharpness</Text>
            <Slider
            style={styles.slider}
            minimumValue={0.1}
            maximumValue={4}
            minimumTrackTintColor="#FFD700" // Gold color for minimum track
            maximumTrackTintColor="#000000" // Black for maximum track
            thumbTintColor="#FF6347" // Tomato color for the thumb
            step={0.1}
            value={sharpnessFactor}
            onValueChange={setSharpnessFactor}
          />
            <Text>Sharpness: {sharpnessFactor.toFixed(2)}</Text>
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleApply}>
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>
          </View>
        </View>
      </Modal>
      </View>
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
    
    input: {
      height: 40,
      marginTop: 12,
      marginBottom: 12,
      paddingHorizontal: 10,
      width: 200,
      borderBottomWidth: 1,
      borderColor: '#ccc' // Alege o culoare potrivită pentru linia de jos
    }
  , 
  buttonContainer: {
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
  slider: {
    width: 200,
    height: 40,
  },
  });
  

export default SharpnessModal;