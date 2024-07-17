import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    height :120,
    alignItems: 'center',
    justifyContent: 'center',
    //make background semi-transparent
    backgroundColor: '#f5f5f5',

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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
  },
  centerButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  imageButton: {
    width: 170,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  buttonImage: {
    width: '100%',
    height: '100%',
  },
  overlayStyle: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Negru cu 50% transparență
    justifyContent: 'center',

}

});

const modalStyles = StyleSheet.create({
  overlayStyle: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Negru cu 50% transparență
    justifyContent: 'center',
}
,
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 15,
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
    borderRadius: 15,
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
  inputContainer: {
    flexDirection: 'row', // Use row layout to place the icon next to the input
    alignItems: 'center',
    width: '90%',
    marginVertical: 8,
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
  icon: {
    marginRight: 10,
  },
});

// Export the style objects
export { styles, modalStyles };
