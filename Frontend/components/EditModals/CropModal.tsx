import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { cropImage , getCurrentUri} from '../../src/api/photo_api'; 

const CropModal = ({ photoId, visible, onClose, updateCurrentUri }) => {


    const[currentUri, setCurrentUri] = useState(''); 
  const [cropParams, setCropParams] = useState({
    x: '',
    y: '',
    width: '',
    height: ''
  });



  const handleApply = async () => {
    if (cropParams.x && cropParams.y && cropParams.width && cropParams.height) {
      try {
        // API call to crop the image with parameters
        const response = await cropImage(photoId, {
          x: parseInt(cropParams.x),
          y: parseInt(cropParams.y),
          width: parseInt(cropParams.width),
          height: parseInt(cropParams.height)
        });

        await updateCurrentUri();
        Alert.alert('Success', response.message);

        
        onClose(); 
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to crop the image.');
      }
    } else {
      Alert.alert('Error', 'All fields are required and must be valid numbers.');
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
          <Text style={styles.modalText}>Crop Image</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setCropParams({...cropParams, x: text})}
            value={cropParams.x}
            placeholder="X coordinate"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            onChangeText={text => setCropParams({...cropParams, y: text})}
            value={cropParams.y}
            placeholder="Y coordinate"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            onChangeText={text => setCropParams({...cropParams, width: text})}
            value={cropParams.width}
            placeholder="Width"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            onChangeText={text => setCropParams({...cropParams, height: text})}
            value={cropParams.height}
            placeholder="Height"
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

export default CropModal;
