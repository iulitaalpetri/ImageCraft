import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import styles from './RegisterScreen.styles';
import Logo from '../../components/Logo/Logo';
import { registerUser } from '../../src/api/auth_api'; // Adjust the path as necessary to import registerUser
import LoadingOverlay from '../../components/LoadingPage/LoadingPage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', email: '', password: '', verifyPassword: '' });
  const [isLoading, setIsLoading] = useState(false); 
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [verifyPasswordFocused, setVerifyPasswordFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);  // State to toggle password visibility
  const [verifyPasswordVisible, setVerifyPasswordVisible] = useState(false);  // State to toggle password visibility
  const [usernameValid, setUsernameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);


  const passwordInputRef = useRef(null);
  const verifyPasswordInputRef = useRef(null);

  const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
      passwordInputRef.current && passwordInputRef.current.focus();  
    };

  const toggleVerifyPasswordVisibility = () => {
      setVerifyPasswordVisible(!verifyPasswordVisible);
      verifyPasswordInputRef.current && verifyPasswordInputRef.current.focus();  
    };

  const validateForm = () => {
    let isValid = true;
    let errors = { username: '', email: '', password: '', verifyPassword: '' };

    if (username.length < 5 || username.length > 15) {
      errors.username = 'Username should have between 5 and 15 characters';
      isValid = false;
    }
    if (!email.includes('@')) {
      errors.email = 'Email must include @';
      isValid = false;
    }
    if (!password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)) {
      errors.password = 'Password must contain at least 8 characters, a number and a special character';
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
        
      <View style={styles.inputsContainer}>

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
          onChangeText={(text) => {
            setUsername(text);
            setUsernameValid(text.length <= 15 && text.length > 5);
          }}          autoCapitalize="none"
          onFocus={() => setUsernameFocused(true)}
          onBlur={() => setUsernameFocused(false)}
        />
        {usernameValid && <Icon name="check" size={24} color="green" style={styles.checkIcon} />}

      </View>
        {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
        <View style={styles.inputContainer}>
        <Icon 
        name="email-outline" 
        size={24} 
        color={emailFocused ? '#000080' : '#C0C0C0'}  // Dynamic color change
        style={styles.icon} />

        <TextInput
          style={[styles.input, emailFocused && styles.focusedInput]}
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailValid(text.includes('@'));
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
        />
        {emailValid && <Icon name="check" size={24} color="green" style={styles.checkIcon} />}

        </View>
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        <View style={styles.inputContainer}>
        <Icon 
        name="lock-outline" 
        size={24} 
        color={passwordFocused ? '#000080' : '#C0C0C0'}  // Dynamic color change
        style={styles.icon} />

        <TextInput
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
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
      <View style={styles.inputContainer}>
      <Icon 
      name="lock-reset" 
      size={24} 
      color={verifyPasswordFocused ? '#000080' : '#C0C0C0'}  // Dynamic color change
      style={styles.icon} />

        <TextInput
          style={[styles.input, verifyPasswordFocused && styles.focusedInput]}
          placeholder="Verify Password"
          value={verifyPassword}
          onChangeText={setVerifyPassword}
          secureTextEntry={!verifyPasswordVisible}  // Controlled by state
          onFocus={() => setVerifyPasswordFocused(true)}
          onBlur={() => setVerifyPasswordFocused(false)}
        />

      <Icon
            name={verifyPasswordVisible ? 'eye-off' : 'eye'}  // Toggle icon based on visibility
            size={24}
            color={verifyPasswordFocused ? '#000080' : '#C0C0C0'}  // Dynamic color change
            style={styles.eyeIcon}
            onPress={toggleVerifyPasswordVisibility}  // Handle onPress to toggle visibility
          />

      </View>
      {errors.verifyPassword ? <Text style={styles.errorText}>{errors.verifyPassword}</Text> : null}

      </View>

        
        <TouchableOpacity style={styles.button} onPress={onRegisterPress}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <View style={styles.separatorContainer}>
          <View style={styles.line} />
          <Text style={styles.separatorText}>or</Text>
          <View style={styles.line} />
        </View>
        <TouchableOpacity style={styles.registerButton} onPress = {() => navigation.navigate('LoginScreen')} >
          <Text style={styles.registerButtonText}>Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
  


export default RegisterScreen;
