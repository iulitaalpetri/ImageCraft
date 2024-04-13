// NavBar.tsx
import React from 'react';
import { View, TouchableOpacity, Text , TouchableHighlight} from 'react-native';
import styles from './NavBar.styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faUpload, faImages, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { useRoute } from '@react-navigation/native';


interface NavBarProps {
  navigation: any;
  activeScreen: string;
}

const NavBar: React.FC<NavBarProps> = ({ navigation, activeScreen }) => {

    const route = useRoute();

    const isActive = (screenName) => route.name === screenName;


    const getButtonStyle = (screen: string) => [
        styles.iconButton,
        activeScreen === screen ? styles.activeButton : styles.inactiveButton,
      ];
    
      // Helper function to determine icon and text style
      const getIconTextStyle = (screen: string) => [
        styles.icon,
        isActive(screen) ? styles.active : styles.inactive,
      ];
  return (
    <View style={styles.container}>
      <TouchableOpacity style={getButtonStyle('GalleryScreen')} onPress={() => navigation.navigate('GalleryScreen')}>
        <FontAwesomeIcon icon={faImages} style={getIconTextStyle('GalleryScreen')} />
        <Text style={getIconTextStyle('GalleryScreen')}>Gallery</Text>
      </TouchableOpacity>
      <TouchableOpacity style={getButtonStyle('TakePhotoScreen')} onPress={() => navigation.navigate('TakePhotoScreen')}>
        <FontAwesomeIcon icon={faCamera} style={getIconTextStyle('TakePhotoScreen')} />
        <Text style={getIconTextStyle('TakePhotoScreen')}>Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity style={getButtonStyle('UplaodPhotoScreen')} onPress={() => navigation.navigate('UploadPhotoScreen')}>
        <FontAwesomeIcon icon={faUpload} style={getIconTextStyle('UploadPhotoScreen')} />
        <Text style={getIconTextStyle('UploadPhotoScreen')}>Upload Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={getButtonStyle('FriendsScreen')} onPress={() => navigation.navigate('FriendsScreen')}>
        <FontAwesomeIcon icon={faUserFriends} style={getIconTextStyle('FriendsScreen')} />
        <Text style={getIconTextStyle('FriendsScreen')}>Friends</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NavBar;