import React from 'react';
import { View, ActivityIndicator, Modal } from 'react-native';

const Loader = ({ visible }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent gray background
        }}
      >
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </Modal>
  );
};

export default Loader;
