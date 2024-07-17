import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import styles from './TakePhotoScreen.styles';

const TakePhotoScreen = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const cameraRef = useRef(null);
    const navigation = useNavigation(); // Get navigation prop using hook
    const isFocused = useIsFocused(); // Determines if screen is focused
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePhotoAndNavigate = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
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
            {isFocused && (
                <Camera ref={cameraRef} style={styles.camera} type={type}>
                    <TouchableOpacity style={styles.flipButton} onPress={() => {
                        setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
                    }}>
                        <Image source={require('../../assets/FlipCamera.png')} style={styles.icon} />
                    </TouchableOpacity>
                    <View style={styles.bottomBar}>
                        <TouchableOpacity style={styles.button} onPress={takePhotoAndNavigate}>
                            <Image source={require('../../assets/Camera.png')} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </Camera>
            )}
        </View>
    );
};

export default TakePhotoScreen;

