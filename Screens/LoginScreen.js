import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text as RNText,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { showToast } from '../utilities/toast';
import AuthService from '../api/auth-service/auth-service';
import { Entypo } from '@expo/vector-icons';
import { colors, defaultValues } from '../utilities/Constants/constant';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  StatusBar.setBackgroundColor('lightgrey');

  const validateInputs = () => {
    let isValid = true;

    if (username.length == 0) {
      setUsernameError('Username must be at least 3 characters.');
      isValid = false;
    } else {
      setUsernameError('');
    }

    if (password.length == 0) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (validateInputs()) {
      showToast('info', 'Logging in...');
      try {
        const response = await fetch(`${defaultValues.baseUrl}/Users/UserLogin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            UserName: username,
            Password: password,
          }),
        });

        if (response.ok) {
          const user = await response.json();
          if (user?.BranchId > 0) {
            console.log(user.BranchId);
            AuthService.setUser(user);
            console.log(`login ${AuthService.getUser(user)?.BranchId}`);

            showToast('success', 'Login successful!');
            navigation.navigate('Home');
          } else {
            showToast('error', `${user?.Message}`);
          }
        } else {
          console.error('Login failed');
          showToast(
            'error',
            'Invalid username or password. Please try again.'
          );
        }
      } catch (error) {
        console.error('Error during login:', error);
        showToast('error', 'An error occurred. Please try again later.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}><Entypo name="login" size={70} color={colors.primary} /></View>
      <View style={styles.formContainer}>
        <RNText style={styles.title}>Login to Your Account</RNText>
        <TextInput
          value={username}
          onChangeText={(text) => setUsername(text)}
          placeholder="Enter Your Email"
          style={styles.input}
        />
        {usernameError ? <RNText style={styles.errorText}>{usernameError}</RNText> : null}
        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Enter Your Password"
          secureTextEntry={true}
          style={styles.input}
        />
        {passwordError ? <RNText style={styles.errorText}>{passwordError}</RNText> : null}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <RNText style={styles.buttonText}>LOGIN</RNText>
        </TouchableOpacity>
        <View style={styles.signupContainer}>
          <RNText>Don't have an account?</RNText>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <RNText style={styles.signupText}>Sign Up</RNText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.light,
  },
  logoContainer: {
    marginTop: 50,
  },
  formContainer: {
    width: '80%',
    marginTop: 30,
  },
  title: {
    textAlign: 'center',
    marginBottom: 25,
    fontSize: 17,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#D0D0D0',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    color: colors.dar,
    marginVertical: 10,
    width: 300,
    fontSize: 16,
  },
  errorText: {
    color: colors.danger,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 6,
    marginTop: 30,
    width: 200,
    alignSelf: 'center', // This centers the button in its parent container
  },
  buttonText: {
    color: colors.light,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  signupContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 5,
  },
});