import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from './ButtonRedirect.styles';

type ButtonProps = {
  text: string;
  onPress: () => void; // Change from 'screen' to 'onPress'
};

const ButtonAuth = ({ text, onPress }: ButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default ButtonAuth;
