import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { rotateImage } from '../../src/api/photo_api'; // Ensure this path is correct
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Asigură-te că această bibliotecă este instalată
import LoadingOverlay from '../LoadingPage/LoadingPage';
  


const RotateModal = ({ photoId, visible, onClose, updateCurrentUri }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [angle, setAngle] = useState(-90); 

  const handleApply = async () => {
    if (!angle) {
      Alert.alert('Error', 'Please enter a valid angle');
      return;
    }
    setIsLoading(true);
    try {
      const response = await rotateImage(photoId, angle);
      updateCurrentUri(); // Assuming this function updates the UI with the new image

      onClose(); // Close the modal
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to rotate the image');
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
          <Text style={styles.modalText}>Rotate Image</Text>

      
  
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, { backgroundColor: angle === 90 ? 'gray' : '#333333' }]} onPress={() => setAngle(-90)}>
              <MaterialIcons name="rotate-right" size={24} color="#fff" />
              <Text style={styles.buttonText}>90°</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, {backgroundColor: angle === -90 ? 'gray' : '#333333'}]} onPress={() => setAngle(90)}>
              <MaterialIcons name="rotate-left" size={24} color="#fff" />
              <Text style={styles.buttonText}>90°</Text>
            </TouchableOpacity>
          </View>
  
          <View style={styles.buttonsContainer}>
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
inputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  borderBottomColor: '#ccc',
  marginBottom: 12,
  width: '100%'
},
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
title: {
  fontSize: 20,
  marginBottom: 20,

},
buttonsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  width: 200,
  marginTop: 20,
  marginBottom: 10

},

});

export default RotateModal;
