import { Button, StyleSheet, View, Image, Pressable } from 'react-native';
import { RootTabScreenProps } from '../types';
import React, { useState, useEffect, useRef } from "react";
import axios from 'axios'
import YouTube, { YouTubeProps } from 'react-youtube';
import { Camera } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
import { ANGRY, FEAR, HAPPY, NEUTRAL, SAD } from './emotion_imgs';
import { LinearGradient } from 'expo-linear-gradient';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';

const baseUrl = 'http://127.0.0.1:8000';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const ws = new WebSocket('ws://localhost:8000/ws')

  // const [camera, setCamera] = useState(null);

  const [type, setType] = useState(Camera.Constants.Type.back);
  const [videoState, setVideoState] = useState(false);
  const [playlist, onPlaylisthRequest] = useState([]);
  const [currentVideoId, setCurrentVideoId] = useState('');
  const [currentVideoNumber, setCurrentVideoNumber] = useState(0);
  const [currentEmotionImage, setCurrentEmotionImage] = useState(HAPPY);
  const [currentEmotionText, setCurrentEmotionText] = useState('Happy');
  const [testData, setTest] = useState([{ name: 0, emotion: 0 }]);

  const [currentEmotion, setCurrentEmotion] = useState(0);
  const [count, setCount] = useState(0);
  const [playerState, setPlayerState] = useState();

  let camera: Camera;
  let timer: any;

  const createDataTable = (value: any, count: number) => {
    var tempTable = []
    tempTable = testData

    tempTable.push({ name: count, emotion: value })
    setCount(count + 1)
    setTest(tempTable)

  }

  ws.onmessage = function socketConnection(event) {
    createDataTable(currentEmotion, count)
    setCount(count + 1)
    switch (JSON.parse(event.data).dominant_emotion) {
      case "angry":
        setCurrentEmotionImage(ANGRY)
        setCurrentEmotionText('Angry')
        setCurrentEmotion(currentEmotion - 1)
        break;

      case "fear":
        setCurrentEmotionImage(FEAR)
        setCurrentEmotionText('Fear')
        setCurrentEmotion(currentEmotion - 1)
        break;

      case "neutral":
        setCurrentEmotionImage(NEUTRAL)
        setCurrentEmotionText('Neutral')
        setCurrentEmotion(currentEmotion + 1)
        break;

      case "sad":
        setCurrentEmotionImage(SAD)
        setCurrentEmotionText('Sad')
        setCurrentEmotion(currentEmotion - 1)
        break;

      case "disgust":
        setCurrentEmotionImage(SAD)
        setCurrentEmotionText('Disgust')
        setCurrentEmotion(currentEmotion - 1)
        break;

      case "happy":
        setCurrentEmotionImage(HAPPY)
        setCurrentEmotionText('Happy')
        setCurrentEmotion(currentEmotion + 1)
        break;

      case "surprise":
        setCurrentEmotionImage(SAD)
        setCurrentEmotionText('Suprise')
        setCurrentEmotion(currentEmotion + 1)
        break;

      default:
        setCurrentEmotionImage(NEUTRAL)
        setCurrentEmotionText('Neutral')
        // setCurrentEmotion(currentEmotion + 1)
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

  const getCalmSong = async () => {
    setCurrentVideoId('hso3oR8PJss')

    // axios.get(
    //   baseUrl + '/get-calm-songs'
    // ).then((response) => {
    //   var randomCalmSong = Math.floor(Math.random() * (25 - 0 + 1) + 0)
    //   var calmSongName = response.data.tracks.track[0].name
    //   var calmSongArtist = response.data.tracks.track[randomCalmSong].artist.name
    //   console.log(calmSongName)
    //   axios.get(
    //     baseUrl + '/request-songs/' + calmSongName + ' by' + calmSongArtist
    //   ).then((response) => {
    //     setCurrentVideoId(response.data.items[0].id.videoId)
    //     console.log(response.data)

    //   }).catch((error) => {
    //     console.log(error)
    //   });
    // }).catch((error) => {
    //   console.log(error)
    // })
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
    timer = setInterval(snap, 10000);
  }

  gfg_Run()

  const gfg_Stop = () => {
    clearInterval(timer);
  }


  const ModelView = (props: any) => (
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
    <View style={{ flex: 1, flexDirection: 'row', width: '100%' }}>
      <View style={{ width: '20%', height: '80px', padding: 5 }} >
        {/* emoji face */}
        <View style={{ alignItems: 'center', alignContent: 'center', marginTop: 15 }}>
          <ModelView img={currentEmotionImage} />
        </View>
      </View>
      <View style={{ width: '80%', height: '80px', margin: 5 }} >
        <LineChart
          width={330}
          height={130}
          data={props.testData}
          margin={{
            top: 10,
            right: 50,
            left: -60,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="emotion" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </View>
    </View>

  )

  const playVideo = async () => {
    playerState.playVideo()
    setVideoState(true)
  }

  const pauseVideo = async () => {
    playerState.pauseVideo()
    setVideoState(false)
  }



  const getPlaylist = async () => {
    axios.get(
      baseUrl + '/get-playlist'
    ).then((response) => {
      onPlaylisthRequest(response.data)
      setCurrentVideoId(response.data[0].song_id)
    }).catch((error) => {
      console.log(error)
    });
  };

  const setNextSong = async (state: boolean) => {
    if (state) {
      if (currentVideoNumber <= playlist.length) {
        var nextNumber = currentVideoNumber + 1
        setCurrentVideoId(playlist[nextNumber].song_id)
        setCurrentVideoNumber(nextNumber)
      }
    } else {
      getCalmSong()
    }
  }

  useEffect(() => {
    //Turn on camara
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
    })();

    //get playlist
    getPlaylist()
  }, []);


  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '100%',
  };

  return (
    <View style={styles.container}>

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
        onReady={(event) => {
          setPlayerState(event.target)
        }} />

      <LinearGradient
        colors={['#000', '#75dadf']}
        style={styles.background}
      />

      {/* Emotion state */}
      {/* <View style={{ backgroundColor: '#fff' }}>
        {currentEmotion}
      </View> */}

      <ChartView testData={testData} />

      {/* Play pause button */}
      <View style={{ alignItems: 'center', alignContent: 'center', marginVertical: 20 }}>
        <Pressable
          style={{
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LinearGradient
            colors={['#fb00ffeb', '#26ced7f2']}
            style={{
              borderWidth: 1,
              borderColor: '#2196f3',
              alignItems: 'center',
              justifyContent: 'center',
              width: 90,
              height: 90,
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
            {videoState == false ?
              <FontAwesome
                style={{ marginLeft: 10 }}
                name="play"
                size={38}
                color={'#fff'}
                onPress={() => playVideo()}
              /> :
              <FontAwesome
                name="pause"
                size={33}
                color={'#fff'}
                onPress={() => pauseVideo()}
              />
            }
          </LinearGradient>
        </Pressable>
      </View>

      <Camera style={styles.camera} ref={(r: any) => { camera = r }} type={type}></Camera>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    // width:'10',
    // height:'10'
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

