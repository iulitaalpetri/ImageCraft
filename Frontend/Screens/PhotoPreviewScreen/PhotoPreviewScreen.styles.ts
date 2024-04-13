import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0', // Light grey background
    },
    image: {
        width: '90%', // Use 90% of the screen width
        height: '70%', // Use 70% of the screen height
        resizeMode: 'contain', // Ensure the aspect ratio is maintained
        marginVertical: 20, // Add vertical space around the image
    },
    infoText: {
        fontSize: 16,
        color: '#333', // Dark grey text color
        marginTop: 10,
    },
    backButton: {
        position: 'absolute',
        top: 55,
        left: 20,
        padding: 10,
        backgroundColor: '#0c0c33', // Light grey background for the button
        borderRadius: 5,
        
        
    },
    backButtonText: {
        fontSize: 16,
        color: '#fff', // Black text color
    },
    saveButton: {
        position: 'absolute',
        bottom: 70,
        padding: 10,
        backgroundColor: '#0c0c33', // Light grey background for the button
        borderRadius: 5,
    },

});

export default styles;
