import { Image, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();
    StatusBar.setBackgroundColor('lightgrey');
    return (
        <View style={{
            flex: 1,
            backgroundColor: 'white',
            alignItems: 'center',
            marginTop: StatusBar.currentHeight,
        }}>
            <View style={{ marginTop: 50 }}>
                <Image style={{
                    width: 150,
                    height: 100,
                    resizeMode: 'contain',
                }}
                    source={{ uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png" }}
                />
            </View>
            <KeyboardAvoidingView>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 17, fontWeight: 'bold', marginTop: 25 }}>Login to Your Account</Text>
                </View>
                <View style={{ marginTop: 40 }}>
                    <View style={{
                        flexDirection: 'row',
                        gap: 5,
                        alignItems: 'center',
                        borderColor: '#D0D0D0',
                        borderWidth: 1,
                        paddingVertical: 5,
                        borderRadius: 5,
                    }}>
                        <MaterialIcons style={{ marginLeft: 10 }} name="email" size={24} color="gray" />
                        <TextInput
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            placeholderTextColor={'gray'}
                            style={{ color: 'gray', marginVertical: 10, width: '75%', fontSize: email ? 16 : 16 }} placeholder='Enter Your Email' />
                    </View>
                </View>
                <View style={{ marginTop: 30 }}>
                    <View style={{
                        flexDirection: 'row',
                        gap: 5,
                        alignItems: 'center',
                        borderColor: '#D0D0D0',
                        borderWidth: 1,
                        paddingVertical: 5,
                        borderRadius: 5,
                    }}>
                        <FontAwesome style={{ marginLeft: 10 }} name="lock" size={24} color="gray" />
                        <TextInput
                            secureTextEntry={true}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            placeholderTextColor={'gray'}
                            style={{ color: 'gray', marginVertical: 10, width: '75%', fontSize: password ? 16 : 16 }} placeholder='Enter Your Password' />
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 12, alignItems: 'center', justifyContent: 'space-between', }}>
                        <Text>Keep me logged in</Text>
                        <Text style={{ fontWeight: '500', color: '#007FFF', }}>Forgot Password</Text>
                    </View>
                </View>
                <View style={{ marginTop: 45 }} />

                <Pressable style={{
                    width: 200,
                    marginTop: 10,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    backgroundColor: 'black',
                    padding: 15,
                    marginTop: 20,
                    borderRadius: 6,
                }}>
                    <Text style={{
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 16,
                    }}>Login</Text>
                </Pressable>

                <Pressable onPress={() => navigation.navigate('Register')} style={{ marginTop: 10 }}>
                    <Text style={{
                        textAlign: 'center',
                        fontSize: 16,
                    }}>Don't have an account? Sign Up</Text>
                </Pressable>
            </KeyboardAvoidingView>
        </View>

    )
}

export default LoginScreen

const styles = StyleSheet.create({})

{/* // <View style={{
        // //     flex: 1,
        // //     alignItems: 'center',
        // //     justifyContent: 'center',
        // // }}>
        // //     <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        // //         <Text>Navigate to Register Screen</Text>
        // //     </TouchableOpacity>
        // // </View> */}