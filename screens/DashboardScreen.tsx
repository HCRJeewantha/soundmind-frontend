import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, TextInput, Text, Image, ScrollView, Dimensions, FlatList } from "react-native";
import { View } from "../components/Themed";
import { RootStackScreenProps, RootTabScreenProps } from "../types";
import { LinearGradient } from 'expo-linear-gradient';
import { LOGO, PLAYLIST } from "./background_imgs";
import { FontAwesome } from "@expo/vector-icons";
import axios from 'axios'

const baseUrl = 'http://127.0.0.1:8000';
const { width } = Dimensions.get('window');

export default function TabFourScreen({ navigation }: RootTabScreenProps<'TabFour'>) {

    const [musicForYou, setMusicForYou] = useState([]);

    const getMusicForYou = async () => {
        axios.get(
            baseUrl + '/get-music-for-you/rock'
        ).then((response) => {
            console.log(response.data.tracks.track)
            setMusicForYou(response.data.tracks.track)
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        //get playlist
        getMusicForYou()
    }, []);

    const renderItem = ({ item, index }: any) => (
        <View>
            <View style={styles.view} />
        </View>
    );


    return (
        <React.Fragment>
            <LinearGradient
                colors={['#262626', '#75dadf']}
                style={styles.background}
            />
            <ScrollView style={styles.container}>
                <View style={{ width: '100%', height: 'auto', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none', marginVertical: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', width: '95%', height: '80px', backgroundColor: 'none' }}>
                        <View style={{ width: '90%', height: '50px', padding: 5, justifyContent: 'center', alignItems: 'flex-start', backgroundColor: 'none' }} >
                            <Text style={{ fontSize: 20, fontWeight: '600', color: '#fff' }}>Good Evening</Text>
                        </View>
                        <View style={{ width: '10%', height: '50px', padding: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'none' }} >
                            <FontAwesome
                                style={{ marginRight: 5 }}
                                name="gear"
                                size={20}
                                color={'#fff'}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ width: '100%', height: 'auto', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none', marginVertical: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#00000052', width: '95%', borderRadius: 10 }}>
                        <View style={{ width: '30%', height: 'auto', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: 'none' }} >
                            <View style={{ height: 80, width: 90, alignContent: 'center', alignItems: 'center', backgroundColor: 'none' }}>
                                <Image
                                    style={{
                                        borderTopLeftRadius: 10,
                                        borderBottomLeftRadius: 10,
                                        width: '100%',
                                        height: '100%',
                                        resizeMode: 'stretch'
                                    }}
                                    source={PLAYLIST} />
                            </View>
                        </View>
                        <View style={{ width: '90%', height: 'auto', padding: 5, justifyContent: 'center', alignItems: 'flex-start', backgroundColor: 'none' }} >
                            <Text style={{ fontSize: 20, fontWeight: '600', color: '#fff' }}>My Playlist</Text>
                        </View>
                    </View>
                </View>
                <View style={{ width: '100%', height: 'auto', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none', marginVertical: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', width: '95%', backgroundColor: 'none' }}>
                        <Text style={{ fontSize: 20, fontWeight: '600', color: '#fff' }}>Music For You</Text>
                    </View>
                </View>
                <FlatList
                    ref={(scrollView) => { scrollView = scrollView; }}
                    style={styles.container}
                    horizontal={true}
                    decelerationRate={0}
                    snapToInterval={width - 60}
                    snapToAlignment={"center"}
                    data={musicForYou}
                    renderItem={renderItem}
                    contentInset={{
                        top: 0,
                        left: 30,
                        bottom: 0,
                        right: 30,
                    }} />
            </ScrollView>
        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    view: {
        backgroundColor: 'blue',
        width: width - 80,
        margin: 10,
        height: 200,
        borderRadius: 10,
    },
    view2: {
        backgroundColor: 'red',
        width: width - 80,
        margin: 10,
        height: 200,
        borderRadius: 10,
    },
});

