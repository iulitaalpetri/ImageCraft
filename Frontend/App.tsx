// App.js
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen/SplashScreen';
import AuthScreen from './screens/AuthScreen/AuthScreen';
import RegisterScreen from './screens/RegisterScreen/RegisterScreen';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import TakePhotoScreen from './screens/TakePhotoScreen/TakePhotoScreen';
import UploadPhotoScreen from './screens/UploadPhotoScreen/UploadPhotoScreen';
import GalleryScreen from './screens/GalleryScreen/GalleryScreen';
import FriendsScreen from './screens/FriendsScreen/FriendsScreen';
import PhotoPreviewScreen from './screens/PhotoPreviewScreen/PhotoPreviewScreen';
import EditPhotoScreen from './screens/EditPhotoScreen/EditPhotoScreen';
import AlbumDetailsScreen from './screens/AlbumImagesScreen/AlbumImagesScreen';
import ImageScreen from './screens/ImageScreen/ImageScreen';



const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="AuthScreen" component={AuthScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="TakePhotoScreen" component={TakePhotoScreen} />
        <Stack.Screen name="UploadPhotoScreen" component={UploadPhotoScreen} />
        <Stack.Screen name="GalleryScreen" component={GalleryScreen} />
        <Stack.Screen name="FriendsScreen" component={FriendsScreen} />
        <Stack.Screen name="PhotoPreviewScreen" component={PhotoPreviewScreen} />
        <Stack.Screen name="EditPhotoScreen" component={EditPhotoScreen} />
        <Stack.Screen name="AlbumImagesScreen" component={AlbumDetailsScreen} />
        <Stack.Screen name="ImageScreen" component={ImageScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
