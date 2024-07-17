import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, Text, Animated , Button, Alert} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faUpload, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GalleryScreen from '../../screens/GalleryScreen/GalleryScreen';
import FriendsScreen from '../../screens/FriendsScreen/FriendsScreen';
import MyTabBar from '../MyTabBar/MyTabBar';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';


const Tab = createBottomTabNavigator();
const Placeholder = () => {
  return <View style={{ flex: 1, backgroundColor: 'red' }} />;
};

const NavBar = () => {
  const navigation = useNavigation();
  const [showOverlay, setShowOverlay] = useState(false);
  const buttonY = useRef(new Animated.Value(60)).current;

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
      });


      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        console.log("Image URI:", uri); // Ensure this logs correctly
        navigation.navigate('PhotoPreviewScreen', { photoUri: uri });
    }
    };

  const toggleOverlay = () => {
    if (showOverlay) {
      Animated.spring(buttonY, {
        toValue: 60,
        useNativeDriver: true,
        speed: 5,
      }).start(() => {
        setShowOverlay(false);
      });
    } else {
      setShowOverlay(true);
      Animated.spring(buttonY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 5,
      }).start();
    }
  };

  // const handleCameraPress = () => {
  //   toggleOverlay();  // Close the modal
  //   navigation.navigate('TakePhotoScreen');  // Navigate to TakePhotoScreen
  // };

  const handleCameraPress = async () => {
    toggleOverlay();  // Închide modala
    let cameraResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!cameraResult.canceled && cameraResult.assets && cameraResult.assets.length > 0) {
      const uri = cameraResult.assets[0].uri;
      navigation.navigate('PhotoPreviewScreen', { photoUri: uri });
    }
  };
  

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        tabBar={(props) => <MyTabBar {...props} onPlusPress={toggleOverlay} />}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tab.Screen name="GalleryScreen" component={GalleryScreen} options={{ title: 'Gallery' }} />
        <Tab.Screen name="Plus" options={{ tabBarButton: () => null }}>
          {props => <Placeholder {...props} />}
        </Tab.Screen>
        <Tab.Screen name="FriendsScreen" component={FriendsScreen} options={{ title: 'Friends' }} />
      </Tab.Navigator>
      {showOverlay && (
        <Modal
          visible={showOverlay}
          transparent
          onRequestClose={toggleOverlay}
          animationType="fade"
        >
          <View style={styles.overlay} onTouchEnd={toggleOverlay}>
            <Animated.View style={[styles.buttonContainer, { transform: [{ translateY: buttonY }] }]}>
              <TouchableOpacity style={styles.floatingButton} onPress={handleCameraPress}>
                <FontAwesomeIcon icon={faCamera} size={30} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.floatingButton} onPress={pickImage}>
                <FontAwesomeIcon icon={faUpload} size={30} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.floatingButton} onPress={toggleOverlay}>
                <FontAwesomeIcon icon={faArrowLeft} size={30} color="#FFF" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end', // Keeps buttons towards the bottom
    alignItems: 'center',
    paddingBottom: 100, // Adjust this value to move the button container higher up
  },
  buttonContainer: {
    flexDirection: 'column', // Stack buttons vertically
    marginBottom: 5,
    alignItems: 'center', // Ensure buttons are centered horizontally
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0c0c33',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10, // Reduced margin for vertical layout
  },
  buttonText: {
    color: '#FFF',
    marginTop: 5,
  },
});


export default NavBar;
