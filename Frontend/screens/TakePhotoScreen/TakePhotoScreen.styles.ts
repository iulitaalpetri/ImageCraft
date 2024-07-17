import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        bottom: -15, 
        left: 0,
        right: 0,
        padding: 15, 
        height: 110, 
    },
    button: {
        width: 60,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        
    },
    flipButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: '100%',
        height: '100%',
    },
});

export default styles;
