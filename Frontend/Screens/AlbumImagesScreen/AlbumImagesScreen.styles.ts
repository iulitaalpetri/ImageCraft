import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10
    },
    photoContainer: {
      marginBottom: 10,
    },
    photo: {
      width: '100%',
      height: 200,
      resizeMode: 'cover'
    },
    list: {
      paddingBottom: 20
    }
  });
  
export default styles;