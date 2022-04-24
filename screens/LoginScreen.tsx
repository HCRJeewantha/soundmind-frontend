import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, TextInput, Text } from "react-native";
import { View } from "../components/Themed";
import { RootStackScreenProps } from "../types";
import { LinearGradient } from 'expo-linear-gradient';  //import LinearGradient module

export default function LoginScreen({ navigation }: any) {

    const ButtonComponent = (props: any) => {
        return (
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
                <Pressable onPress={() => navigation.navigate('Root')}>
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight:600 }}>{props.buttonText}</Text>
                </Pressable>
            </LinearGradient>

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
                    style={{
                        height: '100%',
                        padding: '10px',
                    }}
                    placeholder={props.placeHolder}
                />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#262626', '#75dadf']}
                style={styles.background}
            />
            <InputField placeHolder="Mobile Number"></InputField>
            <InputField placeHolder="Password"></InputField>
            <ButtonComponent buttonText="Sign in"></ButtonComponent>

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

