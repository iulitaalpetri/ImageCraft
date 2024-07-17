import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // Add any other styles for the container if needed
  },
  input: {
    width: '80%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    // Add any other styles for the input if needed
  },
  button: {
    backgroundColor: '#0c0c33', // Adjust this color to match your design
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorText: {
    color: 'red', // Here we specify the color of the error text
    fontSize: 14,
    marginBottom: 5,
    alignSelf: 'flex-start', // Align to the start of the parent view
    marginLeft: '10%', // Align with the input text fields
  },
  // Add other style sections as needed
});

export default styles;
