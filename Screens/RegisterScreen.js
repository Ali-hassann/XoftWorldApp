// import { Image, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
// import React, { useState } from 'react'
// import { MaterialIcons } from '@expo/vector-icons';
// import { FontAwesome } from '@expo/vector-icons';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// const RegisterScreen = () => {
//     // const navigation = navigation();
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [name, setName] = useState("");
//     const navigation = useNavigation();
//     return (
//         <View style={{
//             flex: 1,
//             backgroundColor: 'white',
//             alignItems: 'center',
//             marginTop: 34,
//         }}>
//             <View style={{ marginTop: 50 }}>
//                 <Image style={{
//                     width: 150,
//                     height: 100,
//                     resizeMode: 'contain',
//                 }}
//                     source={{ uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png" }}
//                 />
//             </View>
//             <KeyboardAvoidingView>
//                 <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                     <Text style={{ fontSize: 17, fontWeight: 'bold', marginTop: 25 }}>Register</Text>
//                 </View>
//                 <View style={{ marginTop: 40 }}>
//                     <View style={{
//                         flexDirection: 'row',
//                         gap: 5,
//                         alignItems: 'center',
//                         borderColor: '#D0D0D0',
//                         borderWidth: 1,
//                         paddingVertical: 5,
//                         borderRadius: 5,
//                     }}>
//                         <Ionicons style={{ marginLeft: 10 }} name="person" size={24} color="gray" />
//                         <TextInput
//                             value={name}
//                             onChangeText={(text) => setName(text)}
//                             placeholderTextColor={'gray'}
//                             style={{ color: 'gray', marginVertical: 10, width: '75%', fontSize: email ? 16 : 16 }} placeholder='Enter Your Name' />
//                     </View>
//                     <View style={{ marginTop: 30 }}></View>
//                     <View style={{
//                         flexDirection: 'row',
//                         gap: 5,
//                         alignItems: 'center',
//                         borderColor: '#D0D0D0',
//                         borderWidth: 1,
//                         paddingVertical: 5,
//                         borderRadius: 5,
//                     }}>
//                         <MaterialIcons style={{ marginLeft: 10 }} name="email" size={24} color="gray" />
//                         <TextInput
//                             value={email}
//                             onChangeText={(text) => setEmail(text)}
//                             placeholderTextColor={'gray'}
//                             style={{ color: 'gray', marginVertical: 10, width: '75%', fontSize: email ? 16 : 16 }} placeholder='Enter Your Email' />
//                     </View>
//                 </View>
//                 <View style={{ marginTop: 30 }}>
//                     <View style={{
//                         flexDirection: 'row',
//                         gap: 5,
//                         alignItems: 'center',
//                         borderColor: '#D0D0D0',
//                         borderWidth: 1,
//                         paddingVertical: 5,
//                         borderRadius: 5,
//                     }}>
//                         <FontAwesome style={{ marginLeft: 10 }} name="lock" size={24} color="gray" />
//                         <TextInput
//                             secureTextEntry={true}
//                             value={password}
//                             onChangeText={(text) => setPassword(text)}
//                             placeholderTextColor={'gray'}
//                             style={{ color: 'gray', marginVertical: 10, width: '75%', fontSize: password ? 16 : 16 }} placeholder='Enter Your Password' />
//                     </View>

//                 </View>
//                 <View style={{ marginTop: 45 }} />

//                 <Pressable style={{
//                     width: 200,
//                     marginTop: 10,
//                     marginLeft: 'auto',
//                     marginRight: 'auto',
//                     backgroundColor: 'black',
//                     padding: 15,
//                     marginTop: 20,
//                     borderRadius: 6,
//                 }}>
//                     <Text style={{
//                         color: 'white',
//                         textAlign: 'center',
//                         fontWeight: 'bold',
//                         fontSize: 16,
//                     }}>Register</Text>
//                 </Pressable>

//                 <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 10 }}>
//                     <Text style={{
//                         textAlign: 'center',
//                         fontSize: 16,
//                     }}>Already have an account? Sign In</Text>
//                 </Pressable>
//             </KeyboardAvoidingView>
//         </View>
//     )
// }

// export default RegisterScreen

// const styles = StyleSheet.create({})

// // <View style={{
// //             flex: 1,
// //             alignItems: 'center',
// //             justifyContent: 'center',
// //         }}>
// //             {/* <Text>RegisterScreen</Text> */}
// //             <TouchableOpacity onPress={() => navigation.navigate('Login')}>
// //                 <Text>Navigate to Login Screen</Text>
// //             </TouchableOpacity>
// //         </View>


import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigation = useNavigation();
  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
    };

    axios
      .post("http://localhost:3000/register", user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Registration successful",
          "you have been registered successfully"
        );
        setName("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        Alert.alert(
          "Registration failed",
          "An error occurred during registration"
        );
        console.log("error", error);
      });
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View style={{ marginTop: 50 }}>
        <AntDesign name="adduser" size={70} color="black" />
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 25 }}>
            Register to Your Account
          </Text>
        </View>

        <View style={{ marginTop: 30 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              paddingVertical: 5,
              borderRadius: 5,
            }}
          >
            <Ionicons
              style={{ marginLeft: 8 }}
              name="person"
              size={24}
              color="gray"
            />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              placeholderTextColor={"gray"}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: password ? 16 : 16,
              }}
              placeholder="enter your Name"
            />
          </View>
        </View>

        <View style={{ marginTop: 30 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              paddingVertical: 5,
              borderRadius: 5,
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="gray"
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholderTextColor={"gray"}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: email ? 16 : 16,
              }}
              placeholder="enter your Email"
            />
          </View>

          <View style={{ marginTop: 30 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                paddingVertical: 5,
                borderRadius: 5,
              }}
            >
              <AntDesign
                style={{ marginLeft: 8 }}
                name="lock"
                size={24}
                color="gray"
              />
              <TextInput
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholderTextColor={"gray"}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: password ? 16 : 16,
                }}
                placeholder="enter your Password"
              />
            </View>
          </View>
        </View>

        <View style={{ marginTop: 45 }} />

        <Pressable
          onPress={handleRegister}
          style={{
            width: 200,
            backgroundColor: "black",
            padding: 15,
            marginTop: 30,
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 6,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 16,
              color: "white",
              textTransform: "uppercase"
            }}
          >
            Register
          </Text>
        </Pressable>
        <Pressable style={{ marginTop: 10, alignItems: 'center', }}>
          <View style={{
            // flex: 1,
            flexDirection: 'row',
          }} >
            <Text style={{
              fontSize: 16,
            }}>Already have an account? </Text>
            <Text onPress={() => navigation.goBack()} style={{
              color: '#007FFF',
              fontWeight: '600',
              fontSize: 16,
            }}>Sign In</Text>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});