import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 90,  
  },
  backButton: {
    position: 'absolute',
    top: 55, 
    left: 10,
    zIndex: 1, 
  },
  photoContainer: {
    width: (width / 3) - 6,  
    marginBottom: 5,
    marginHorizontal: 2, 
  },
  photo: {
    height: 100,  
    resizeMode: 'cover',
    width: '100%',  
  },
  list: {
    paddingBottom: 20,
  }
});



export default styles;
