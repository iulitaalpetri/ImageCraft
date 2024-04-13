import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import styles from './TakePhotoScreen.styles';
import { useNavigation } from '@react-navigation/native';

const TakePhotoScreen = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back); // Initialize the type state
    const navigation = useNavigation(); // Get navigation prop using hook

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePhotoAndNavigate = async () => {
        if (cameraRef) {
            const photo = await cameraRef.takePictureAsync();
            // Navigate to new screen and pass the photo URI
            navigation.navigate('PhotoPreviewScreen', { photoUri: photo.uri });
        }
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Camera ref={ref => setCameraRef(ref)} style={styles.camera} type={type}>
                <View style={styles.bottomBar}>

                <TouchableOpacity style={styles.button} onPress={() => alert('Navigate to another screen')}>
                        <Image source={require('../../assets/galerie.png')} style={styles.icon} />
                    </TouchableOpacity>
                  
                    <TouchableOpacity style={styles.button} onPress={takePhotoAndNavigate}>
                        <Image source={require('../../assets/Camera.png')} style={styles.icon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => {
                        setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
                    }}>
                        <Image source={require('../../assets/FlipCamera.png')} style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
};

export default TakePhotoScreen;
