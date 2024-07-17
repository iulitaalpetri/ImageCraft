// NavBar.styles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 80, // Increased height for the tab bar
    elevation: 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  fabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#673ab7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  tabBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: {
    marginBottom: 5, // space between icon and text
  },
  textStyle: {
    fontSize: 10, // adjust text size as needed
  }
});

export default styles;

