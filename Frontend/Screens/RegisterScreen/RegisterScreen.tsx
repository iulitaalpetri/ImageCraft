import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import styles from './RegisterScreen.styles';
import Logo from '../../components/Logo/Logo';
import { registerUser } from '../../src/api/auth_api'; // Adjust the path as necessary to import registerUser
import LoadingOverlay from '../../components/LoadingPage/LoadingPage';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', email: '', password: '', verifyPassword: '' });
  const [isLoading, setIsLoading] = useState(false); 

  const validateForm = () => {
    let isValid = true;
    let errors = { username: '', email: '', password: '', verifyPassword: '' };

    if (username.length > 10) {
      errors.username = 'Username should not have more then 10 characters';
      isValid = false;
    }
    if (!email.includes('@')) {
      errors.email = 'Email must include @';
      isValid = false;
    }
    if (password.length < 10 || !/\d/.test(password)) {
      errors.password = 'Password must be at least 10 characters and include a number';
      isValid = false;
    }
    if (password !== verifyPassword) {
      errors.verifyPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };



  const onRegisterPress = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const registrationData = { username, email, password };
        const response = await registerUser(registrationData);
        Alert.alert('Registration Successful', `Welcome, ${response.username}!`);
        navigation.navigate('LoginScreen');

      }
      
      catch (error) {
        console.log('Error response:', error); // Log the detailed error for debugging
        let errorMessage = 'An error occurred during registration.';
        if (error.username) {
            errorMessage = `Username error: ${error.username[0]}`;
        } else if (error.email) {
            errorMessage = `Email error: ${error.email[0]}`;
        } else if (typeof error === 'string') {
            errorMessage = error; // Direct string errors
        }
        Alert.alert('Registration Failed', errorMessage);
    }
    setIsLoading(false);
  }};    
  



  const onLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={{ flex: 1 }}>
      <LoadingOverlay isLoading={isLoading} />
      <ScrollView contentContainerStyle={styles.container}>
        <Logo />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Verify Password"
          value={verifyPassword}
          onChangeText={setVerifyPassword}
          secureTextEntry
        />
        {errors.verifyPassword ? <Text style={styles.errorText}>{errors.verifyPassword}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={onRegisterPress}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.linkButtonText}>Already have an account? - Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
  


export default RegisterScreen;
