import Toast from 'react-native-toast-message';

export const showToast = (type, text) => {
  Toast.show({
    type: type,
    position: 'center',
    text1: text,
    visibilityTime: 3000,
    autoHide: true,
  });
};