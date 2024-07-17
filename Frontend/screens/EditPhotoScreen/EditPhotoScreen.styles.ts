
import React, { useState } from 'react';
import { View, Image, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';


const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',  // Ensures it covers the whole screen
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent background
      },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingTop: 70,  // Increased padding at the top to push all content down

    },
    buttonContainer: {
        position: 'absolute',
        top: 40,  // Adjust based on your UI
        right: 20, // Adjust based on your UI
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 33,
        left: 15,
        padding: 10,
        borderRadius: 5,
        marginTop: 15,
        marginLeft: 5,
        
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    image: {
        width: '100%',
        height: '70%',
        resizeMode: 'contain',
        marginVertical: 48,
    },
    saveButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginRight: 1, // Space between save and undo buttons
        
    },
    saveButtonText: {
        color: '#A9A9A9',
        fontSize: 16,
    },
    
    editBar: {
        flexDirection: 'row',
        paddingVertical: 10,
        marginBottom: -8, // Add bottom margin
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
    },
    undoButton: {
        padding: 10,
        borderRadius: 5,
        top: -9,
        right: -2,
        marginTop: 15,
        marginLeft: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 200,
        marginTop: 20,
        marginBottom: 10
      
      },
      button: {
        backgroundColor: '#0c0c33',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center'
      },
      buttonText: {
        color: 'white',
        fontSize: 16
      },
      

});


export default styles;