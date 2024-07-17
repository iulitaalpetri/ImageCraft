
import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import styles from './LoginScreen.styles';
import { loginUser } from '../../src/api/auth_api'; 
import Logo from '../../components/Logo/Logo';
import LoadingOverlay from '../../components/LoadingPage/LoadingPage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import Icon



const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [usernameFocused, setUsernameFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);  // State to toggle password visibility
    const passwordInputRef = useRef(null);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
        passwordInputRef.current && passwordInputRef.current.focus();  // Focalizează din nou inputul de parolă
      };


    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const loginData = { username, password };
            const response = await loginUser(loginData);
            console.log('Login successful:', response);
            navigation.navigate('HomeScreen');
        } catch (error) {
            Alert.alert('Login Failed', typeof error === 'string' ? error : 'Incorrect username or password');
        }
        setIsLoading(false);
    };

    const navigateToRegister = () => {
        navigation.navigate('RegisterScreen');
    };

    return (
        <View style={{ flex: 1 }}>
            <LoadingOverlay isLoading={isLoading} />
            <ScrollView contentContainerStyle={styles.container}>
                <Logo />
                <View style={styles.inputContainer}>
          <Icon 
          name="account-circle-outline" 
          size={24} 
          color={usernameFocused ? '#000080' : '#C0C0C0'}  // Dynamic color change
          style={styles.icon} />
          <TextInput
            style={[styles.input, usernameFocused && styles.focusedInput]}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            onFocus={() => setUsernameFocused(true)}
            onBlur={() => setUsernameFocused(false)}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon 
          name="lock-outline" 
          size={24} 
          color={passwordFocused ? '#000080' : '#C0C0C0'}  // Dynamic color change
          style={styles.icon} />
          <TextInput
            ref={passwordInputRef}
            style={[styles.input, passwordFocused && styles.focusedInput]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}  // Controlled by state
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
            <Icon
            name={passwordVisible ? 'eye-off' : 'eye'}  // Toggle icon based on visibility
            size={24}
            color={passwordFocused ? '#000080' : '#C0C0C0'}  // Dynamic color change
            style={styles.eyeIcon}
            onPress={togglePasswordVisibility}  // Handle onPress to toggle visibility
          />

        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.separatorContainer}>
          <View style={styles.line} />
          <Text style={styles.separatorText}>or</Text>
          <View style={styles.line} />
        </View>
        <TouchableOpacity style={styles.registerButton} onPress = {navigateToRegister} >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default LoginScreen;
