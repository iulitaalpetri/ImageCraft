import React, { useState, useEffect } from 'react';
import { View, Image, Modal, Text, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native';
import { styles, modalStyles } from './ProfileBar.styles';
import { getUserData, logoutUser, deleteUser, checkPassword, updateUser } from '../../src/api/auth_api';
import LoadingOverlay from '../LoadingPage/LoadingPage';


const ProfileBar = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [passwordVerificationModalVisible, setPasswordVerificationModalVisible] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [errors, setErrors] = useState({ username: '', email: '', password: '', verifyPassword: '' });
    // ---------------------------------- profile modal ----------------------------------
    const handleProfilePress = async () => {
        setIsLoading(true);
        try {
            const userData = await getUserData();
            setUser(userData);
            setModalVisible(true);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        } finally {
            setIsLoading(false);
        }
    };



    const handleLogout = async () => {
        setIsLoading(true);

        try {
            await logoutUser();
            navigation.replace('LoginScreen');
        } catch (error) {
            console.error('Logout failed:', error);
            Alert.alert('Logout Failed', 'Could not log out. Please try again.');
        }
        setIsLoading(false);

    };

    const handleDeleteAccount = async () => {
        setIsLoading(true);
        try {
            await deleteUser();
            navigation.replace('LoginScreen');
        } catch (error) {
            console.error('Delete account failed:', error);
            Alert.alert('Delete Account Failed', 'Could not delete account. Please try again.');
        }
        setIsLoading(false);

    };

    const handleUpdateProfilePress = () => {
        setModalVisible(false);
        setPasswordVerificationModalVisible(true);
    };

    const handlePasswordCheck = async () => {
        setIsLoading(true);
        try {
            const isValid = await checkPassword(password);
            if (isValid) {
                setPasswordVerificationModalVisible(false);
                setUpdateModalVisible(true); // Open the update modal on successful password check
            } else {
                Alert.alert('Password Check', 'Incorrect password.');
                setPasswordVerificationModalVisible(false);
                setModalVisible(true);
            }
        } catch (error) {
            console.error('Password check failed:', error);
            Alert.alert('Password Check', 'Failed to verify password. Please try again.');
        }

        setIsLoading(false);
    };

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
            setPassword('');
            setVerifyPassword('');
        }
    }, [user]);



    const handleUpdateProfile = async () => {
        if (!username || username.length > 10) {
            Alert.alert('Error', 'Username must be less than 10 characters.');
            return;
        }
        if (password.length <= 10 || !/\d/.test(password)) {
            Alert.alert('Error', 'Password must be more than 10 characters and contain at least one digit.');
            return;
        }
        if (password !== verifyPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
        setIsLoading(true);
        try {
            const updateData = { username, email, password };
            await updateUser(updateData);
            Alert.alert('Success', 'Profile updated successfully.');
            setUpdateModalVisible(false);
        } catch (error) {
            console.error('Update failed:', error);
            Alert.alert('Update Failed', error.toString());
        }
        setIsLoading(false);
    };

    //---------------------------------- profile  ----------------------------------

    // --- buttons ---
    const handleTakePhotoPress = () => {
        navigation.navigate('TakePhotoScreen');
    }

    const handleUploadPhotoPress = () => {
        navigation.navigate('UploadPhotoScreen');
    }

    const handleGalleryPress = () => {
        navigation.navigate('GalleryScreen');
    }

    return (
        <View style={styles.container}>
            <LoadingOverlay isLoading={isLoading} />

            <TouchableOpacity style={styles.headerRight} onPress={handleProfilePress}>
                <Image source={require('../../assets/user.png')} style={styles.image} />
            </TouchableOpacity>
            <View style={styles.headerLeft}>
                <Image source={require('../../assets/app_tile.png')} style={styles.image} />
            </View>

            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={modalStyles.modalView}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <>
                            <Text style={modalStyles.welcomeText}>
                                Welcome {user ? user.username : 'User'}!
                            </Text>


                            <TouchableOpacity
                                style={[modalStyles.buttonClose, { backgroundColor: '#0c0c33', marginBottom: 1 }]}
                                onPress={handleUpdateProfilePress}
                            >
                                <Text style={modalStyles.textStyle}>Update Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[modalStyles.buttonClose, { backgroundColor: 'red', marginBottom: 5 }]}
                                onPress={() => setDeleteModalVisible(true)}
                            >

                                <Text style={modalStyles.textStyle}>Delete Account</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[modalStyles.buttonClose, { backgroundColor: '#0c0c33', marginTop: 1 }]}
                                onPress={handleLogout}
                            >
                                <Text style={modalStyles.textStyle}>Logout</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[modalStyles.buttonClose, { marginTop: 5, backgroundColor: '#0c0c33' }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={modalStyles.textStyle}>Close</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <View style={modalStyles.modalView}>
                    <Text style={modalStyles.modalText}>Are you sure you want to delete your account? All your data will be lost!</Text>
                    <TouchableOpacity
                        style={[modalStyles.buttonClose, { backgroundColor: 'red', marginBottom: 0.5 }]}
                        onPress={handleDeleteAccount}
                    >
                        <Text style={modalStyles.textStyle}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={modalStyles.buttonClose}
                        onPress={() => setDeleteModalVisible(false)}
                    >
                        <Text style={modalStyles.textStyle}>No</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={passwordVerificationModalVisible}
                onRequestClose={() => setPasswordVerificationModalVisible(false)}
            >
                <View style={modalStyles.modalView}>
                    <Text style={modalStyles.modalText}>Enter your current password:</Text>
                    <TextInput
                        style={modalStyles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity
                        style={modalStyles.buttonClose}
                        onPress={handlePasswordCheck}
                    >
                        <Text style={modalStyles.textStyle}>Verify</Text>
                    </TouchableOpacity>
                </View>
            </Modal>


            <Modal
                animationType="slide"
                transparent={true}
                visible={updateModalVisible}
                onRequestClose={() => setUpdateModalVisible(false)}
            >
                <View style={modalStyles.modalView}>
                    <Text style={modalStyles.modalText}>Update Profile</Text>
                    <TextInput
                        style={modalStyles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={text => setUsername(text)}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={modalStyles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={modalStyles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry
                    />
                    <TextInput
                        style={modalStyles.input}
                        placeholder="Verify Password"
                        value={verifyPassword}
                        onChangeText={text => setVerifyPassword(text)}
                        secureTextEntry
                    />
                    <TouchableOpacity
                        style={modalStyles.buttonClose}
                        onPress={handleUpdateProfile}
                    >
                        <Text style={modalStyles.textStyle}>Update Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={modalStyles.buttonClose}
                        onPress={() => setUpdateModalVisible(false)}
                    >
                        <Text style={modalStyles.textStyle}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>





        </View>
    );
};

export default ProfileBar;
