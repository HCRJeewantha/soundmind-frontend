import { Button, StyleSheet, View, Image, Pressable } from 'react-native';
import { RootTabScreenProps } from '../types';
import React, { useState, useEffect } from "react";
import axios from 'axios'
import YouTube, { YouTubeProps } from 'react-youtube';
import { Camera } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
import { ANGRY, FEAR, HAPPY, NEUTRAL, SAD } from './emotion_imgs';
const baseUrl = 'http://127.0.0.1:8000';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const ws = new WebSocket('ws://localhost:8000/ws')

  const [type, setType] = useState(Camera.Constants.Type.back);
  const [videoState, setVideoState] = useState(false);
  const [searchData, onSearchRequest] = useState([]);
  const [currentVideoId, setCurrentVideoId] = useState('');
  const [currentVideoNumber, setCurrentVideoNumber] = useState(0);
  const [currentEmotionImage, setCurrentEmotionImage] = useState(HAPPY);
  const [currentEmotion, setCurrentEmotion] = useState(0);
  const [playerState, setPlayerState] = useState();

  let camera: Camera;
  let timer: any;

  ws.onmessage = function socketConnection(event) {
    console.log(JSON.parse(event.data).dominant_emotion)
    switch (JSON.parse(event.data).dominant_emotion) {
      case "angry": {
        setCurrentEmotionImage(ANGRY)
        setCurrentEmotion(currentEmotion - 1)
        break;
      }
      case "fear": {
        setCurrentEmotionImage(FEAR)
        setCurrentEmotion(currentEmotion - 1)
        break;
      }
      case "neutral": {
        setCurrentEmotionImage(NEUTRAL)
        setCurrentEmotion(currentEmotion + 1)
        break;
      }
      case "sad": {
        setCurrentEmotionImage(SAD)
        setCurrentEmotion(currentEmotion - 1)
        break;
      }
      case "disgust": {
        setCurrentEmotionImage(SAD)
        setCurrentEmotion(currentEmotion - 1)
        break;
      }
      case "happy": {
        setCurrentEmotionImage(HAPPY)
        setCurrentEmotion(currentEmotion + 1)
        break;
      }
      case "surprise": {
        setCurrentEmotionImage(SAD)
        setCurrentEmotion(currentEmotion + 1)
        break;
      }
      default: {
        setCurrentEmotionImage(NEUTRAL)
        // setCurrentEmotion(currentEmotion + 1)
        break;
      }
    }
  }

  const predictEmotionWhitePlayingSong = async (event: any) => {
    if (event.data == 3) {
      setCurrentEmotion(0)
    }
    if (event.data == 0) {
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

      // const payload = {
      //   name: "image",
      //   image: base64result
      // }
      // Create an interval to send echo messages to the server
      // axios.post(
      //   baseUrl + '/predict-emotion-deep-face',
      //   payload
      // ).then((response) => {
      // }).catch((error) => {
      //   console.log(error)
      // })
    }

  };

  const gfg_Run = () => {
    timer = setInterval(snap, 3000);
  }

  const gfg_Stop = () => {
    clearInterval(timer);
  }

  gfg_Run()

  const ModelView = (props: any) => (
    <View>
      <Image
        style={{
          width: '100px',
          height: '100px',
          resizeMode: 'contain',
        }}
        source={props.img} />
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
      onSearchRequest(response.data)
      setCurrentVideoId(response.data[0].song_id)
      sessionStorage.setItem('lastPlayedSongId', response.data[0].song_id)
    }).catch((error) => {
      console.log(error)
    });
  };

  const setNextSong = async (state: boolean) => {
    if (state) {
      if (currentVideoNumber <= searchData.length) {
        setCurrentVideoId(searchData[currentVideoNumber].song_id)
        sessionStorage.setItem('lastPlayedSongId', searchData[currentVideoNumber].song_id)
        var nextNumber = currentVideoNumber + 1
        setCurrentVideoNumber(nextNumber)
      }
    } else {
      getCalmSong()
    }
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
    })();
    sessionStorage.setItem('lastPlayedSongId', "")
    getPlaylist()
  }, []);

  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '100%',
  };

  return (
    <View style={styles.container}>
      <YouTube
        videoId={currentVideoId}
        opts={opts}
        onStateChange={(e) => {
          predictEmotionWhitePlayingSong(e)
          if (e.data == 2) {
            setVideoState(false)
          } else if (e.data == 1) {
            setVideoState(true)
          } else if (e.data == 0) {
            setVideoState(false)
          }
        }}
        onReady={(event) => {
          setPlayerState(event.target)
        }} />

      <View style={{backgroundColor:'#fff'}}>
     
        {currentEmotion}
      </View>
      <View style={{alignItems:'center',alignContent:'center', marginVertical:20}}>
        <ModelView img={currentEmotionImage} />
      </View>

      <View style={{alignItems:'center',alignContent:'center'}}>
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

      <Camera style={styles.camera} ref={(r) => { camera = r }} type={type}></Camera>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

