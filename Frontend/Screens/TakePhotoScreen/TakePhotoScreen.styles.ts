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
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
        // height
        height: 110,
    },
    button: {
        width: 60,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent', // Semi-transparent
    },
    icon: {
        width: '95%',
        height: '100%',
    },
});

export default styles;
