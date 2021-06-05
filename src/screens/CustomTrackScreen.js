import React, { useContext, useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, Image, Button, TouchableOpacity, TextInput, Switch,
  KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard
} from 'react-native'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps"
import Spacer from '../components/Spacer'
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import useSaveTracks from '../hooks/useSaveTracks';
import { Context as LocationContext } from '../context/LocationContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ImgToBase64 from 'react-native-image-base64';
import { fileToBase64, fileToBase64Helper } from '../helper/convertToURI';
import { reverseGeocodeAsync } from 'expo-location';

const CustomTrackScreen = ({ route, navigation }) => {
  const { isRecording, locations, currentLocation,
    averageSpeed, totalDistanceTravelled, markedLocations,
    markedLocationsAddresses, timeHour, timeMinute, timeSecond } = route.params
  const { state: { name }, updateTrackName, updateExtraInfo } = useContext(LocationContext)

  const initialLocation = locations[0].coords
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [trackType, setTrackType] = useState("Long Run")
  const [sportType, setSportType] = useState("Run")
  const [description, setDescription] = useState("")
  const [isEnabled, setIsEnabled] = useState(false);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false)
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const [curAddress, setCurAddress] = useState(null)

  let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dw2wkqyh5/upload'

  useEffect(() => {
    const getReverseAddress = async () => {
        const res = await reverseGeocodeAsync(initialLocation)
        setCurAddress(res[0])
    }
    getReverseAddress()
  }, [])

  useEffect(() => {
    updateExtraInfo(trackType, sportType, description, isEnabled, image, curAddress)
  }, [trackType, sportType, description, isEnabled, image, curAddress])

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    return () => {
      keyboardDidShowListener.remove();
    };
    }, [isKeyboardVisible])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
      base64: true
    });

    if (result.cancelled) {
      return
    }

    let base64Img = `data:image/jpg;base64,${result.base64}`;
    let data = {
      "file": base64Img,
      "upload_preset": "iqtz1hm2",
    }
    setLoading(true)
    fetch(CLOUDINARY_URL, {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
    }).then(async r => {
      let data = await r.json()
      setImage(data.url);
      setLoading(false)
    }).catch(err => console.log(err))
  };

  const handleFinishSave = () => {
    if (name) {
      navigation.navigate("TrackCreate")
      saveTrack()
      setImage("")
    }
    else {
      alert("Please enter the name of the track")
    }
  }
  const [saveTrack] = useSaveTracks()
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  }

  const toggleModal2 = () => {
    setModalVisible2(!isModalVisible2)
  }

  return (
    <>
    {Platform.OS === "ios" ? (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <MapView
        style={styles.map}
        initialRegion={{
          ...initialLocation,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        // region={{
        //   ...initialLocation,
        //   latitudeDelta: 0.005,
        //   longitudeDelta: 0.005,
        // }}
      >
        <Polyline
          coordinates={locations.map(t => t.coords)}
          strokeWidth={5}
          strokeColor="rgb(255, 111, 97)"
          fillColor="rgb(255, 111, 97)"
        />

        {markedLocations && markedLocations.map((location, key) => (
          <Marker
            coordinate={{
              ...location.coords
            }}
            title="This place's address is"
            description={markedLocationsAddresses[key]}
            key={key}
          >
            <Image source={{uri: "https://smarttrain.edu.vn/assets/uploads/2017/10/678111-map-marker-512.png"}}
              style={{ width: 40, height: 40 }}
              resizeMode="center"
              resizeMethod="resize"
            />
          </Marker>
        ))}
      </MapView>

      <View style={{ flex: 1, height: "50%", width: "100%", display: "flex", flexDirection: "column" }}>
        <View style={{ height: "7%", justifyContent: "center", backgroundColor: "rgb(250, 128, 114)" }}>
          <Text style={{ marginLeft: 12, color: "white" }}>
            Track Information
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.left}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>AVG SPEED (KM/H)</Text>
            </View>
            <View style={styles.numberContainer}>
              <Text style={styles.numberStyle}>{Math.abs(Math.round(averageSpeed * 10) / 10)}</Text>
            </View>
          </View>

          <View style={styles.middle}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>DISTANCE (KM)</Text>
            </View>
            <View style={styles.numberContainer}>
              <Text style={styles.numberStyle}>{Math.round(totalDistanceTravelled * 100) / 100}</Text>
            </View>
          </View>

          <View style={styles.right}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>TIME</Text>
            </View>
            <View style={styles.numberContainerRight}>
              <Text style={styles.numberStyle}>{timeHour} : {timeMinute} : {timeSecond}</Text>
            </View>
          </View>
        </View>

        <View style={styles.nameType}>
          <View style={styles.name}>
            <View style={styles.start}>
              <Text style={styles.textStyle}>Name</Text>
            </View>

            <View style={styles.input}>
              <TextInput
                onChangeText={updateTrackName}
                value={name}
                placeholder="Title your track"
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="off"
              />
            </View>
          </View>
          <View style={styles.type}>
            <View style={styles.start}>
              <Text style={styles.textStyle}>Type</Text>
            </View>

            <TouchableOpacity onPress={() => toggleModal()} style={styles.input}>
              <Text>{trackType}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sport}>
            <View style={styles.start}>
              <Text style={styles.textStyle}>Sport</Text>
            </View>

            <TouchableOpacity onPress={() => toggleModal2()} style={styles.input}>
              <Text>{sportType}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.description}>
            <View style={styles.startDescription}>
              <Text style={styles.textStyle}>Description</Text>
            </View>

            <View style={styles.inputDescription}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={{ flex: 1 }}>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => setDescription(text)}
                    value={description}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoCompleteType="off"
                    keyboardType="default"
                    returnKeyType="done"
                    multiline={true}
                    blurOnSubmit={true}
                    onSubmitEditing={() => { Keyboard.dismiss()}}
                    placeholder="How did the trip go ? How do you feel ? How much did you rest ? "
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>

          <TouchableOpacity onPress={pickImage} style={{ justifyContent: "center" }}>
            <View style={styles.commute}>
              <View style={styles.iconContainer}>
                <Ionicons name="image-outline" size={45} color="black" />
              </View>
              <View style={styles.imageContainer}>
                {image ? <Image source={{ uri: image }} style={{ width: 80, height: 80, marginLeft: 20 }} />
                  : (loading ? (
                    <Text style={{ color: "#b3b3b3", fontSize: 16, marginLeft: 20 }}>Loading your image</Text>) : (
                      <Text style={{ color: "#b3b3b3", fontSize: 16, marginLeft: 20 }}>Add a photo of your track</Text>
                    ))}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{
            height: "15%", width: "100%",
            display: "flex", justifyContent: "center", alignItems: "center",
            backgroundColor: "rgb(255, 111, 97)"
          }} onPress={handleFinishSave}>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>FINISH</Text>
          </TouchableOpacity>
        </View>


        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}
          style={{
            display: "flex", justifyContent: "center",
            alignItems: "center"
          }}>
          <View style={{
            display: "flex", justifyContent: "center", flexDirection: "column",
            alignItems: "center", backgroundColor: "white", width: "80%", height: "30%"
          }}>
            <View style={{
              height: "20%", width: "100%", justifyContent: "center", display: 'flex', backgroundColor: "rgba(230, 225, 225, 0.6)",
              alignItems: "center", borderBottomWidth: 0.3, borderColor: "rgba(140, 140, 140, 0.5)"
            }}>
              <Text style={{ fontSize: 20 }}>Type</Text>
            </View>
            <Picker
              selectedValue={trackType}
              style={{ height: "80%", width: "100%" }}
              onValueChange={(itemValue, itemIndex) => setTrackType(itemValue)}
            >
              <Picker.Item label="Long Run" value="Long Run" />
              <Picker.Item label="Workout" value="Workout" />
              <Picker.Item label="Race" value="Race" />
              <Picker.Item label="Commute" value="Commute" />
            </Picker>
          </View>
        </Modal>

        <Modal
          isVisible={isModalVisible2}
          onBackdropPress={() => setModalVisible2(false)}
          style={{
            display: "flex", justifyContent: "center",
            alignItems: "center"
          }}>
          <View style={{
            display: "flex", justifyContent: "center", flexDirection: "column",
            alignItems: "center", backgroundColor: "white", width: "80%", height: "30%"
          }}>
            <View style={{
              height: "20%", width: "100%", justifyContent: "center", display: 'flex', backgroundColor: "rgba(230, 225, 225, 0.6)",
              alignItems: "center", borderBottomWidth: 0.3, borderColor: "rgba(140, 140, 140, 0.5)"
            }}>
              <Text style={{ fontSize: 20 }}>Type</Text>
            </View>
            <Picker
              selectedValue={sportType}
              style={{ height: "80%", width: "100%" }}
              onValueChange={(itemValue, itemIndex) => setSportType(itemValue)}
            >
              <Picker.Item label="Yoga" value="Yoga" />
              <Picker.Item label="Swim" value="Swim" />
              <Picker.Item label="Walk" value="Walk" />
              <Picker.Item label="Ride" value="Ride" />
              <Picker.Item label="Run" value="Run" />
              <Picker.Item label="Climb" value="Climb" />
              <Picker.Item label="Hike" value="Hike" />
              <Picker.Item label="Jog" value="Jog" />

            </Picker>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView >
    ): 
    //ANDROID ///////////////////////////////////////////
    (
      <KeyboardAvoidingView keyboardVerticalOffset={-1000} style={{ flex: 1 }}>
      <MapView
        style={isKeyboardVisible ? styles.androidMap : styles.map}
        initialRegion={{
          ...initialLocation,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        region={{
          ...initialLocation,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Polyline
          coordinates={locations.map(t => t.coords)}
          strokeWidth={5}
          strokeColor="rgb(255, 111, 97)"
          fillColor="rgb(255, 111, 97)"
        />

        {markedLocations && markedLocations.map((location, key) => (
          <Marker
            coordinate={{
              ...location.coords
            }}
            title="This place's address is"
            description={markedLocationsAddresses[key]}
            key={key}
          >
            <Image source={{uri: "https://smarttrain.edu.vn/assets/uploads/2017/10/678111-map-marker-512.png"}}
              style={{ width: 40, height: 40 }}
              resizeMode="center"
              resizeMethod="resize"
            />
          </Marker>
        ))}
      </MapView>

      <View style={{ flex: 1, height: "50%", width: "100%", display: "flex", flexDirection: "column" }}>
        <View style={{ height: "7%", justifyContent: "center", backgroundColor: "rgb(250, 128, 114)" }}>
          <Text style={{ marginLeft: 12, color: "white" }}>
            Track Information
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.left}>
            <View style={styles.headerContainer}>
              <Text style={styles.androidHeaderText}>AVG SPEED (KM/H)</Text>
            </View>
            <View style={styles.numberContainer}>
              <Text style={styles.numberStyle}>{Math.abs(Math.round(averageSpeed * 10) / 10)}</Text>
            </View>
          </View>

          <View style={styles.middle}>
            <View style={styles.headerContainer}>
              <Text style={styles.androidHeaderText}>DISTANCE (KM)</Text>
            </View>
            <View style={styles.numberContainer}>
              <Text style={styles.numberStyle}>{Math.round(totalDistanceTravelled * 100) / 100}</Text>
            </View>
          </View>

          <View style={styles.right}>
            <View style={styles.headerContainer}>
              <Text style={styles.androidHeaderText}>TIME</Text>
            </View>
            <View style={styles.numberContainerRight}>
              <Text style={styles.numberStyle}>{timeHour} : {timeMinute} : {timeSecond}</Text>
            </View>
          </View>
        </View>

        <View style={styles.nameType}>
          <View style={styles.name}>
            <View style={styles.start}>
              <Text style={styles.textStyle}>Name</Text>
            </View>

            <View style={styles.input}>
              <TextInput
                onChangeText={updateTrackName}
                value={name}
                placeholder="Title your track"
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="off"
                onSubmitEditing={() => { Keyboard.dismiss(); setKeyboardVisible(false)  }}
              />
            </View>
          </View>
          <View style={styles.type}>
            <View style={styles.start}>
              <Text style={styles.textStyle}>Type</Text>
            </View>

            <TouchableOpacity onPress={() => toggleModal()} style={styles.input}>
              <Text>{trackType}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sport}>
            <View style={styles.start}>
              <Text style={styles.textStyle}>Sport</Text>
            </View>

            <TouchableOpacity onPress={() => toggleModal2()} style={styles.input}>
              <Text>{sportType}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.description}>
            <View style={styles.androidStartDescription}>
              <Text style={styles.textStyle}>Description</Text>
            </View>

            <View style={styles.inputDescription}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={{ flex: 1 }}>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => setDescription(text)}
                    value={description}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoCompleteType="off"
                    keyboardType="default"
                    returnKeyType="done"
                    multiline={true}
                    blurOnSubmit={true}
                    onSubmitEditing={() => { Keyboard.dismiss(); setKeyboardVisible(false)  }}
                    placeholder="How did the trip go ? How do you feel ? How much did you rest ? "
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>

          <TouchableOpacity onPress={pickImage} style={{ justifyContent: "center" }}>
            <View style={styles.commute}>
              <View style={styles.iconContainer}>
                <Ionicons name="image-outline" size={45} color="black" />
              </View>
              <View style={styles.imageContainer}>
                {image ? <Image source={{ uri: image }} style={{ width: 80, height: 80, marginLeft: 20 }} />
                  : (loading ? (
                    <Text style={{ color: "#b3b3b3", fontSize: 16, marginLeft: 20 }}>Loading your image</Text>) : (
                      <Text style={{ color: "#b3b3b3", fontSize: 16, marginLeft: 20 }}>Add a photo of your track</Text>
                    ))}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{
            height: "15%", width: "100%",
            display: "flex", justifyContent: "center", alignItems: "center",
            backgroundColor: "rgb(255, 111, 97)"
          }} onPress={handleFinishSave}>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>FINISH</Text>
          </TouchableOpacity>
        </View>


        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}
          style={{
            display: "flex", justifyContent: "center",
            alignItems: "center"
          }}>
          <View style={{
            display: "flex", justifyContent: "center", flexDirection: "column",
            alignItems: "center", backgroundColor: "white", width: "80%", height: "30%"
          }}>
            <View style={{
              height: "20%", width: "100%", justifyContent: "center", display: 'flex', backgroundColor: "rgba(230, 225, 225, 0.6)",
              alignItems: "center", borderBottomWidth: 0.3, borderColor: "rgba(140, 140, 140, 0.5)"
            }}>
              <Text style={{ fontSize: 20 }}>Type</Text>
            </View>
            <Picker
              selectedValue={trackType}
              style={{ height: "80%", width: "100%" }}
              onValueChange={(itemValue, itemIndex) => setTrackType(itemValue)}
            >
              <Picker.Item label="Long Run" value="Long Run" />
              <Picker.Item label="Workout" value="Workout" />
              <Picker.Item label="Race" value="Race" />
              <Picker.Item label="Commute" value="Commute" />
              <Picker.Item label="Jogging" value="Jogging" />

            </Picker>
          </View>
        </Modal>

        <Modal
          isVisible={isModalVisible2}
          onBackdropPress={() => setModalVisible2(false)}
          style={{
            display: "flex", justifyContent: "center",
            alignItems: "center"
          }}>
          <View style={{
            display: "flex", justifyContent: "center", flexDirection: "column",
            alignItems: "center", backgroundColor: "white", width: "80%", height: "30%"
          }}>
            <View style={{
              height: "20%", width: "100%", justifyContent: "center", display: 'flex', backgroundColor: "rgba(230, 225, 225, 0.6)",
              alignItems: "center", borderBottomWidth: 0.3, borderColor: "rgba(140, 140, 140, 0.5)"
            }}>
              <Text style={{ fontSize: 20 }}>Type</Text>
            </View>
            <Picker
              selectedValue={sportType}
              style={{ height: "80%", width: "100%" }}
              onValueChange={(itemValue, itemIndex) => setSportType(itemValue)}
            >
              <Picker.Item label="Yoga" value="Yoga" />
              <Picker.Item label="Swim" value="Swim" />
              <Picker.Item label="Walk" value="Walk" />
              <Picker.Item label="Ride" value="Ride" />
              <Picker.Item label="Run" value="Run" />
              <Picker.Item label="Climb" value="Climb" />
              <Picker.Item label="Hike" value="Hike" />
            </Picker>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView >
    )}
  </>
  )
}

const styles = StyleSheet.create({
  map: {
    height: "35%"
  },
  androidMap:{
    height: "0%"
  },
  textStyle: {
    fontSize: 15
  },
  headerText: {
    fontSize: 13,
  },
  androidHeaderText:{
    fontSize: 9
  },
  headerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "40%",
  },
  numberContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "60%",
  },
  numberContainerRight: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "60%",
  },
  numberStyle: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  androidNumberStyle: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  nameType: {
    width: "100%",
    height: "60%",
    flexDirection: "column",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: "12%",
    backgroundColor: "#f2f2f2"
  },
  androidInfoContainer:{
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: "12%",
    backgroundColor: "#f2f2f2"
  },

  left: {
    display: "flex",
    flexDirection: "column",
    width: "33.33%",
    height: "100%",
    borderColor: "rgba(140, 140, 140, 0.5)",
    borderRightWidth: 0.3
  },
  middle: {
    display: "flex",
    flexDirection: "column",
    width: "33.33%",
    height: "100%",
    borderColor: "rgba(140, 140, 140, 0.5)",
    borderRightWidth: 0.3
  },
  right: {
    display: "flex",
    flexDirection: "column",
    width: "33.33%",
    height: "100%"
  },
  stopBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "rgb(255, 111, 97)",
  },
  markBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgb(255, 111, 97)",
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  name: {
    width: "100%",
    height: "15%",
    flexDirection: 'row',
    borderColor: "rgba(140, 140, 140, 0.5)",
    borderBottomWidth: 0.3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15
  },
  type: {
    width: "100%",
    height: "15%",
    flexDirection: 'row',
    borderColor: "rgba(140, 140, 140, 0.5)",
    borderBottomWidth: 0.3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15

  },
  sport: {
    width: "100%",
    height: "15%",
    flexDirection: 'row',
    borderColor: "rgba(140, 140, 140, 0.5)",
    borderBottomWidth: 0.3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15

  },
  commute: {
    width: "100%",
    height: "40%",
    flexDirection: 'row',
    display: "flex",
    justifyContent: "center",
    marginHorizontal: 15
  },
  description: {
    width: "100%",
    height: "35%",
    borderColor: "rgba(140, 140, 140, 0.5)",
    borderBottomWidth: 0.3,
    display: "flex",
    marginHorizontal: 15
  },
  start: {
    width: "25%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  startDescription: {
    width: "100%",
    height: "30%",
    display: "flex",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  androidStartDescription: {
    width: "100%",
    height: "25%",
    display: "flex",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  input: {
    width: "75%",
    height: "100%",
    justifyContent: "center"
  },
  inputDescription: {
    width: "100%",
    height: "70%",
    justifyContent: "center"
  },

  inputCommute: {
    width: "70%",
    height: "60%",
    justifyContent: "flex-start",
  },
  androidInputCommute: {
    width: "75%",
    height: "60%",
    justifyContent: "flex-start",
  },
  iconContainer: {
    width: "15%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  imageContainer: {
    width: "85%",
    height: "100%",
    justifyContent: "center"
  }
})

export default CustomTrackScreen
