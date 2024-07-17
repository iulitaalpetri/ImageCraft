import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', 
    paddingTop: 20,  // Reduced padding at the top
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,  
  },
  
  inputContainer: {
    flexDirection: 'row', // Use row layout to place the icon next to the input
    alignItems: 'center',
    width: '90%',
    marginVertical: 8,
    marginBottom: 5,
    marginTop: 5,
  },
  inputsContainer: {
    marginTop: -55,  // Reduce the top margin to move the inputs up
  },
  icon: {
    marginRight: 10,  // Space between icon and text input
  },
  input: {
    width: '90%',
    padding: 15,
    marginVertical: 8,
    borderWidth: 0,  // No border around
    borderBottomWidth: 2,  // Only bottom border
    borderColor: '#C0C0C0',  // Default color for the border
    borderRadius: 0,  // No rounded corners necessary for just the bottom line
    backgroundColor: '#FFFFFF',
    color: '#C0C0C0',
    fontSize: 16,
    
  },
  focusedInput: {
    borderColor: '#000080',  // Change to blue when focused
    color: '#000080', // Blue text when focused

  },
  button: {
    backgroundColor: '#0c0c33',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 10,
    width: '90%',
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
    color: 'red',
    fontSize: 14,
    marginBottom: 0,
    alignSelf: 'flex-start',
    marginLeft: '10%',
  },
  linkButton: {
    marginTop: 15,
    width: '80%',
    alignSelf: 'center',
  },
  linkButtonText: {
    color: '#0000ff', // Choose a color that signifies it's a link
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline', // Underline to indicate it's clickable
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    zIndex: 2,
  },
  checkIcon: {
    position: 'absolute',
    right: 10,
    zIndex: 2,
  },

  separatorContainer: {
    flexDirection: 'row',  // Align items horizontally
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,  // Take up available space
    height: 1,
    backgroundColor: '#A9A9A9',  // Darker grey color
    marginHorizontal: 15,  // Adds horizontal margin to shorten the lines
  },
  separatorText: {
    width: 50,  // Fixed width for the text
    textAlign: 'center',
    color: '#A9A9A9',  // Light grey color
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#FFFFFF',  // White background to match the login button style
    borderWidth: 2,  // Adds border width
    borderColor: '#A9A9A9',  // Blue border color
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 5,
    width: '90%',
    alignSelf: 'center',

  },
  registerButtonText: {
    color: '#A9A9A9',  // Blue text to match the border
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default styles;
