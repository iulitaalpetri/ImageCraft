import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    position: 'absolute',
    top: 40, 
    right: -40, // Move to the right corner
    padding: 20,
  },
  headerLeft: {
    position: 'absolute',
    top: 50, // Adjust as needed
    left: 10, // Move to the left corner
    padding: 10,
  },
  image: {
    width: 150, // Adjust as needed
    height: 60, // Adjust as needed
    resizeMode: 'contain',
  },
});

const modalStyles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 7, // Add space between the welcome text and the content below
  },
  buttonClose: {
    width: 220,
    marginTop: 5,
    backgroundColor: "#0c0c33",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 20,  // Cresc distanța de jos pentru a oferi mai mult spațiu
    textAlign: "center",
    color: "#333",  // O culoare mai închisă pentru text pentru a îmbunătăți contrastul
    fontSize: 18,  // O mărime mai mare pentru a facilita citirea
    fontWeight: "500",  // O greutate medie pentru text pentru a-l face să iasă în evidență
    lineHeight: 24,  // Spațiu adițional între linii pentru a îmbunătăți lizibilitatea
},
  input: {
    width: '80%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

// Export the style objects
export { styles, modalStyles };
