import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Modal, Button, ScrollView, Dimensions, TextInput , Alert, VirtualizedList} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { deletePhoto, startEditSession } from '../../src/api/photo_api';
import { fetchDetectedFaces, isDetectedFacePerson } from '../../src/api/detected_faces_api';
import {addPerson} from '../../src/api/person_api';
import LoadingOverlay from '../../components/LoadingPage/LoadingPage';
import moment from 'moment';

const formatDate = (dateString) => {
  return moment(dateString).format('MMMM Do YYYY, h:mm:ss a'); // "June 11th 2024, 5:49:26 pm"
};



const { width, height } = Dimensions.get('window');

const ImageScreen = ({ route, navigation }) => {
  const { photo, photos } = route.params;
  const [currentPhoto, setCurrentPhoto] = useState(route.params.photo); // Start with the initial photo passed in params
  console.log("currentPhoto",currentPhoto);

  const [photoList, setPhotoList] = useState(photos); // Manage the photo list in the state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNoPhotosModal, setShowNoPhotosModal] = useState(false); // State to control the no photos left modal
  const [modalVisible, setModalVisible] = useState(false);
  const [detectedFaces, setDetectedFaces] = useState([]);
  const scrollViewRef = useRef(null);
  const [selectedFaceId, setSelectedFaceId] = useState(null);
  const [personName, setPersonName] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);



 

  useEffect(() => {
    const fetchFaces = async () => {
      if (currentPhoto?.id) {

        try {
          const faces = await fetchDetectedFaces(currentPhoto.id);
          const facesWithPerson = await Promise.all(faces.map(async (face) => {
            const personName = await isDetectedFacePerson(face.id);
            return { ...face, personName: typeof personName === 'string' ? personName : null };
          }));
          setDetectedFaces(facesWithPerson);
        } catch (error) {
          console.error('Error fetching faces:', error);
        }
      }
    };

    fetchFaces();
  }, [currentPhoto]);
  

  
  const handleAddPerson = async () => {
    setIsLoading(true);
    try {
      const response = await addPerson(selectedFaceId, personName);
      setModalVisible(false); // Close modal on success
      setPersonName(''); // Reset name input
    } catch (error) {
      console.error('Failed to add person:', error);
    }
    setIsLoading(false);
  };
  

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await deletePhoto(photo.id);
      const updatedPhotos = photoList.filter(p => p.id !== photo.id);
      setPhotoList(updatedPhotos); 
      
      setShowDeleteModal(false); 
  
      if (updatedPhotos.length === 0) {
        setTimeout(() => setShowNoPhotosModal(true), 300);
      } else {
        
        let newIndex = photoList.findIndex(p => p.id === photo.id) - 1;
        if (newIndex < 0) newIndex = 0;
        navigation.replace('ImageScreen', { photo: updatedPhotos[newIndex], photos: updatedPhotos });
      }
    } catch (error) {
      setShowDeleteModal(false); 
    }
    setIsLoading(false);
  };
  
  const handleStartEdit = async () => {
    setIsLoading(true);
    try {
      const response = await startEditSession(photo.id);
      navigation.navigate('EditPhotoScreen', { photoId: photo.id, photoUri: photo.image });
    } catch (error) {
      console.log('Error', error.message || 'Failed to start edit session');
    }
    setIsLoading(false);
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newCurrentPhoto = viewableItems[0].item;
      if (newCurrentPhoto.id !== currentPhoto.id) {
        setCurrentPhoto(newCurrentPhoto);
      }
    }
  }, [currentPhoto]);

  

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50
  };


  const renderItem = ({ item }) => (
    
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.image }} style={styles.fullImage} />
    </View>

  );

  
  
  
  return (
    <View style={styles.container}>
    <LoadingOverlay isLoading={isLoading} />
    <TouchableOpacity
  style={styles.backButton}
  onPress={() => {
    navigation.navigate('AlbumImagesScreen', {
      albumId: 2, // or the relevant album ID dynamically
      photo_list: photoList // Make sure this is updated after deletion
    });
  }}>
  <Ionicons name="arrow-back" size={24} color="black" />
</TouchableOpacity>


   

    {photoList.length > 0 ? (

    <ScrollView
      style={{ flex: 1 }}
      ref={scrollViewRef}
      contentContainerStyle={{ alignItems: 'center' }} // Use contentContainerStyle for inner container styles
      scrollEventThrottle={16}
      >
        <FlatList
  horizontal
  pagingEnabled
  data={photos}
  renderItem={renderItem}
  keyExtractor={item => item.id.toString()}
  initialScrollIndex={photoList.findIndex(p => p.id === photo.id)}
  getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
  showsHorizontalScrollIndicator={false}
  onViewableItemsChanged={onViewableItemsChanged}
  viewabilityConfig={viewabilityConfig}
/>

    <View style={styles.infoContainer}>


    <View style={styles.dateContainer}>
      <Text style={styles.dateText}>Date: {formatDate(currentPhoto.date)}</Text>
    </View>

        

        <FlatList
        horizontal
        data={detectedFaces}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
          if (item.personName) {
            return (
              <View style={styles.faceContainer}>
                <Image source={{ uri: item.image }} style={styles.faceImage} />
                <Text style={styles.personName}>{item.personName}</Text>
              </View>
            );
          } else {
            return (
              <TouchableOpacity 
                style={styles.faceButton} 
                onPress={() => {
                  setSelectedFaceId(item.id);
                  setModalVisible(true);
                }}
              >
                <Image source={{ uri: item.image }} style={styles.faceImage} />
                <Ionicons name="add-circle" size={24} color="black" style={styles.iconOnImage} />
              </TouchableOpacity>
            );
          }
        }}
        contentContainerStyle={styles.facesContainer}
        showsHorizontalScrollIndicator={false}
      />
      </View>
      </ScrollView>

              ) : (<Modal
                animationType="slide"
                transparent={true}
                visible={showNoPhotosModal}
                onRequestClose={() => {
                  setShowNoPhotosModal(false);
                  navigation.goBack(); // Go back after closing the modal
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>You have no more photos.</Text>
                    <Button title="OK" onPress={() => {
                      setShowNoPhotosModal(false);
                      navigation.goBack();
                    }} color="#0c0c33" />
                  </View>
                </View>
              </Modal>
            )}


    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.actionButton} onPress={() => setShowDeleteModal(true)}>
        <MaterialIcons name="delete" size={28} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={handleStartEdit}>
        <MaterialIcons name="edit" size={28} color="white" />
      </TouchableOpacity>
  

      <Modal
  animationType="slide"
  transparent={true}
  visible={showDeleteModal}
  onRequestClose={() => setShowDeleteModal(false)}
>
  <View style={styles.centeredView}>
    <View style={styles.modalView}>
      <Text style={styles.modalText}>Are you sure you want to delete this photo?</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.modalButton, styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.modalButtonText}>Yes, Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowDeleteModal(false)}>
          <Text style={styles.modalButtonText}>No, Keep</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(!modalVisible)}
>
  <View style={styles.centeredView}>
    <View style={styles.modalView}>
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={24} color="#333" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          onChangeText={setPersonName}
          value={personName}
          placeholder="Enter person's name"
        />
      </View>
      <TouchableOpacity style={styles.fancyButton} onPress={handleAddPerson}>
        <Text style={styles.fancyButtonText}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


      
      </View>
          </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    top: 10,
    backgroundColor: 'transparent'
  },
  fullImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  buttonContainer: {
    backgroundColor: 'transparent',  // Setează fundalul ca fiind transparent
    flexDirection: 'row',           // Elementele copil sunt aliniate într-un rând orizontal
    justifyContent: 'space-evenly', // Distribuie spațiul uniform între butoane
    padding: 10,                    // Adaugă un spațiu interior de 10 puncte
    bottom: 20                      // Poziționează containerul mai sus cu 20 puncte
},
  actionButton: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#0c0c33', // Slightly darker grey for the button background
    flexDirection: 'row',
    justifyContent: 'center',
  },
  centeredView: {
    
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Adding a semi-transparent background
  },
  modalView: {
    margin: 20,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,  // Softer corners
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    fontSize: 16,  // Smaller and more delicate text
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'normal',  // Less bold
    color: '#333'
  },
  buttonRow: {
    // transparent background to ensure the buttons are visible
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'  // Ensure the buttons are spread across the modal
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteButton: {
    backgroundColor: '#f05',  // Vibrant delete button
  },
  cancelButton: {
    backgroundColor: '#0c0c33'  // More subtle cancel button
  },
  modalButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500'  // Slightly bold but less than before
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 5,
    marginBottom: 20,
    width: '100%',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
    borderWidth: 0, // Ensure no border is applied
    borderColor: '#ccc', // Border color for bottom line
  },
  fancyButton: {
    backgroundColor: '#0c0c33', // A rich green color
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    
  },
  fancyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editButton: {
    height: 50, // height of the button area
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDD', // optional: style for the button background
  },
  buttonText: {
    color: 'white', // Ensure text is white
    marginLeft: 5, // Give some space between the icon and the text
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 10,
    padding: 10,
    zIndex: 10,  // Ensure it is on top of other components
  },
  
  dateContainer: {
  padding: 10,
  marginBottom: 10, // asigură un spațiu sub container
  alignSelf: 'center' // centrat pe ecran
},

dateText: {
  color: '#333',
  fontSize: 16,
  fontWeight: 'bold'
},
  facesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  // faceImage: {
  //   width: 100,
  //   height: 100,
  //   margin: 5,
  //   borderRadius: 50,  // Assuming you want round images
  // },
  faceButton: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 50, // Keep the rounded style
    overflow: 'visible', // Change to 'visible' to allow the icon to appear outside the image area
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Needed for absolute positioning of the icon
  },
  iconOnImage: {
    position: 'absolute',
    top: -7, // Adjust position to ensure visibility
    right: -8, // Adjust position to ensure visibility
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Optional: add a light background to enhance visibility
    borderRadius: 12, // Optional: round the background
    padding: 2, // Optional: add padding around the icon
  },
  
  
  faceContainer: {
    margin: 10,
    alignItems: 'center',
  },
  faceImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  personName: {
    marginTop: 5,
  },

  infoContainer: {
    width: '90%',
    backgroundColor: '#ffffff', // Fundal alb sau altă culoare deschisă
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 10,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 5
  },
  
});

export default ImageScreen;
