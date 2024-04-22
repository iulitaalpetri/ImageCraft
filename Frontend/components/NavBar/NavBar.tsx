// NavBar.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GalleryScreen from '../../Screens/GalleryScreen/GalleryScreen';
import TakePhotoScreen from '../../Screens/TakePhotoScreen/TakePhotoScreen';
import UploadPhotoScreen from '../../Screens/UploadPhotoScreen/UploadPhotoScreen';
import FriendsScreen from '../../Screens/FriendsScreen/FriendsScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faImages, faUpload, faUserFriends } from '@fortawesome/free-solid-svg-icons';

const Tab = createBottomTabNavigator();

const NavBar = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // This hides the header
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'GalleryScreen') iconName = faImages;
          else if (route.name === 'TakePhotoScreen') iconName = faCamera;
          else if (route.name === 'UploadPhotoScreen') iconName = faUpload;
          else if (route.name === 'FriendsScreen') iconName = faUserFriends;
          return <FontAwesomeIcon icon={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0c0c33',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { height: 70 },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 6,
        },
      })}
    >
      <Tab.Screen name="GalleryScreen" component={GalleryScreen} options={{ title: 'Gallery' }} />
      <Tab.Screen name="TakePhotoScreen" component={TakePhotoScreen} options={{ title: 'Camera' }} />
      <Tab.Screen name="UploadPhotoScreen" component={UploadPhotoScreen} options={{ title: 'Upload' }} />
      <Tab.Screen name="FriendsScreen" component={FriendsScreen} options={{ title: 'Friends' }} />
    </Tab.Navigator>
  );
};

export default NavBar;
 