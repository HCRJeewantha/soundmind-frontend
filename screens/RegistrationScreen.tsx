import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, TextInput, Text, Image } from "react-native";
import { View } from "../components/Themed";
import { RootStackScreenProps } from "../types";
import { LinearGradient } from 'expo-linear-gradient';  //import LinearGradient module
import { LOGO } from "./background_imgs";
import axios from 'axios'

const baseUrl = 'http://127.0.0.1:8000';

export default function RegistrationScreen({ navigation }: any) {

    const [userName, setUserName] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const signUp = async () => {
        const payload = {
            "name": userName,
            "mobile": mobile,
            "password": password,
            "confirm_password": confirmPassword
        }

        axios.post(
          baseUrl + '/sign-up',
          payload
        ).then((response) => {
          console.log(response)
          navigation.navigate('Welcome')
        }).catch((error) => {
          console.log(error)
        });
    };


    const ButtonComponent = (props: any) => {
        return (
            <Pressable
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                }}
                onPress={() => signUp()}>
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

                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>{props.buttonText}</Text>
                </LinearGradient>
            </Pressable>
        )
    }

    const InputField = (props: any) => {
        return (
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
                    secureTextEntry={props.secure}
                    onChange={(event: any) => setUserName(event.target.value)}
                    style={{
                        height: '100%',
                        padding: '10px',
                    }}
                    placeholder={props.placeHolder}
                />
            </View>
        )
    }

    const navigate = async () => {
        console.log("here");
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#262626', '#75dadf']}
                style={styles.background}
            />

            <View style={{ width: '100%', height: 'auto', bottom: 0, position: 'absolute', backgroundColor: '#ffffff69', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

                {/* <View style={{ height: 120, width: 120, borderRadius: 100, alignContent: 'center', alignItems: 'center', margin: 'auto', zIndex: 1, top: 30, backgroundColor: '#ffffff69' }}>
                    <Image
                        style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'stretch'
                        }}
                        source={LOGO} />
                </View> */}

                <Text style={{ marginLeft: '10%', color: '#4a4141', fontWeight: '700', fontSize: 22, marginTop: 40 }}>Sign up</Text>

                <Text style={{ marginLeft: '10%', color: '#4a4141', fontWeight: '600', fontSize: 15, marginTop: 40 }}>User Name</Text>
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
                            secureTextEntry={false}
                            onChange={(event: any) => setUserName(event.target.value)}
                            style={{
                                height: '100%',
                                padding: '10px',
                            }}
                            placeholder="User Name"
                        />
                    </View>
                </View>

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
                            secureTextEntry={false}
                            onChange={(event: any) => setMobile(event.target.value)}
                            style={{
                                height: '100%',
                                padding: '10px',
                            }}
                            placeholder="077xxxxxxx"
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
                            secureTextEntry={true}
                            onChange={(event: any) => setPassword(event.target.value)}
                            style={{
                                height: '100%',
                                padding: '10px',
                            }}
                            placeholder="Password"
                        />
                    </View>
                </View>


                <Text style={{ marginLeft: '10%', color: '#4a4141', fontWeight: '600', fontSize: 15, marginTop: 20 }}>Confirm Password</Text>
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
                            secureTextEntry={true}
                            onChange={(event: any) => setConfirmPassword(event.target.value)}
                            style={{
                                height: '100%',
                                padding: '10px',
                            }}
                            placeholder="Password"
                        />
                    </View>
                </View>

                <View style={{ width: '100%', height: 'auto', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none', marginVertical: 15 }}>
                    <Pressable onPress={() => navigation.navigate('Login')}>
                        <Text style={{ color: '#4a4141', fontWeight: '500', fontSize: 15 }}>Do you have an account? <b>Sign in</b></Text>
                    </Pressable>
                </View>

                <View style={{ width: '100%', height: 'auto', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none', marginTop: 10, marginBottom: 30 }}>
                    <ButtonComponent buttonText="Sign up"></ButtonComponent>
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

