import Toast from 'react-native-toast-message';

export const showToast = (type, text, description = "", visibilityTime = 3000) => {
  Toast.show({
    type: type,
    position: 'bottom',
    text1: text,
    visibilityTime: visibilityTime,
    autoHide: true,
    text2: description
  });
};