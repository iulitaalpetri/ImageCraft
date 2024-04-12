// NavBar.styles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff', // White background
    borderTopWidth: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',

  },
  activeButton: {
    backgroundColor: '#000', // Active button background color
  },
  inactiveButton: {
    backgroundColor: 'transparent', // Inactive button has no background color
  },
  icon: {
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 12,
  },
  active: {
    color: '#0c0c33', // Active icon color (orange as an example)
  },
  inactive: {
    color: 'gray', // Inactive icon color
  },
  buttonHighlight: {
    backgroundColor: '#ff4500', // Color for the button background when pressed
  },
});

export default styles;