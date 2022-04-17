import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, TextInput, Text, View, SafeAreaView, Modal, StatusBar, Pressable, FlatList, Image } from "react-native";
import React, { useState, useCallback, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import axios from 'axios'

const baseUrl = 'http://127.0.0.1:8000';

const SelectSongPopup = (props:any, ref:any) => {

    useImperativeHandle(ref, () => ({
        // methods connected to `ref`
        setModalVisible: (visible: boolean) => { console.log(visible) }
      }))

    const [modalVisible, setVisibleState] = useState(false);
    const setModalVisible = (visible: any) => {
        setVisibleState(visible)
    }

    const addToPlayList = async () => {
        const payload = {
            "name": props.selectedSongName,
            "song_img": props.selectedSongImg,
            "song_id": props.electedSongId
        }
        axios.post(
            baseUrl + '/add-songs-to-playlist',
            payload
        ).then((response) => {
            console.log(response)
            setModalVisible(!modalVisible);
        }).catch((error) => {
            console.log(error)
        });
    };

    return (
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
                                        source={props.selectedSongImg} />
                                </View>
                                <View style={{ width: "96%" }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>{props.selectedSongName}</Text>
                                </View>
                                <View style={{ marginBottom: 20 }}>
                                    <Text style={{ fontSize: 17 }}>Playlist | ...</Text>
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
                                        onPress={() => addToPlayList()}
                                    >
                                        <FontAwesome
                                            style={{ marginLeft: 10 }}
                                            name="play"
                                            size={38}
                                            color={'#fff'}
                                        />
                                    </Pressable>
                                </View>
                            </View>
                            <View style={styles.modelActionButtons}>
                                <Pressable
                                    style={{ padding: 15 }}
                                    onPress={() => addToPlayList()}
                                >
                                    <Text style={{ color: '#0001ff', fontSize: 18 }}>Add To Playlist</Text>
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
    );
}

export default React.forwardRef(SelectSongPopup);

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        width: "100%",
        padding: 10,
        borderRadius: 5,

    },
    modelContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 10,
        display: 'flex',
        alignItems: 'center'
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
        height: 'auto',
        bottom: '0%'
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
})