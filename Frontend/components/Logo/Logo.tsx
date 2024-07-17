import React from 'react';
import { View, Image } from 'react-native';
import styles from './Logo.styles';

const Logo = () => {
  return (
    <View style={styles.logoContainer}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
    </View>
  );
};

export default Logo;
