// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './Screens/SplashScreen/SplashScreen';
import AuthScreen from './Screens/AuthScreen/AuthScreen';
import RegisterScreen from './Screens/RegisterScreen/RegisterScreen';
import LoginScreen from './Screens/LoginScreen/LoginScreen';
import HomeScreen from './Screens/HomeScreen/HomeScreen';
import TakePhotoScreen from './Screens/TakePhotoScreen/TakePhotoScreen';
import UploadPhotoScreen from './Screens/UploadPhotoScreen/UploadPhotoScreen';
import GalleryScreen from './Screens/GalleryScreen/GalleryScreen';


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

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
