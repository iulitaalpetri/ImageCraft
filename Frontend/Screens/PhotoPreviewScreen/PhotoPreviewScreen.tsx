// PhotoPreviewScreen.js
import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

const PhotoPreviewScreen = ({ route }) => {
    const { photoUri } = route.params; // Get the photo URI passed in navigation parameters
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={{ uri: photoUri }} style={{ width: 300, height: 300 }} />
        </View>
    );
};

export default PhotoPreviewScreen;
