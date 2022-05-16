import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, Text, Image } from "react-native";
import { View } from "../components/Themed";
import { LinearGradient } from 'expo-linear-gradient';
import { LOGO } from "./background_imgs";
import axios from 'axios'
import Toast from 'react-native-toast-message';

//Base URL
const baseUrl = 'http://127.0.0.1:8000';

export function LoginScreen({ navigation }: any) {

    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');

    const showToast = (title: any, message: any, type: any) => {
        Toast.show({
            type: type,
            text1: title,
            text2: message
        });
    }

    const validations = () => {
        let formIsValid = true;
        if (!mobile) {
            showToast("Error", "Mobile Number is required", "error")
            formIsValid = false;
        }
        if (mobile.length > 11) {
            showToast("Error", "Mobile Number shoud less than 10", "error")
            formIsValid = false;
        }
        if (!password) {
            showToast("Error", "Password required", "error")
            formIsValid = false;
        }
        return formIsValid;
    }

    const signIn = async () => {
        if (validations()) {
            const payload = {
                "mobile": mobile,
                "password": password
            }

            axios.post(
                baseUrl + '/sign-in',
                payload
            ).then((response) => {
                localStorage.setItem("id", response.data.id)
                localStorage.setItem("name", response.data.name)
                showToast("Success", "Login Successful", "success")
                navigation.navigate('Welcome')
            }).catch((error) => {
                if (error.response) {
                    showToast("Error", error.response.data.detail, "error")
                }
            });
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#262626', '#75dadf']}
                style={styles.background}
            />
            <View style={{ width: '100%', height: 'auto', bottom: 0, position: 'absolute', backgroundColor: '#ffffff69', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

                <View style={{ height: 120, width: 120, borderRadius: 100, alignContent: 'center', alignItems: 'center', margin: 'auto', zIndex: 1, top: -50, backgroundColor: '#ffffff69' }}>
                    <Image
                        style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'stretch'
                        }}
                        source={LOGO} />
                </View>
                <Text style={{ marginLeft: '10%', color: '#4a4141', fontWeight: '700', fontSize: 22, marginTop: 40 }}>Signin</Text>
                <Text style={{ marginLeft: '10%', color: '#4a4141', fontWeight: '600', fontSize: 15, marginTop: 20 }}>Mobile Number</Text>
                <View style={{ width: '100%', height: 'auto', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none' }}>
                    <View
                        style={{
                            width: '80%',
                            height: '50px',
                            borderRadius: 10,
                            marginTop: '10px',
                            shadowOpacity: 0.25,
                            shadowRadius: 30,
                            shadowOffset: {
                                height: 0,
                                width: 0,
                            },
                        }}>
                        <TextInput
                            onChange={(event: any) => setMobile(event.target.value)}
                            secureTextEntry={false}
                            style={{
                                height: '100%',
                                padding: '10px',
                            }}
                            placeholder="07xxxxxx"
                        />
                    </View>
                </View>
                <Text style={{ marginLeft: '10%', color: '#4a4141', fontWeight: '600', fontSize: 15, marginTop: 20 }}>Password</Text>
                <View style={{ width: '100%', height: 'auto', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none' }}>
                    <View
                        style={{
                            width: '80%',
                            height: '50px',
                            borderRadius: 10,
                            marginTop: '10px',
                            shadowOpacity: 0.25,
                            shadowRadius: 30,
                            shadowOffset: {
                                height: 0,
                                width: 0,
                            },
                        }}>
                        <TextInput
                            onChange={(event: any) => setPassword(event.target.value)}
                            secureTextEntry={true}
                            style={{
                                height: '100%',
                                padding: '10px',
                            }}
                            placeholder="password"
                        />
                    </View>
                </View>
                <View style={{ width: '100%', height: 'auto', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none', marginVertical: 15 }}>
                    <Pressable onPress={() => navigation.navigate('Registration')}>
                        <Text style={{ color: '#4a4141', fontWeight: '500', fontSize: 15 }}>Don't you have an account? <b>Sign up</b></Text>
                    </Pressable>
                </View>
                <View style={{ width: '100%', height: 'auto', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none', marginTop: 10, marginBottom: 40 }}>
                    <Pressable
                        testID="signInBtn"
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                        }}
                        onPress={() => signIn()}>
                        <LinearGradient
                            colors={['#50aeffeb', '#26ced7f2']}
                            style={{
                                marginTop: 30,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: '#2196f3',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '80%',
                                height: '50px',
                                backgroundColor: '#2196f3',
                                shadowOpacity: 0.25,
                                shadowRadius: 30,
                                shadowOffset: {
                                    height: 0,
                                    width: 0,
                                },
                            }}>
                            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>Sign In</Text>
                        </LinearGradient>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
});

