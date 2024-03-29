import { StyleSheet, Text, View, SafeAreaView, Modal, StatusBar, Pressable, FlatList, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import React, { useState, useEffect } from "react";
import axios from 'axios'
import { NOFOUND, SUNSET } from "./background_imgs";
import { MORNING } from "./background_imgs";
import { AFTERNOON } from "./background_imgs";
import { LinearGradient } from "expo-linear-gradient";
import Toast from 'react-native-toast-message';

const baseUrl = 'http://127.0.0.1:8000';
let selectedSongName: any;
let selectedSongImg: any;
let selectedSongId: any;
export function TabThreeScreen({ navigation }: any) {

    const [searchData, onSearchRequest] = useState(null);
    const [modalVisible, setVisibleState] = useState(false);
    const [greeting, setGreeting] = useState('');
    const [greetingImage, setGreetingImage] = useState(SUNSET);
    const [notFound, setNotfoundVisible] = useState(false);

    const showToast = (title: any, message: any, type: any) => {
        Toast.show({
            type: type,
            text1: title,
            text2: message
        });
    }

    const setModalVisible = (visible: any) => {
        setVisibleState(visible)
    }

    const setSelectedValues = async (name: any, song_img: any, song_id: any) => {
        selectedSongName = name
        selectedSongImg = song_img
        selectedSongId = song_id
    }

    const getPlaylist = async () => {
        axios.get(
            baseUrl + '/get-playlist/' + localStorage.getItem('id')
        ).then((response) => {
            console.log(response)
            onSearchRequest(response.data)
        }).catch((error) => {
            if (error.response) {
                showToast("Error", error.response.data.detail, "error")
                if (error.response.status == 404) {
                    setNotfoundVisible(true)
                }
            }
        })
    };

    const playPlaylist = async (songId: any) => {
        navigation.navigate('TabOne')
    };

    const removeFromPlaylist = async () => {
        axios.delete(
            baseUrl + '/remove-song-from-playlist/' + selectedSongId + '/' + localStorage.getItem('id')
        ).then((response) => {
            setModalVisible(!modalVisible)
        }).catch((error) => {
            if (error.response) {
                showToast("Error", error.response.data.detail, "error")
            }
        }).finally(() => {
            getPlaylist();
        })
    }

    useEffect(() => {
        //Greeting
        var currentTime = new Date();
        if (currentTime.getHours() < 12) {
            setGreeting("Good Morning")
            setGreetingImage(MORNING)
        }
        else if (currentTime.getHours() < 17) {
            setGreeting("Good Afternoon")
            setGreetingImage(AFTERNOON)
        }
        else {
            setGreeting("Good Evening")
            setGreetingImage(SUNSET)
        }

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
                                <TouchableOpacity
                                    style={{
                                        marginVertical: 20,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    onPress={() => playPlaylist(props.songId)}
                                >
                                    <LinearGradient
                                        colors={['#fb00ffeb', '#26ced7f2']}
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 70,
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
                                    >
                                        <FontAwesome
                                            color='#fff'
                                            name="play"
                                            size={25}
                                            style={{ marginLeft: '5px' }}
                                        />
                                    </LinearGradient>
                                </TouchableOpacity>
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
        <View style={{ flex: 1, flexDirection: 'row', borderRadius: 2, width: '100%', backgroundColor: '#b400ff33' }}>
            <View style={{ width: '10%', height: '80px', padding: 5 }} >
                <Text style={styles.number}>{index + 1}</Text>
            </View>
            <View style={{ width: '30%', height: '80px', margin: 5 }} >
                <Image
                    style={{
                        width: 'auto',
                        height: '100%',
                        resizeMode: 'contain',
                        borderRadius: 10,
                    }}
                    source={item.song_img} />
            </View>
            <View style={{ width: '50%', height: '80px', padding: 5 }} >
                <Text numberOfLines={2} style={styles.title}>{item.name}</Text>
                <Text style={styles.subtitle}>My Album</Text>
            </View>
            <View style={{ width: '10%', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Pressable
                    testID={item.song_id}
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
        <View style={styles.mainContainer}>
            <LinearGradient
                colors={['#000', '#75dadf']}
                style={styles.background}
            />
            <SafeAreaView style={styles.container} >
                <View style={{ position: 'absolute', top: 80, left: 10, zIndex: 10 }}>
                    <Text style={{ color: '#fff', fontSize: 30, fontWeight: '600' }}>{greeting} {localStorage.getItem('name')}</Text>
                </View>
                <View style={{ position: 'absolute', top: 130, left: 10, zIndex: 10 }}>
                    <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
                        You’re well on your way to living a
                        happier life, Soundminder.
                    </Text>
                </View>
                <View>
                    <Image
                        blurRadius={2}
                        style={{
                            width: '100vw',
                            height: '210px',
                            resizeMode: 'contain',
                        }}
                        source={greetingImage} />
                </View>
                <FlatList
                    style={{ width: '100%' }}
                    data={searchData}
                    renderItem={renderItem}
                // keyExtractor={item => item}
                />
                <View style={styles.modelContainer}>
                    <ModelView img={selectedSongImg} name={selectedSongName} songId={selectedSongId} />
                </View>
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom: 20,
                        right: 20
                    }}
                >
                    <LinearGradient
                        colors={['#fb00ffeb', '#26ced7f2']}
                        style={{
                            borderWidth: 1,
                            borderColor: '#2196f3',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 70,
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
                    >
                        <FontAwesome
                            color='#fff'
                            name="play"
                            size={25}
                            style={{ marginLeft: '5px' }}
                        />
                    </LinearGradient>
                </TouchableOpacity>
            </SafeAreaView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={notFound}
                onRequestClose={() => {
                    setNotfoundVisible(!notFound);
                }}
            >
                <View style={styles.centeredViewNotFound}>
                    <View style={styles.modalViewNotFound}>
                        <Image
                            style={{
                                width: '150px',
                                height: '150px',
                                resizeMode: 'contain',
                            }}
                            source={NOFOUND} />
                        <Text style={styles.modalTextNotFound}>No songs found in your playlist. Please add songs to playlist to continue!</Text>
                        <Pressable
                            style={[styles.buttonModelNotFound, styles.buttonCloseNotFound]}
                            onPress={() => {
                                navigation.navigate('TabTwo')
                                setNotfoundVisible(!notFound)
                            }}
                        >
                            <Text style={styles.textStyleNotFound}>Search Songs</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonModel: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        display: 'flex',
        alignItems: 'center',
        width: '100%'
    },
    mainContainer: {
        flex: 1,
    },
    background: {
        zIndex: -10,
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        height: '100%',
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
        alignItems: 'flex-start'
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
    },



    buttonCloseNotFound: {
        backgroundColor: "#2196F3",
    },
    centeredViewNotFound: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalViewNotFound: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textStyleNotFound: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalTextNotFound: {
        marginBottom: 15,
        textAlign: "center"
    },
    buttonModelNotFound: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
});
