import React, { useEffect, useState } from 'react';
import { View, Image, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import styles from './SplashScreen.styles';

type RootStackParamList = {
  SplashScreen: undefined;
  AuthScreen: undefined; // Define other screen parameters as needed
};

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SplashScreen'
>;

type Props = {
  navigation: SplashScreenNavigationProp;
};

const SplashScreen: React.FC<Props> = ({ navigation }) => {
    const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0
  
    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1, // Fade in to opacity: 1
        duration: 2000, 
        useNativeDriver: true, // Add this line
      }).start();
  
      const timer = setTimeout(() => {
        navigation.replace('AuthScreen');
      }, 3000);
      return () => clearTimeout(timer);
    }, [fadeAnim, navigation]);
  
    return (
      <View style={styles.container}>
        <Animated.Image
          source={require('../../assets/logo.png')}
          style={[styles.logo, { opacity: fadeAnim }]} // Apply animated opacity
        />
      </View>
    );
  };
  
  export default SplashScreen;
