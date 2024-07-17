import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { resizeImage } from '../../src/api/photo_api'; // Adjust import path as necessary
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Asigură-te că această bibliotecă este instalată
import LoadingOverlay from '../LoadingPage/LoadingPage';
  
const ResizeModal = ({ photoId, visible, onClose, updateCurrentUri }) => {
  const [dimensions, setDimensions] = useState({
    width: '',
    height: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleResize = async () => {
    if (dimensions.width && dimensions.height) {
      setIsLoading(true);
      try {
        const response = await resizeImage(photoId, parseInt(dimensions.width), parseInt(dimensions.height));
        updateCurrentUri();

        onClose(); 
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to resize the image.');
      }
    } else {
      Alert.alert('Error', 'Please enter valid dimensions.');
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
          <Text style={styles.modalText}>Resize Image</Text>

          <View style={styles.inputContainer}>
          <MaterialIcons name="aspect-ratio" size={24} color="#666" />
          <TextInput
            style={styles.input}
            value={dimensions.width}
            onChangeText={text => setDimensions({...dimensions, width: text})}
            placeholder="Width"
            keyboardType="numeric"
          />
          </View>

          <View style={styles.inputContainer}>
          <MaterialIcons name="aspect-ratio" size={24} color="#666" />
          <TextInput
            style={styles.input}
            value={dimensions.height}
            onChangeText={text => setDimensions({...dimensions, height: text})}
            placeholder="Height"
            keyboardType="numeric"
          />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleResize}>
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
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

}

});

export default ResizeModal;
