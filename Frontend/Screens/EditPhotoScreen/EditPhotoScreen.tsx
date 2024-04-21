import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Button, Alert, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import styles from './EditPhotoScreen.styles';
import { dismissChanges, getCurrentUri , convertToGrayscale, saveChanges, undoChanges} from '../../src/api/photo_api';
import CropModal  from '../../components/EditModals/CropModal';
import RotateModal from '../../components/EditModals/RotateModal';
import ResizeModal from '../../components/EditModals/ResizeModal';
import FlipImageModal from '../../components/EditModals/FlipModal';
import BrightnessModal from '../../components/EditModals/BrightnessModal';
import ContrastModal from '../../components/EditModals/ContrastModal';
import SharpnessModal from '../../components/EditModals/SharpnessModal';

const EditPhotoScreen = ({ route }) => {
    const { photoId,  initialPhotoUri } = route.params;
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [activeModal, setActiveModal]= useState(null);
    const [currentUri, setCurrentUri] = useState(initialPhotoUri);


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

    const updateCurrentUri = async () => {
        try {
            const response = await getCurrentUri();
            
            setCurrentUri(response.current_uri);
            console.log("current uri",response.current_uri);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch the current image.');
        }
    };
    
    useEffect(() => {
        updateCurrentUri();
    }, []);



    const navigation = useNavigation();

    const applyGrayscale = async () => {
        try {
            const response = await convertToGrayscale(photoId);
            Alert.alert('Success', response.message);
            updateCurrentUri(); // Update the URI to reflect the new grayscale image
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to apply grayscale');
        }
    };

    const handleEditAction = (action) => {
        if (action === 'Grayscale') {
            applyGrayscale();
        } else {
            setActiveModal(action);
        }
    };

    const handleDismissAndLeave = async () => {
        try {
            await dismissChanges(photoId); // Assuming photoId is defined and accessible
            //navigate to home screen
            navigation.navigate('HomeScreen');
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to dismiss edits.');
    }
};   

    const handleUndoChanges = async () => {
        try {
            await undoChanges();
            updateCurrentUri();
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to undo changes');
        }
    };


const handleSaveChanges = async () => {
    try {
        const response = await saveChanges();
        Alert.alert('Success', response.message);
        // Optionally navigate the user away or refresh the screen
        navigation.navigate('HomeScreen'); // or any other screen as necessary
    } catch (error) {
        Alert.alert('Error', error.message || 'Failed to save changes');
    }
};


    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => setShowConfirmModal(true)}>
                <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.undoButton}  onPress ={handleUndoChanges}>
                <MaterialIcons name="undo" size={24} color="#fff" />
            </TouchableOpacity>

            <Image source={{ uri: currentUri }} style={styles.image} />     

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>Save Edits</Text>
            </TouchableOpacity>
            <ScrollView horizontal style={styles.editBar} showsHorizontalScrollIndicator={false}>
            {editActions.map(action => (
                    <TouchableOpacity key={action.id} style={styles.editButton} onPress={() => handleEditAction(action.name)}>
                        <MaterialIcons name={action.icon} size={24} color="#fff" />
                        <Text style={styles.editButtonText}>{action.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            {activeModal === 'Crop' && <CropModal visible={activeModal === 'Crop'} onClose={() => setActiveModal(null)} updateCurrentUri={updateCurrentUri}/>}
            {activeModal === 'Rotate' && <RotateModal visible={activeModal === 'Rotate'} onClose={() => setActiveModal(null)} updateCurrentUri={updateCurrentUri} />}
            {activeModal === 'Resize' && <ResizeModal visible={activeModal === 'Resize'} onClose={() => setActiveModal(null)} updateCurrentUri={updateCurrentUri} />}
            {activeModal === 'Flip' && <FlipImageModal visible={activeModal === 'Flip'} onClose={() => setActiveModal(null)} updateCurrentUri={updateCurrentUri} />}
            {activeModal === 'Brightness' && <BrightnessModal visible={activeModal === 'Brightness'} onClose={() => setActiveModal(null)} updateCurrentUri={updateCurrentUri} />}
            {activeModal === 'Contrast' && <ContrastModal visible={activeModal === 'Contrast'} onClose={() => setActiveModal(null)} updateCurrentUri={updateCurrentUri} />}
            {activeModal === 'Sharpness' && <SharpnessModal visible={activeModal === 'Sharpness'} onClose={() => setActiveModal(null)} updateCurrentUri={updateCurrentUri} />}

            



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
