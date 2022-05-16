import { StyleSheet, View, Image, Pressable, ScrollView, Text, Alert, Modal } from 'react-native';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import YouTube, { YouTubeProps } from 'react-youtube';
import { Camera } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
import { ANGRY, FEAR, HAPPY, NEUTRAL, SAD } from './emotion_imgs';
import { LinearGradient } from 'expo-linear-gradient';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import Slider from '@react-native-community/slider';
import Toast from 'react-native-toast-message';
import { NOFOUND } from './background_imgs';

const baseUrl = 'http://127.0.0.1:8000';

let playlist: any = []
let currentVideoId: any
let currentVideoNumber: number = 0
let afterSongName: string;
let afterSongImg: any;
let currentEmotionImage: any = HAPPY
let currentEmotionText: any = 'Happy'
let volume: number = 50
const ws = new WebSocket('ws://localhost:8000/ws');

export function TabFiveScreen({ navigation }: any) {

    const [videoState, setVideoState] = useState(false);
    const [isStressed, setIsStressed] = useState(false);
    const [testData, setTest] = useState([{ name: 0, emotion: 0 }]);
    const [currentEmotion, setCurrentEmotion] = useState(0);
    const [count, setCount] = useState(0);
    const [playerState, setPlayerState] = useState<any>();
    const [modalVisible, setModalVisible] = useState(false);

    const getPlaylist = async () => {
        playlist = []
        currentVideoId = ''
        axios.get(
            baseUrl + '/get-playlist/' + localStorage.getItem('id')
        ).then((response) => {
            playlist = response.data
            currentVideoId = response.data[0].song_id
            getAfterSong()
            console.log(response.data);

        }).catch((error) => {
            if (error.response) {
                showToast("Error", error.response.data.detail, "error")
                if (error.response.status == 404) {
                    setModalVisible(true)
                }
            }
        })
    };

    const getCalmSong = async () => {
        currentVideoId = 'hso3oR8PJss'
        // axios.get(baseUrl + '/get-calm-songs').then((response) => {
        //   var randomCalmSong = Math.floor(Math.random() * (25 - 0 + 1) + 0)
        //   var calmSongName = response.data.tracks.track[0].name
        //   var calmSongArtist = response.data.tracks.track[randomCalmSong].artist.name
        //   axios.get(baseUrl + '/request-songs/' + calmSongName + ' by' + calmSongArtist).then((response) => {
        //     currentVideoId = response.data.items[0].id.videoId
        //   }).catch((error) => {
        //     if (error.response) {
        //       showToast("Error", error.response.data.detail, "error")
        //     }
        //   });
        // }).catch((error) => {
        //   if (error.response) {
        //     showToast("Error", error.response.data.detail, "error")
        //   }
        // })
    }

    useEffect(() => {
        //Turn on camara
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
        })();

        //get playlist
        getPlaylist()
    }, []);

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        // access to player in all event handlers via event.target
        setPlayerState(event.target)
    }

    const opts: YouTubeProps['opts'] = {
        height: '390',
        width: '100%',
    };

    let camera: Camera;
    let timer: any;

    const showToast = (title: any, message: any, type: any) => {
        Toast.show({
            type: type,
            text1: title,
            text2: message
        });
    }

    const createDataTable = (value: any, count: number) => {
        var tempTable = []
        tempTable = testData
        tempTable.push({ name: count, emotion: value })
        setCount(count + 5)
        setTest(tempTable)
    }


    ws.onmessage = function socketConnection(event) {
        createDataTable(currentEmotion, count)
        setCount(count + 1)
        console.log(JSON.parse(event.data));

        switch (JSON.parse(event.data)) {
            case "angry":
                currentEmotionImage = ANGRY
                setIsStressed(true)
                currentEmotionText = 'Angry'
                setCurrentEmotion(currentEmotion - 1)
                break;
            case "fear":
                currentEmotionImage = FEAR
                setIsStressed(true)
                currentEmotionText = 'Fear'
                setCurrentEmotion(currentEmotion - 1)
                break;
            case "neutral":
                currentEmotionImage = NEUTRAL
                setIsStressed(false)
                currentEmotionText = 'Neutral'
                setCurrentEmotion(currentEmotion + 1)
                break;
            case "sad":
                currentEmotionImage = SAD
                setIsStressed(true)
                currentEmotionText = 'Sad'
                setCurrentEmotion(currentEmotion - 1)
                break;
            case "disgust":
                currentEmotionImage = SAD
                setIsStressed(true)
                currentEmotionText = 'Disgust'
                setCurrentEmotion(currentEmotion - 1)
                break;
            case "happy":
                currentEmotionImage = HAPPY
                setIsStressed(false)
                currentEmotionText = 'Happy'
                setCurrentEmotion(currentEmotion + 1)
                break;
            case "surprise":
                currentEmotionImage = HAPPY
                setIsStressed(false)
                currentEmotionText = 'Surprise'
                setCurrentEmotion(currentEmotion + 1)
                break;
            default:
                currentEmotionImage = NEUTRAL
                setIsStressed(false)
                break;
        }
    }

    const predictEmotionWhilePlayingSong = async (event: any) => {
        if (event.data == 3) { //video started
            setCurrentEmotion(0)
            setTest([{ name: 0, emotion: 0 }])
            setCount(0)
        }
        if (event.data == 0) { //video ended
            if (currentEmotion <= 0) {
                setNextSong(false)
            }
            if (currentEmotion > 0) {
                setNextSong(true)
            }
        }
    }



    const snap = async () => {
        //angry, fear, neutral, sad, disgust, happy and surprise
        if (camera) {
            let photo = await camera.takePictureAsync();
            var base64result = photo.uri.substr(photo.uri.indexOf(',') + 1);
            await ws.send(base64result)
        }
    };

    const gfg_Run = () => {
        timer = setInterval(snap, 5000);
    }

    gfg_Run()

    const gfg_Stop = () => {
        clearInterval(timer);
    }

    const playVideo = async () => {
        playerState.playVideo()
        setVideoState(true)
    }

    const pauseVideo = async () => {
        playerState.pauseVideo()
        setVideoState(false)
    }

    const setNextSong = async (state: boolean) => {
        if (state) {
            if (currentVideoNumber < playlist.length - 1) {
                var nextNumber = currentVideoNumber + 1
                currentVideoId = playlist[nextNumber].song_id
                currentVideoNumber = nextNumber
                setVideoState(false)
                getAfterSong()
            }
        } else {
            getCalmSong()
            setVideoState(false)
        }

    }

    const getAfterSong = async () => {
        afterSongName = ''
        afterSongImg = ''
        if (currentVideoNumber < playlist.length - 1) {
            var nextNumber = currentVideoNumber + 1
            afterSongName = playlist[nextNumber].name
            afterSongImg = playlist[nextNumber].song_img
        }
        if (currentVideoNumber == playlist.length - 1) {
            afterSongName = playlist[currentVideoNumber].name
            afterSongImg = playlist[currentVideoNumber].song_img
        }
    }

    const setPreviousSong = async () => {
        if (currentVideoNumber > 0) {
            var nextNumber = currentVideoNumber - 1
            currentVideoNumber = currentVideoNumber - 1
            currentVideoId = playlist[nextNumber].song_id
            setVideoState(false)
            getAfterSong()
        }
    }

    const volumeChange = async (value: any) => {
        volume = value
        playerState.setVolume(volume);
    }

    const EmojiFace = (props: any) => (
        <View>
            <Image
                style={{
                    width: '50px',
                    height: '50px',
                    resizeMode: 'contain',
                }}
                source={props.img} />
        </View>
    )

    const ChartView = (props: any) => (
        <View style={{ flex: 1, flexDirection: 'row', width: '100%', marginBottom: 40 }}>
            <View style={{ width: '25%', height: '80px', padding: 5 }} >
                <View style={{ alignItems: 'center', alignContent: 'center', width: 'auto', height: 25, borderRadius: 5 }}>
                    <Text style={{ color: '#fff' }}>{currentEmotionText}</Text>
                </View>
                {/* emoji face */}
                <View style={{ alignItems: 'center', alignContent: 'center', marginTop: 15 }}>
                    <EmojiFace img={currentEmotionImage} />
                </View>

                {isStressed == false ?
                    <View style={{ backgroundColor: '#0deb72', width: 'auto', height: 25, borderRadius: 5, marginTop: 10 }}>
                        <Text style={{ color: '#fff', margin: 'auto', alignItems: 'center', alignContent: 'center' }}>Stressless</Text>
                    </View>
                    :
                    <View style={{ backgroundColor: '#eb0d0d', width: 'auto', height: 25, borderRadius: 5, marginTop: 10 }}>
                        <Text style={{ color: '#fff', margin: 'auto', alignItems: 'center', alignContent: 'center' }}>Stressfull</Text>
                    </View>
                }
            </View>
            <View style={{ width: '75%', height: '80px', margin: 5 }} >
                <LineChart
                    width={320}
                    height={130}
                    data={props.testData}
                    margin={{
                        top: 10,
                        right: 50,
                        left: -20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis label={{ value: 'time/s', fill: 'white' }} dataKey="name" />
                    <YAxis label={{ value: 'emotion lv.', angle: -90, position: 'outsideRight', fill: 'white' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="emotion" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </View>
        </View>
    )

    const Player = (props: any) => (
        <View style={{ position: 'absolute', width: '100%', bottom: 0, zIndex: 10, backgroundColor: '#000000c2' }}>
            <View style={{ flex: 1, flexDirection: 'row', width: '100%', height: 'auto', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                <View style={{ width: '10%', height: 'auto', padding: 5, justifyContent: 'center', alignItems: 'center' }} >
                    <FontAwesome
                        style={{ marginRight: 5 }}
                        name="volume-down"
                        size={15}
                        color={'#fff'}
                    />
                </View>
                <View style={{ width: '70%', height: 'auto', padding: 5, justifyContent: 'center', alignItems: 'center' }} >
                    <Slider
                        onValueChange={(e) => volumeChange(e)}
                        style={{ width: '100%', height: 20 }}
                        value={50}
                        minimumValue={0}
                        maximumValue={100}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                    />
                </View>
                <View style={{ width: '10%', height: 'auto', padding: 5, justifyContent: 'center', alignItems: 'center' }} >
                    <FontAwesome
                        style={{ marginRight: 5 }}
                        name="volume-up"
                        size={15}
                        color={'#fff'}
                    />
                </View>
            </View>
            {/* Play pause button */}
            <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                <View style={{ width: '30%', height: 'auto', padding: 5 }} >
                    <Pressable
                        style={{
                            borderRadius: 100,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <FontAwesome
                            testID='previousBtn'
                            style={{ marginRight: 5 }}
                            name="backward"
                            size={15}
                            color={'#fff'}
                            onPress={() => setPreviousSong()}
                        />
                    </Pressable>
                </View>
                <View style={{ width: '40%', height: 'auto', padding: 5 }} >

                    {videoState == false ?
                        <Pressable
                            testID='playButton'
                            onPress={() => playVideo()}
                            style={{
                                borderRadius: 100,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <FontAwesome
                                style={{ marginLeft: 10 }}
                                name="play"
                                size={38}
                                color={'#fff'}
                            />
                        </Pressable> :
                        <Pressable
                            onPress={() => pauseVideo()}
                            style={{
                                borderRadius: 100,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <FontAwesome
                                name="pause"
                                size={33}
                                color={'#fff'}
                            />
                        </Pressable>
                    }

                </View>
                <View style={{ width: '30%', height: 'auto', padding: 5 }} >
                    <Pressable
                        testID='nextBtn'
                        onPress={() => setNextSong(true)}
                        style={{
                            borderRadius: 100,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <FontAwesome
                            style={{ marginLeft: 5 }}
                            name="forward"
                            size={15}
                            color={'#fff'}
                        />
                    </Pressable>
                </View>
            </View>
        </View>
    )

    const NextSong = (props: any) => (
        <View style={{ width: '100%', height: 'auto', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none', marginVertical: 10 }}>
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#00000052', width: '95%', borderRadius: 10 }}>
                <View style={{ width: '30%', height: 'auto', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: 'none' }} >
                    <View style={{ height: 85, width: 90, alignContent: 'center', alignItems: 'center', backgroundColor: 'none' }}>
                        <Image
                            style={{
                                borderTopLeftRadius: 10,
                                borderBottomLeftRadius: 10,
                                width: '100%',
                                height: '100%',
                                resizeMode: 'stretch'
                            }}
                            source={afterSongImg} />
                    </View>
                </View>
                <View style={{ width: '70%', height: 'auto', alignItems: 'flex-start', backgroundColor: 'none', paddingTop: 2 }} >
                    <Text style={{ fontSize: 20, fontWeight: '600', color: '#fff' }}>Comming up next</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#fff', paddingBottom: 5 }}>From Playlist</Text>
                    <Text testID='afterSongName' numberOfLines={2} style={{ fontSize: 13, fontWeight: '400', color: '#fff' }}>{afterSongName}</Text>
                </View>
            </View>
        </View>
    )

    return (
        <React.Fragment>
            <Player></Player>
            <ScrollView style={styles.container}>
                {/* Youtube Player */}
                <YouTube
                    videoId={currentVideoId}
                    opts={opts}
                    onStateChange={(e) => {
                        predictEmotionWhilePlayingSong(e)
                        if (e.data == 2) {// pause video state
                            setVideoState(false)
                        } else if (e.data == 1) { //start video state
                            setVideoState(true)
                        } else if (e.data == 0) { //end video state
                            setVideoState(false)
                        }
                    }}
                    onReady={onPlayerReady}
                />
                <LinearGradient
                    colors={['#000', '#75dadf']}
                    style={styles.background}
                />
                <ChartView testData={testData} />
                <NextSong />
                <Camera style={styles.camera} ref={(r: any) => { camera = r }} ></Camera>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Image
                            style={{
                                width: '150px',
                                height: '150px',
                                resizeMode: 'contain',
                            }}
                            source={NOFOUND} />
                        <Text style={styles.modalText}>No songs found in your playlist. Please add songs to playlist to continue!</Text>
                        <Pressable
                            style={[styles.buttonModel, styles.buttonClose]}
                            onPress={() => {
                                navigation.navigate('TabTwo')
                                setModalVisible(!modalVisible)
                            }}
                        >
                            <Text style={styles.textStyle}>Search Songs</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>


        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    buttonModel: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
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
    container: {
        flex: 1,
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
    background: {
        zIndex: -10,
        position: 'absolute',
        left: 0,
        right: 0,
        top: '60%',
        height: '100%',
    },
    camera: {
        position: 'absolute',
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
});
