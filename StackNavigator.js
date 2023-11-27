import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import LoginScreen from './Screens/LoginScreen'
import RegisterScreen from './Screens/RegisterScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import HomeScreen from './Screens/HomeScreen'
import AddVoucher from './Screens/AddVoucher'
import PayablesReceiveables from './Screens/PayablesReceiveables'
import Toast from 'react-native-toast-message';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  })
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Voucher" component={AddVoucher} options={{ headerShown: false }} />
        <Stack.Screen name="PayablesReceiveables" component={PayablesReceiveables} options={{ headerShown: false }} />
      </Stack.Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})