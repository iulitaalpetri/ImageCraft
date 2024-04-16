
import React, { useState } from 'react';
import { View, Image, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingTop: 70,  // Increased padding at the top to push all content down

    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        marginTop: 15,
        marginLeft: 5,
        
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    image: {
        width: '90%',
        height: '70%',
        resizeMode: 'contain',
        marginVertical: 20,
    },
    saveButton: {
        backgroundColor: '#4CAF50', // A green color
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginVertical: 10, // Adjust the vertical spacing
        marginHorizontal: 4, // Adjust the horizontal spacing
        marginTop: -35, // Add top margin
        marginBottom: 15, // Add bottom margin
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    editBar: {
        flexDirection: 'row',
        paddingVertical: 10,
        marginBottom: 15, // Add bottom margin
    },
    editButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0c0c33',
        borderRadius: 5,
        padding: 10,
        marginLeft: 10,
        height: 90,
        width: 90,
    },
    editButtonText: {
        color: '#fff',
        marginTop: 5,
        fontSize: 12,
    },
    centeredView : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalView : {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    
    modalText : {
        marginBottom: 15,
        textAlign: 'center',
    }
});

export default styles;