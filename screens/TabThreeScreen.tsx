import { StyleSheet, TextInput, Text, View, SafeAreaView, Modal, StatusBar, Pressable, FlatList, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import React, { useState, useCallback, useRef, useEffect, Fragment } from "react";
import axios from 'axios'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SUNSET } from "./background_imgs";

const baseUrl = 'http://127.0.0.1:8000';

export default function TabThreeScreen({ navigation }: any) {

    const [text, onChangeText] = useState("Search Songs");
    const [number, onChangeNumber] = useState(null);
    const [searchData, onSearchRequest] = useState(null);

    const [selectedSongName, setSelectedSongName] = useState(null);
    const [selectedSongImg, setSelectedSongImg] = useState(null);
    const [selectedSongId, setSelectedSongId] = useState(null);
    const [modalVisible, setVisibleState] = useState(false);


    const setModalVisible = (visible: any) => {
        setVisibleState(visible)
    }

    const setSelectedValues = async (name: any, song_img: any, song_id: any) => {
        setSelectedSongName(name)
        setSelectedSongImg(song_img)
        setSelectedSongId(song_id)
    }

    const getPlaylist = async () => {
        axios.get(
            baseUrl + '/get-playlist'
        ).then((response) => {
            console.log(response)
            onSearchRequest(response.data)
        }).catch((error) => {
            console.log(error)
        })
    };

    const playPlaylist = async () => {
        navigation.navigate('TabOne')
    };

    const removeFromPlaylist = async () => {
        axios.delete(
            baseUrl + '/remove-song-from-playlist/' + selectedSongId
        ).then((response) => {
            console.log(response)
            setModalVisible(!modalVisible)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            getPlaylist();
        })
    }

    useEffect(() => {
        getPlaylist()
    }, [])

    const ModelView = (props: any) => (
        <View style={{ height: 'auto', width: '90%' }}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >

                <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', height: '100%' }}>
                    <View style={{ position: 'absolute', bottom: '2%', margin: '0%', left: '2%', right: '2%' }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>

                                <View style={{ width: '100%', height: '180px', marginHorizontal: 5, marginVertical: 40 }}>
                                    <Image
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            resizeMode: 'contain',
                                            borderRadius: 10
                                        }}
                                        source={props.img} />
                                </View>
                                <View style={{ width: "96%" }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>{selectedSongName}</Text>
                                </View>
                                <View style={{ marginBottom: 20 }}>
                                    <Text style={{ fontSize: 17 }}>Playlist | My Playlist</Text>
                                </View>
                                <View style={{ marginBottom: 20 }}>
                                    <Pressable
                                        style={{
                                            height: 80, width: 80, borderRadius: 100, backgroundColor: '#2196f3', shadowOpacity: 0.25,
                                            shadowRadius: 30,
                                            shadowOffset: {
                                                height: 0,
                                                width: 0,
                                            },
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        onPress={() => removeFromPlaylist()}
                                    >
                                        <FontAwesome
                                            name="play"
                                            style={{ marginLeft: 10 }}
                                            size={38}
                                            color={'#fff'}
                                        />
                                    </Pressable>
                                </View>
                            </View>
                            <View style={styles.modelActionButtons}>
                                <Pressable
                                    style={{ padding: 15 }}
                                    onPress={() => removeFromPlaylist()}
                                >
                                    <Text style={{ color: '#ff0000', fontSize: 18 }}>Remove From Playlist</Text>
                                </Pressable>
                            </View>
                            <View style={styles.modelActionButtons}>
                                <Pressable
                                    style={{ padding: 15 }}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Text style={{ color: '#000', fontSize: 18 }}>Close</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )

    const renderItem = ({ item, index }: any) => (

        <View style={{ flex: 1, flexDirection: 'row', borderRadius: 2, width: '100%', backgroundColor: '#e390f940' }}>
            <View style={{ width: '10%', height: '80px', padding: 5 }} >
                <Text style={styles.number}>{index + 1}</Text>
            </View>

            <View style={{ width: '30%', height: '80px', margin: 5 }} >
                <Image
                    style={{
                        width: 'auto',
                        height: '100%',
                        resizeMode: 'contain',
                        borderRadius: 10

                    }}
                    source={item.song_img} />
            </View>
            <View style={{ width: '50%', height: '80px', padding: 5 }} >
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.subtitle}>My Album</Text>
            </View>
            <View style={{ width: '10%', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Pressable
                    style={[styles.button, styles.buttonOpen]}
                    onPress={() => setSelectedValues(item.name, item.song_img, item.song_id).then(() => { setModalVisible(true) })}
                >
                    <FontAwesome
                        name="ellipsis-h"
                        size={25}
                        style={{ margin: '5px', padding: '5px', color: '#fff' }}
                    />
                </Pressable>
            </View>
        </View>
    );


    return (

        <SafeAreaView style={styles.container} >

            <View style={{ position: 'absolute', top: 130, left: 10, zIndex: 10 }}>
                <Text style={{ color: '#fff', fontSize: 35, fontWeight: '600' }}>Good Afternoon</Text>
            </View>
            <View>
                <Image
                    style={{
                        width: '100vw',
                        height: '210px',
                        resizeMode: 'contain',
                        // borderRadius: 10
                    }}
                    source={SUNSET} />
            </View>

            <FlatList
                style={{ width: '100%' }}
                data={searchData}
                renderItem={renderItem}
                keyExtractor={item => item}
            />
            <View style={styles.modelContainer}>
                <ModelView img={selectedSongImg} name={selectedSongName} />
            </View>
            <TouchableOpacity
                style={{
                    borderWidth: 1,
                    borderColor: '#2196f3',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 70,
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    height: 70,
                    backgroundColor: '#2196f3',
                    borderRadius: 100,
                    shadowOpacity: 0.25,
                    shadowRadius: 30,
                    shadowOffset: {
                        height: 0,
                        width: 0,
                    },

                }}
                onPress={() => playPlaylist()}
            >
                <FontAwesome
                    color='#fff'
                    name="play"
                    size={25}
                    style={{ marginLeft: '5px' }}
                />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        display: 'flex',
        alignItems: 'center',
        width: '100%'
    },
    modelContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    item: {
        backgroundColor: "#f9c2ff",
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start' // if you want to fill rows left to right
    },
    header: {
        fontSize: 32,
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 15,
        color: '#fff',
        fontWeight: '600',
        marginTop: '5px'
    },
    number: {
        fontSize: 15,
        color: '#fff',
        fontWeight: '600',
        top: '40%',
        position: 'absolute',
        marginLeft: 10
    },
    subtitle: {
        fontSize: 13,
        color: '#fff',
        fontWeight: '400',

    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
        height: 'auto',
        bottom: '0%'
    },
    modalView: {
        // margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        // padding: 35,
        height: 'auto',
        width: '96%',
        alignItems: "center",
        elevation: 5
    },
    button: {
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
        elevation: 2,
    },
    buttonOpen: {
        // backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    modelActionButtons: {
        marginTop: 10, backgroundColor: "white",
        borderRadius: 20,
        height: 'auto',
        width: '96%',
        alignItems: "center",
    }
});
