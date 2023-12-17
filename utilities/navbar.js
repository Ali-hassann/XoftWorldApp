import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, BackHandler,Platform  } from 'react-native'; // Import Modal and Button
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from './Constants/constant';
import authServiceInstance from '../api/auth-service/auth-service';
import { Entypo } from '@expo/vector-icons';
// import ExitApp from 'react-native-exit-app';

function CustomHeader({ title, showBackButton }) {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmLogoutModalVisible, setConfirmLogoutModalVisible] = useState(false); // State to control the confirmation modal

  const handleBack = () => {
    if (showBackButton) {
      navigation.goBack();
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (confirmLogoutModalVisible) {
        setConfirmLogoutModalVisible(false);
        return true;
      }
      return false;
    });

    return () => {
      backHandler.remove();
    };
  }, [confirmLogoutModalVisible]);

  const handleLogout = () => {
    // Open the confirmation modal before logging out
    setConfirmLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    authServiceInstance.logout();
    navigation.navigate("Login");
    BackHandler.exitApp();
     // Exit the app on Android or iOS
     
    setConfirmLogoutModalVisible(false); // Close the confirmation modal after logout
  };

  const cancelLogout = () => {
    setConfirmLogoutModalVisible(false); // Close the confirmation modal if user cancels
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 60,
        backgroundColor: colors.neutral,
      }}
    >
      {showBackButton && (
        <TouchableOpacity
          accessibilityLabel="Go back"
          onPress={handleBack}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.dark_alt} />
        </TouchableOpacity>
      )}
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.dark_alt }}>{title}</Text>
      <View>
        <Entypo onPress={handleLogout} name="log-out" size={24} color={colors.danger} />
      </View>

      {/* Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmLogoutModalVisible}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              alignItems: 'center',
              width: '80%', // Set the width to 80% of the screen
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>Are you sure you want to close?</Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between', // Ensure space between the buttons
                width: '80%',
                marginTop: 20, // Add margin to separate buttons from the text
              }}
            >
              <TouchableOpacity onPress={cancelLogout} style={{ flex: 1 }}>
                <Text style={{ color: colors.danger, fontWeight: 'bold' }}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={confirmLogout} style={{ flex: 1 }}>
                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default CustomHeader;
