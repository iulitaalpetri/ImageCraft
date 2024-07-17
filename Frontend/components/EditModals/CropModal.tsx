import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { cropImage } from '../../src/api/photo_api'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Asigură-te că această bibliotecă este instalat
import LoadingOverlay from '../LoadingPage/LoadingPage';
  

const CropModal = ({ photoId, visible, onClose, updateCurrentUri }) => {
  const [cropParams, setCropParams] = useState({
    left: '',
    upper: '',
    right: '',
    bottom: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = async () => {
    const { left, upper, right, bottom } = cropParams;

    if (left && upper && right && bottom) {
      setIsLoading(true);
      try {
        

        const response = await cropImage(photoId, { left, upper, right, bottom });

        await updateCurrentUri();
        onClose();
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to crop the image.');
      }
    } else {
      Alert.alert('Error', 'All fields are required and must be numbers.');
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
          <Text style={styles.modalText}>Crop Image</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="crop-free" size={24} color="#666" />
            <TextInput
              style={styles.input}
              onChangeText={text => setCropParams({...cropParams, left: text})}
              value={cropParams.left}
              placeholder="Left"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialIcons name="vertical-align-top" size={24} color="#666" />
            <TextInput
              style={styles.input}
              onChangeText={text => setCropParams({...cropParams, upper: text})}
              value={cropParams.upper}
              placeholder="Upper"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialIcons name="crop-free" size={24} color="#666" />
            <TextInput
              style={styles.input}
              onChangeText={text => setCropParams({...cropParams, right: text})}
              value={cropParams.right}
              placeholder="Right"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialIcons name="vertical-align-bottom" size={24} color="#666" />
            <TextInput
              style={styles.input}
              onChangeText={text => setCropParams({...cropParams, bottom: text})}
              value={cropParams.bottom}
              placeholder="Bottom"
              keyboardType="numeric"
            />
          </View>

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
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',  
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
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

}
  
});

export default CropModal;
