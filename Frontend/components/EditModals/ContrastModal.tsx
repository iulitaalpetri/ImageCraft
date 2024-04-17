import React, { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet , Alert} from 'react-native';
import Slider from '@react-native-community/slider';
import { adjustContrast } from '../../src/api/photo_api';


const ContrastModal = ({ photoId, visible, onClose, updateCurrentUri }) => {
  const [contrastFactor, setContrastFactor] = useState(1.0);

  const handleApply = async () => {
    try {
      const response = await adjustContrast(photoId, { factor: contrastFactor });
      Alert.alert('Success', response.message);
      updateCurrentUri(); // Function to update the image display
      Alert.alert('Success', response.message);

      onClose(); // Close the modal
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to adjust contrast');
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
          <Text style={styles.modalText}>Adjust Contrast</Text>
          <Slider
            style={{width: 200, height: 40}}
            minimumValue={0.1}
            maximumValue={4.0}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            value={contrastFactor}
            onValueChange={setContrastFactor}
          />
          <Button title="Apply" onPress={handleApply} />
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

export default ContrastModal;
