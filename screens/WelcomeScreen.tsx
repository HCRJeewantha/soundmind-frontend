import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, Image } from "react-native";
import { View } from "../components/Themed";
import { LinearGradient } from 'expo-linear-gradient';
import { LOGO, WELCOME } from "./background_imgs";

export function WelcomeScreen({ navigation }: any) {

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#262626', '#75dadf']}
                style={styles.background}
            />
            <View style={{ width: '100%', height: 'auto', bottom: 0, position: 'absolute', backgroundColor: '#ffffff69', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

                <View style={{ height: 80, width: 80, borderRadius: 100, alignContent: 'center', alignItems: 'center', margin: 'auto', zIndex: 1, top: -40, backgroundColor: '#ffffff69' }}>
                    <Image
                        style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'stretch'
                        }}
                        source={LOGO} />
                </View>
                <Text style={{ color: '#4a4141', fontWeight: '700', fontSize: 22, textAlign: 'center' }}>Welcome to Sound Mind</Text>
                <Text style={{ color: '#4a4141', fontWeight: '600', fontSize: 15, marginTop: 20, textAlign: 'center' }}>You're well on your way to living a happier life,soundminder!</Text>
                <View style={{ height: 210, width: 330, alignContent: 'center', alignItems: 'center', margin: 'auto', zIndex: 1, backgroundColor: 'none', marginVertical: 20 }}>
                    <Image
                        style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'stretch'
                        }}
                        source={WELCOME} />
                </View>
                <View style={{ width: '100%', height: 'auto', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none', marginTop: 10, marginBottom: 40 }}>
                    <Pressable
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                        }}
                        onPress={() => navigation.navigate('Tabs')}
                    >
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
                            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>Let's get started</Text>
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

