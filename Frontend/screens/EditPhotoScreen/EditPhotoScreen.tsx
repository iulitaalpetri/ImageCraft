import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Button, Alert, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import styles from './EditPhotoScreen.styles';
import { dismissChanges, getCurrentUri , convertToGrayscale, saveChanges, undoChanges, denoiseImage} from '../../src/api/photo_api';
import CropModal  from '../../components/EditModals/CropModal';
import RotateModal from '../../components/EditModals/RotateModal';
import ResizeModal from '../../components/EditModals/ResizeModal';
import FlipImageModal from '../../components/EditModals/FlipModal';
import BrightnessModal from '../../components/EditModals/BrightnessModal';
import ContrastModal from '../../components/EditModals/ContrastModal';
import SharpnessModal from '../../components/EditModals/SharpnessModal';
import { Ionicons } from '@expo/vector-icons';
import LoadingOverlay from '../../components/LoadingPage/LoadingPage';
import Icon from 'react-native-vector-icons/MaterialIcons';


const EditPhotoScreen = ({ route }) => {
    const { photoId,  initialPhotoUri } = route.params;
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [activeModal, setActiveModal]= useState(null);
    const [currentUri, setCurrentUri] = useState(initialPhotoUri);
    const [isLoading, setIsLoading] = useState(false);


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

    const applyDenosie = async () => {
        setIsLoading(true);
        try {
            const response = await denoiseImage(photoId);
            updateCurrentUri(); // Update the URI to reflect the new denoised image
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to apply denoise');
        }
        setIsLoading(false);
    }

    const applyGrayscale = async () => {
        setIsLoading(true);
        try {
            const response = await convertToGrayscale(photoId);
            updateCurrentUri(); // Update the URI to reflect the new grayscale image
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to apply grayscale');
        }
        setIsLoading(false);
    };

    const handleEditAction = (action) => {
        if (action === 'Grayscale') {
            applyGrayscale();
        }
        else if (action === 'Denoise') {
            applyDenosie();
        } 
        else {
            setActiveModal(action);
        }
    };

    const handleDismissAndLeave = async () => {
        setIsLoading(true);
        try {
            await dismissChanges(photoId); // Assuming photoId is defined and accessible
            //navigate to home screen
            navigation.navigate('HomeScreen');
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to dismiss edits.');
    }
    setIsLoading(false);
};   

    const handleUndoChanges = async () => {
        setIsLoading(true);
        try {
            await undoChanges();
            updateCurrentUri();
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to undo changes');
        }
        setIsLoading(false);
    };


const handleSaveChanges = async () => {
    try {
        const response = await saveChanges();
        // Optionally navigate the user away or refresh the screen
        navigation.navigate('HomeScreen'); // or any other screen as necessary
    } catch (error) {
        Alert.alert('Error', error.message || 'Failed to save changes');
    }
};


    return (
        <View style={styles.container}>
            <LoadingOverlay isLoading={isLoading} />
            <TouchableOpacity style={styles.backButton} onPress={() => setShowConfirmModal(true)}>
            <Ionicons name="arrow-back" size={30} color="#444444" />
        </TouchableOpacity>


        <View style={styles.buttonContainer}>
            

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Icon name="save" size={30} color="#444444" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.undoButton} onPress={handleUndoChanges}>
                <MaterialIcons name="undo" size={30} color="#444444" />
            </TouchableOpacity>
        </View>

            <Image source={{ uri: currentUri }} style={styles.image} />     

            
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
            <View style={styles.overlay} />
    <View style={styles.centeredView}>
        <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to leave? All the edits will be lost.</Text>
           
            <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={handleDismissAndLeave}>
              <Text style={styles.buttonText}>Dismiss</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setShowConfirmModal(false)}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
    </View>
</Modal>

        </View>
    );
};


export default EditPhotoScreen;
