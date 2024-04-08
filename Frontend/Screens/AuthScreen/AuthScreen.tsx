import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './AuthScreen.styles';
import Logo from '../../components/Logo/Logo';
import ButtonAuth from '../../components/ButtonRedirect/ButtonRedirect';

const AuthScreen = () => {
  const navigation = useNavigation(); // Use the useNavigation hook to get the navigation object

  return (
    <View style={styles.container}>
      <Logo />
      <ButtonAuth
        text="You're new to the app? Register"
        onPress={() => navigation.navigate('RegisterScreen')}
      />
      <ButtonAuth
        text="Already have an account? Login"
        onPress={() => navigation.navigate('LoginScreen')} // Make sure you have a 'LoginScreen' in your navigation stack
      />
    </View>
  );
};

export default AuthScreen;
