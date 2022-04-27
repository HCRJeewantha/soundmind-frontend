import { Button, StyleSheet, View, Image, Pressable, ScrollView, Text } from 'react-native';
import { RootTabScreenProps } from '../types';
import React, { useState, useEffect, useRef } from "react";
import axios from 'axios'
import YouTube, { YouTubeProps } from 'react-youtube';
import { Camera } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
import { ANGRY, FEAR, HAPPY, NEUTRAL, SAD } from './emotion_imgs';
import { LinearGradient } from 'expo-linear-gradient';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';
import Slider from '@react-native-community/slider';
import { PLAYLIST } from './background_imgs';

const baseUrl = 'http://127.0.0.1:8000';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const ws = new WebSocket('ws://localhost:8000/ws')

  // const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [videoState, setVideoState] = useState(false);
  const [playlist, onPlaylisthRequest] = useState<any>([]);
  const [currentVideoId, setCurrentVideoId] = useState('');
  const [currentVideoNumber, setCurrentVideoNumber] = useState(0);
  const [currentEmotionImage, setCurrentEmotionImage] = useState(HAPPY);
  const [isStressed, setIsStressed] = useState(false);

  const [afterSongName, setAfterSongName] = useState('');
  const [afterSongImg, setAfterSongImg] = useState('');


  const [testData, setTest] = useState([{ name: 0, emotion: 0 }]);


  const [currentEmotion, setCurrentEmotion] = useState(0);
  const [count, setCount] = useState(0);
  const [playerState, setPlayerState] = useState<any>();

  let camera: Camera;
  let timer: any;

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
    switch (JSON.parse(event.data).dominant_emotion) {
      case "angry":
        setCurrentEmotionImage(ANGRY)
        setIsStressed(true)
        setCurrentEmotion(currentEmotion - 1)
        break;

      case "fear":
        setCurrentEmotionImage(FEAR)
        setIsStressed(true)
        setCurrentEmotion(currentEmotion - 1)
        break;

      case "neutral":
        setCurrentEmotionImage(NEUTRAL)
        setIsStressed(false)
        setCurrentEmotion(currentEmotion + 1)
        break;

      case "sad":
        setCurrentEmotionImage(SAD)
        setIsStressed(true)
        setCurrentEmotion(currentEmotion - 1)
        break;

      case "disgust":
        setCurrentEmotionImage(SAD)
        setIsStressed(true)
        setCurrentEmotion(currentEmotion - 1)
        break;

      case "happy":
        setCurrentEmotionImage(HAPPY)
        setIsStressed(false)
        setCurrentEmotion(currentEmotion + 1)
        break;

      case "surprise":
        setCurrentEmotionImage(SAD)
        setIsStressed(false)
        setCurrentEmotion(currentEmotion + 1)
        break;

      default:
        setCurrentEmotionImage(NEUTRAL)
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

  const getCalmSong = async () => {
    // setCurrentVideoId('hso3oR8PJss')

    axios.get(baseUrl + '/get-calm-songs').then((response) => {
      var randomCalmSong = Math.floor(Math.random() * (25 - 0 + 1) + 0)
      var calmSongName = response.data.tracks.track[0].name
      var calmSongArtist = response.data.tracks.track[randomCalmSong].artist.name
      axios.get(baseUrl + '/request-songs/' + calmSongName + ' by' + calmSongArtist).then((response) => {
        setCurrentVideoId(response.data.items[0].id.videoId)
      }).catch((error) => {
        console.log(error)
      });
    }).catch((error) => {
      console.log(error)
    })
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
    <View style={{ flex: 1, flexDirection: 'row', width: '100%', marginBottom: 40 }}>
      <View style={{ width: '25%', height: '80px', padding: 5 }} >
        {/* emoji face */}
        <View style={{ alignItems: 'center', alignContent: 'center', marginTop: 15 }}>
          <ModelView img={currentEmotionImage} />
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
              style={{ marginRight: 5 }}
              name="backward"
              size={15}
              color={'#fff'}
              onPress={() => setPreviousSong()}
            />

          </Pressable>
        </View>

        <View style={{ width: '40%', height: 'auto', padding: 5 }} >
          <Pressable
            style={{
              borderRadius: 100,
              alignItems: 'center',
              justifyContent: 'center',
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
          </Pressable>
        </View>

        <View style={{ width: '30%', height: 'auto', padding: 5 }} >
          <Pressable
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
              onPress={() => setNextSong(true)}
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
          <Text numberOfLines={2} style={{ fontSize: 13, fontWeight: '400', color: '#fff' }}>{afterSongName}</Text>
        </View>

      </View>
    </View>
  )

  const playVideo = async () => {
    playerState.playVideo()
    setVideoState(true)
    getAfterSong()

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
    })
  };

  const setNextSong = async (state: boolean) => {
    if (state) {
      if (currentVideoNumber < playlist.length - 1) {
        var nextNumber = currentVideoNumber + 1
        setCurrentVideoId(playlist[nextNumber].song_id)
        setCurrentVideoNumber(nextNumber)
        setVideoState(false)

      }
    } else {
      getCalmSong()
      setVideoState(false)

    }

  }

  const getAfterSong = async () => {
    if (currentVideoNumber < playlist.length - 1) {
      var nextNumber = currentVideoNumber + 1
      setAfterSongName(playlist[nextNumber].name)
      setAfterSongImg(playlist[nextNumber].song_img)

    }
  }

  const setPreviousSong = async () => {
    if (currentVideoNumber > 0) {
      var nextNumber = currentVideoNumber - 1
      setCurrentVideoId(playlist[nextNumber].song_id)
      setVideoState(false)

    }
  }

  const volumeChange = async (value: any) => {
    playerState.setVolume(value);
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
          onReady={(event) => {
            setPlayerState(event.target)
          }} />

        <LinearGradient
          colors={['#000', '#75dadf']}
          style={styles.background}
        />
        <ChartView testData={testData} />

        <NextSong />
        <Camera style={styles.camera} ref={(r: any) => { camera = r }} type={type}></Camera>
      </ScrollView>
    </React.Fragment>



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

