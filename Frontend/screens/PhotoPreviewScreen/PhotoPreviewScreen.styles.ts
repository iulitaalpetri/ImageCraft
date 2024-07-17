import { icon } from '@fortawesome/fontawesome-svg-core';
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
        top: 60,
        left: 15,
        padding: 15,
        borderRadius: 5,
        
        
    },
    buttonContainer: {
        flexDirection: 'row', // Align buttons horizontally
        justifyContent: 'space-evenly', // Space buttons evenly
        position: 'absolute',
        bottom: 20,
        width: '100%', // Ensure the container spans the width of the screen
        alignItems: 'center', // Align buttons vertically
    },
    saveButton: {
        padding: 10,
        backgroundColor: '#0c0c33',
        borderRadius: 5,
        flex: 1, // Allow each button to take equal space
        marginHorizontal: 7, // Add horizontal space between buttons
        alignItems: 'center', // Center the text within the button
    },
    backButtonText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center', // Center text within the button
    },
    icon: {
        marginRight: 10,
    },
});

export default styles;
