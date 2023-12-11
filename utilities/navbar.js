import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from './Constants/constant';
import authServiceInstance from '../api/auth-service/auth-service';
import { Entypo } from '@expo/vector-icons';

function CustomHeader({ title, showBackButton }) {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleBack = () => {
    if (showBackButton) {
      navigation.goBack();
    }
  };

  const handleLogout = () => {
    // console.log("loout press");
    authServiceInstance.logout();
    navigation.navigate("Login");
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 60,
        backgroundColor: colors.neutral, // Light gray background with subtle gradient
        // Add gradient:
        // backgroundImage: LinearGradientColors,
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
      <View  ><Entypo onPress={handleLogout} name="log-out" size={24} color={colors.danger} /></View>
      {/* <Image
    style={{ width: 30, height: 30 }}
    source={require('./app-icon.png')}
  /> */}
    </View>
  );
}

export default CustomHeader;
