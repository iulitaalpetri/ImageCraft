import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Button, Alert, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import styles from './EditPhotoScreen.styles';
import { dismissChanges } from '../../src/api/photo_api';


const EditPhotoScreen = ({ route }) => {
    const { photoId,  photoUri } = route.params;
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const editActions = [
        { id: 1, name: 'Crop', icon: 'crop' },
        { id: 2, name: 'Rotate', icon: 'rotate-90-degrees-ccw' },
        { id: 3, name: 'Resize', icon: 'photo-size-select-small' },
        { id: 4, name: 'Flip', icon: 'flip' },
        { id: 5, name: 'Brightness', icon: 'brightness-6' },
        { id: 6, name: 'Contrast', icon: 'contrast' },
        { id: 7, name: 'Sharpness', icon: 'filter-none' },
        { id: 8, name: 'Grayscale', icon: 'grain' },
        { id: 9, name: 'Denoise', icon: 'blur-on' },
    ];

    const navigation = useNavigation();

    const handleDismissAndLeave = async () => {
        try {
            await dismissChanges(photoId); // Assuming photoId is defined and accessible
            //navigate to home screen
            navigation.navigate('HomeScreen');
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to dismiss edits.');
    }
};   

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => setShowConfirmModal(true)}>
                <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

            <Image source={{ uri: photoUri }} style={styles.image} />
            <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Edits</Text>
            </TouchableOpacity>
            <ScrollView horizontal style={styles.editBar} showsHorizontalScrollIndicator={false}>
                {editActions.map(action => (
                    <TouchableOpacity key={action.id} style={styles.editButton}>
                        <MaterialIcons name={action.icon} size={24} color="#fff" />
                        <Text style={styles.editButtonText}>{action.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showConfirmModal}
                onRequestClose={() => setShowConfirmModal(false)}
            >
    <View style={styles.centeredView}>
        <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to leave? All the edits will be lost.</Text>
            <Button title="Yes" onPress={handleDismissAndLeave} />
            <Button title="No" onPress={() => setShowConfirmModal(false)} />
        </View>
    </View>
</Modal>

        </View>
    );
};

export default EditPhotoScreen;
