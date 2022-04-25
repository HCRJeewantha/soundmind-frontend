import { StyleSheet, TextInput, Text, View, SafeAreaView, Modal, StatusBar, Pressable, FlatList, Image } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import React, { useState, useCallback, useRef, useEffect } from "react";
import axios from 'axios'
import customData from './sampleData.json';
import selectSongPopup from '../components/selectSongPopup';
import { LinearGradient } from "expo-linear-gradient";

const baseUrl = 'http://127.0.0.1:8000';

export default function TabTwoScreen() {

  const [text, onChangeText] = useState("Search Songs");
  const [number, onChangeNumber] = useState(null);
  const [searchParam, setSearchParam] = useState('');

  const [searchData, onSearchRequest] = useState(null);

  const [selectedSongName, setSelectedSongName] = useState(null);
  const [selectedSongImg, setSelectedSongImg] = useState(null);
  const [selectedSongId, setSelectedSongId] = useState(null);

  const setSelectedValues = async (name: any, song_img: any, song_id: any) => {
    setSelectedSongName(name)
    setSelectedSongImg(song_img)
    setSelectedSongId(song_id)
  }

  const search = async (param: any) => {
    // onSearchRequest(customData.items)

    axios.get(
      baseUrl + '/request-songs/' + param
    ).then((response) => {
      console.log(response.data.items)
      onSearchRequest(response.data.items)
    }).catch((error) => {
      console.log(error)
    });
  };

  const addToPlayList = async () => {
    const payload = {
      "name": selectedSongName,
      "song_img": selectedSongImg,
      "song_id": selectedSongId
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
            borderRadius: 10
          }}
          source={item.snippet.thumbnails.default.url} />
      </View>
      <View style={{ width: '45%', height: '80px', padding: 5 }} >
        <Text numberOfLines={2} style={styles.title}>{item.snippet.title}</Text>
      </View>
      <View style={{ width: '10%', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setSelectedValues(item.snippet.title, item.snippet.thumbnails.high.url, item.id.videoId).then(() => { setModalVisible(true) })}
        >
          <FontAwesome
            name="ellipsis-h"
            size={25}
            style={{ margin: '5px', color:'#fff' }}
          />
        </Pressable>
      </View>
    </View>
  );

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
  )

  const [modalVisible, setVisibleState] = useState(false);
  const setModalVisible = (visible: any) => {
    setVisibleState(visible)
  }

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={['#000', '#75dadf']}
        style={styles.background}
      />

      <SafeAreaView style={styles.container}>

        <View style={{ flexDirection: 'row', width: '100%' }}>
          <View style={{ width: '80%', height: 'auto' }}>
            <TextInput
              style={styles.input}
              placeholder="Search Songs"
              keyboardType="numeric"
              onChange={(event) => setSearchParam(event.target.value)}
            />
          </View>
          <View style={{ width: '20%', height: 'auto', marginLeft: 5 }}>
            <Pressable
              style={{
                backgroundColor: '#2196f3', height: 40,
                margin: 12,
                width: "70%",
                borderRadius: 5
              }}
              onPress={() => search(searchParam)}
            >
              <FontAwesome
                name="search"
                size={25}
                style={{ margin: 'auto', color: '#fff' }}
              />
            </Pressable>
          </View>
        </View>

        <FlatList
          data={searchData}
          renderItem={renderItem}
        // keyExtractor={item => item}
        />
        <View style={styles.modelContainer}>
          <ModelView img={selectedSongImg} name={selectedSongName} />
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    width: "100%",
    padding: 10,
    borderRadius: 5,
    // color: '#fff',
    backgroundColor:'#fff'

  },
  modelContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    display: 'flex',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    // display: 'flex',
    // alignItems: 'center',
  },
  background: {
    zIndex: -10,
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: '100%',
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
    borderRadius: 20,
    padding: 10,
    elevation: 2
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
