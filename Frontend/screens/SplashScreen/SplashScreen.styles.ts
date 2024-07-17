import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  logo: {
    width: 300, // Set the width of the logo
    height: 300, // Set the height of the logo, adjust as needed
    resizeMode: 'contain', // Ensure the logo's aspect ratio is preserved
  },
});

export default styles;
