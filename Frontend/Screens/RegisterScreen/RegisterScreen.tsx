import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import styles from './RegisterScreen.styles';
import Logo from '../../components/Logo/Logo';
import { registerUser } from '../../src/api/auth_api'; // Adjust the path as necessary to import registerUser

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', email: '', password: '', verifyPassword: '' });

  const validateForm = () => {
    let isValid = true;
    let errors = { username: '', email: '', password: '', verifyPassword: '' };

    if (username.length < 10) {
      errors.username = 'Username must be at least 10 characters';
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
      try {
        const registrationData = { username, email, password };
        const response = await registerUser(registrationData);
        Alert.alert('Registration Successful', `Welcome, ${response.username}!`);
        // Optionally navigate to another screen after successful registration
        navigation.navigate('Login'); // Or another relevant screen
      } catch (error) {
        Alert.alert('Registration Failed', error.message);
      }
    }
  };

  const onLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
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
      <TouchableOpacity style={styles.linkButton} onPress={onLoginPress}>
        <Text style={styles.linkButtonText}>Already have an account? - Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterScreen;
