import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './Screens/HomeScreen';
import AddVoucher from './Screens/AddVoucher';
import PayablesReceiveables from './Screens/PayablesReceiveables';
import Toast from 'react-native-toast-message';
import AuthService from './api/auth-service/auth-service'; // Import your AuthService

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is logged in when the component mounts
    const checkUserLoginStatus = async () => {
      const user = await AuthService.getUser(); // Replace with your AuthService function to get user data

      if (user) {
        // User is authenticated, set the current user and setLoading to false
        setCurrentUser(user);
        setLoading(false);
      } else {
        // User is not authenticated, setLoading to false
        setLoading(false);
      }
    };

    checkUserLoginStatus();
  }, []);

  // Display loading screen while checking user authentication
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {AuthService.getUser()?.OrgId > 0 ? (
          // User is authenticated, navigate to the Home screen
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Voucher" component={AddVoucher} options={{ headerShown: false }} />
            <Stack.Screen name="PayablesReceiveables" component={PayablesReceiveables} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          </>
        ) : (
          // User is not authenticated, navigate to the Login and Register screens
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Voucher" component={AddVoucher} options={{ headerShown: false }} />
            <Stack.Screen name="PayablesReceiveables" component={PayablesReceiveables} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
  },
});
