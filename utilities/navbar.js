import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CustomTopNavigation = ({ title, showBackButton = true }) => {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logout');
  };

  return {
    title: title,
    headerLeft: showBackButton
      ? () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text>Back</Text>
          </TouchableOpacity>
        )
      : undefined,
    headerRight: () => (
      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    ),
  };
};

export default CustomTopNavigation;