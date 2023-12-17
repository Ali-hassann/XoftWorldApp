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
import Loader from '../utilities/loader'; // Import your Loader component

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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


  const loader = (value) => {
    setIsLoading(value);
  };

  const handleLogin = async () => {
    if (validateInputs()) {
      loader(true);
      showToast('info', 'Logging in...', 5000);
      try {
        Loader(true);
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
            AuthService.setUser(user);
            loader(false);
            showToast('success', 'Login successful!','Login successful!',2000);
            navigation.navigate('Home');
          } else {
            showToast('error', `${user?.Message}`);
          }
        } else {
          console.error('Login failed');
          loader(false);
          showToast(
            'error',
            'Invalid username or password. Please try again.'
          );
        }
      } catch (error) {
        loader(false);
        console.error('Error during login:', error);
        showToast('error', 'An error occurred. Please try again later.');
      }
    }
    setTimeout(() => {
      // When the API call is complete, hide the loader
      loader(false);
    }, 5000); // Simulated 2-second delay
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}><Entypo name="login" size={70} color={colors.primary} /></View>
      <View style={styles.formContainer}>
        <RNText style={styles.title}>Login to Your Account</RNText>
        <TextInput
          value={username}
          onChangeText={(text) => setUsername(text)}
          placeholder="Enter Username"
          style={styles.input}
        />
        {usernameError ? <RNText style={styles.errorText}>{usernameError}</RNText> : null}
        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Enter Password"
          secureTextEntry={true}
          style={styles.input}
        />
        {passwordError ? <RNText style={styles.errorText}>{passwordError}</RNText> : null}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <RNText style={styles.buttonText}>LOGIN</RNText>
        </TouchableOpacity>
        {/* <View style={styles.signupContainer}>
          <RNText>Don't have an account?</RNText>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <RNText style={styles.signupText}>Sign Up</RNText>
          </TouchableOpacity>
        </View> */}
        <Loader visible={isLoading} />
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