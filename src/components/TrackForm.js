import React, { useContext, useEffect, useState } from 'react';
import { Input, Button, Text, } from 'react-native-elements';
import Spacer from './Spacer';
import { Context as LocationContext } from '../context/LocationContext';
import useSaveTracks from '../hooks/useSaveTracks';
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { reverseGeocodeAPI } from '../api/googleReverseGeocoding';
import TimerUp from './TimerUp';
import * as Location from "expo-location"


const TrackForm = ({navigation}) => {
  const {
    state: { name, isRecording, locations, currentLocation,
      currentSpeed, averageSpeed, speedLst, totalDistanceTravelled, markedLocationsAddresses, markedLocations},
    startRecording,
    stopRecording,
    updateTrackName,
    addMarkedLocation,
    getAverageSpeed,
    getTotalDistanceTravelled,
    reset
  } = useContext(LocationContext);

  const { state: { timeSecond, timeMinute, timeHour }, updateTime } = useContext(LocationContext)
  const [second, setSecond] = useState(parseInt(timeSecond))
  const [timeSecondLocal, setTimeSecondLocal] = useState(timeSecond)
  const [minute, setMinute] = useState(parseInt(timeMinute))
  const [timeMinuteLocal, setTimeMinuteLocal] = useState(timeMinute)
  const [hour, setHour] = useState(parseInt(timeHour))
  const [timeHourLocal, setTimeHourLocal] = useState(timeHour)

  useEffect(() => {
    let interval = setTimeout(() => setSecond(second + 1), 1000)
    if (isRecording) {
      if (second < 10) {
        setTimeSecondLocal(`0${second}`)
      }
      else {
        setTimeSecondLocal(`${second}`)
      }
      if (minute < 10) {
        setTimeMinuteLocal(`0${minute}`)
      }
      else {
        setTimeMinuteLocal(`${minute}`)
      }
      if (hour < 10) {
        setTimeHourLocal(`0${hour}`)
      }
      else {
        setTimeHourLocal(`${hour}`)
      }
      if (second >= 59) {
        setSecond(0)
        setMinute(minute + 1)
        clearInterval(interval)
      }
      if (minute > 59) {
        setMinute(0)
        setHour(hour + 1)
        clearInterval(interval)
      }
    }
    else {
      clearInterval(interval)
      updateTime(timeSecondLocal, timeMinuteLocal, timeHourLocal)
    }
  }, [second, isRecording])

  const handleMarkedLocation = async () => {
    let latitude = currentLocation && currentLocation.coords.latitude
    let longitude = currentLocation && currentLocation.coords.longitude
    const res = await Location.reverseGeocodeAsync({latitude: latitude, longitude: longitude})
    console.log(res)
    addMarkedLocation(currentLocation, res[0])
  }

  useEffect(() => {
    if (speedLst) {
      getAverageSpeed(speedLst)
    }
  }, [speedLst])

  useEffect(() => {
    if (locations) {
      getTotalDistanceTravelled(
        locations.map((location) => {
          return { latitude: location.coords.latitude, longitude: location.coords.longitude }
        })
      )
    }
  }, [locations])

  const handleStartRecording = () => {
    startRecording()
  }

  const handleCancer = () => {
    updateTime(timeSecondLocal, timeMinuteLocal, timeHourLocal)
    setSecond(0)
    setMinute(0)
    setHour(0)
    reset()
  }

  const handleSave = () => {
    setSecond(0)
    setMinute(0)
    setHour(0)
    navigation.navigate("Track Information", {timeHour, timeMinute, timeSecond, locations, currentLocation,
      averageSpeed, totalDistanceTravelled, markedLocations, markedLocationsAddresses})
    // saveTrack()
  }

  return (
    <View style={styles.container}>
      <Spacer>
        {isRecording ? (
          <>
            <View style={styles.infoContainer}>
              <View style={styles.topRow}>
                <View style={styles.topLeft}>
                  <View style={styles.headerContainer}>
                    <Text>CURRENT SPEED (KM/H)</Text>
                  </View>
                  <View style={styles.numberContainer}>
                    <Text style={styles.numberStyle}>{Math.abs(Math.round(currentSpeed * 10) / 10)}</Text>
                  </View>
                  <View style={{ width: "100%", height: "10%" }}></View>
                </View>

                <View style={styles.topRight}>
                  <View style={styles.headerContainer}>
                    <Text>AVG SPEED (KM/H)</Text>
                  </View>
                  <View style={styles.numberContainerRight}>
                    <Text style={styles.numberStyle}>{Math.abs(Math.round(averageSpeed * 10) / 10)}</Text>
                  </View>
                  <View style={{ width: "100%", height: "10%" }}></View>
                </View>
              </View>

              <View style={styles.bottomRow}>
                <View style={styles.bottomLeft}>
                  <View style={styles.headerContainer}>
                    <Text>DISTANCE (KM)</Text>
                  </View>
                  <View style={styles.numberContainer}>
                    <Text style={styles.numberStyle}>{Math.round(totalDistanceTravelled * 100) / 100}</Text>
                  </View>
                  <View style={{ width: "100%", height: "10%" }}></View>
                </View>
                <View style={styles.bottomRight}>
                  <View style={styles.headerContainer}>
                    <Text>TIME </Text>
                  </View>
                  <View style={styles.numberContainerRight}>
                    <Text style={styles.numberStyle}>{timeHourLocal} : {timeMinuteLocal} : {timeSecondLocal}</Text>
                  </View>
                  <View style={{ width: "100%", height: "10%" }}></View>
                </View>
              </View>

            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.stopBtn} onPress={stopRecording}>
                <Text style={{ fontWeight: "bold", 
                fontSize: Platform.OS === "ios" ? 16 : 14, color: "rgb(255, 111, 97)" }}>STOP</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.markBtn} onPress={handleMarkedLocation}>
                <Text style={{ fontWeight: "bold", 
                fontSize: Platform.OS === "ios" ? 16 : 14, color: "white" }}>PIN</Text>
              </TouchableOpacity>

            </View>
          </>
        ) : (
            <>
              {!isRecording && locations.length ? (
                <>
                <View style={{display: 'flex', flexDirection:"row",
                 justifyContent:"center",
                 alignItems:"center"}}>

                  <TouchableOpacity style={styles.stopBtn} onPress={handleStartRecording}>
                    <Text style={{ fontWeight: "bold", 
                    fontSize: Platform.OS === "ios" ? 16 : 14, color: "rgb(255, 111, 97)" }}>RESUME</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.markBtn} onPress={handleSave}>
                    <Text style={{ fontWeight: "bold", 
                    fontSize: Platform.OS === "ios" ? 16 : 14, color: "white" }}>SAVE</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.cancelBtn} onPress={handleCancer}>
                    <Text style={{ fontWeight: "bold", 
                    fontSize: Platform.OS === "ios" ? 16 : 14, color: "rgb(255, 111, 97)" }}>CANCEL</Text>
                  </TouchableOpacity>
                </View>
                </>
              )
                : (
                    <View style={{width:"100%", justifyContent: "center", alignItems: "center" }}>
                      <TouchableOpacity style={styles.markBtn} onPress={handleStartRecording}>
                        <Text style={{ fontWeight: "bold", 
                        fontSize: Platform.OS === "ios" ? 16 : 14, color: "white" }}>RECORD</Text>
                      </TouchableOpacity>
                    </View>
                )

              }
            </>
          )}
      </Spacer>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "50%"
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "rgba(140, 140, 140, 1)",
    height: 40,
    width: "100%",
    fontSize: 20
  },
  topRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "50%",
    borderColor: "rgba(140, 140, 140, 0.5)",
    borderBottomWidth: 0.3
  },
  bottomRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "50%",
    borderColor: "rgba(140, 140, 140, 0.5)",
    borderBottomWidth: 0.3
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "65%"
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "35%",
    justifyContent: "center",
    alignItems: "center"
  },
  topLeft: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
    height: "100%"
  },
  topRight: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
    height: "100%"
  },
  bottomRight: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
    height: "100%"
  },
  bottomLeft: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
    height: "100%"
  },
  headerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "20%",
  },
  numberContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "70%",
    borderColor: "rgba(140, 140, 140, 0.5)",
    borderRightWidth: 0.3
  },
  numberContainerRight: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "80%",
  },
  numberStyle: {
    fontSize: 25,
    fontWeight: 'bold'
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
  cancelBtn:{
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "rgb(255, 111, 97)",
  }
})

export default TrackForm;
