
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import styles from './LoginScreen.styles';
import { loginUser } from '../../src/api/auth_api'; 
import Logo from '../../components/Logo/Logo';
import LoadingOverlay from '../../components/LoadingPage/LoadingPage';


const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const loginData = { username, password };
            const response = await loginUser(loginData);
            console.log('Login successful:', response);
            navigation.navigate('HomeScreen');
        } catch (error) {
            Alert.alert('Login Failed', typeof error === 'string' ? error : 'An error occurred during login');
        }
        setIsLoading(false);
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
                {error && <Text style={styles.errorText}>{error}</Text>}
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default LoginScreen;
