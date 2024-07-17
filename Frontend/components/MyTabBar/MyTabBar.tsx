import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faImages, faUserFriends, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const MyTabBar = ({ state, descriptors, navigation, onPlusPress }) => {
    return (
      <View style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title || route.name;
          const isFocused = state.index === index;
  
          const onPress = () => {
            if (route.name === 'Plus') {
              onPlusPress(); // This should trigger showing the modal
              return;
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
  
          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
  
          // Use faPlusCircle instead of faPlus
          const icon = route.name === 'GalleryScreen' ? faImages :
                       route.name === 'FriendsScreen' ? faUserFriends :
                       faPlusCircle;
  
          const iconColor = isFocused ? '#003366' : '#444444'; // Dark midnight blue color when focused
  
          if (route.name === 'Plus') {
              return (
                  <View style={styles.fabContainer} key={index}>
                    <TouchableOpacity
                      onPress={onPress}
                      onLongPress={onLongPress}
                      style={styles.fabButton}
                      accessibilityRole="button"
                    >
                      <FontAwesomeIcon icon={icon} size={49} color={iconColor} />
                    </TouchableOpacity>
                  </View>
                );
          }
  
          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabBarButton}
            >
              <FontAwesomeIcon icon={icon} size={28} color={iconColor} style={styles.iconStyle} />
              <Text style={[styles.textStyle, { color: iconColor }]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  
const styles = StyleSheet.create({
    tabBarContainer: {
      flexDirection: 'row',
      height: 80,
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
    width:60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    
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
  
export default MyTabBar;
