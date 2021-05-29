import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { Text, View, Button, StyleSheet, TouchableOpacity, Image } from "react-native"
import { Context as TrackContext } from "../context/TrackContext"
import { Context as PostContext } from "../context/PostContext"
import { Context as LocationContext } from "../context/LocationContext"
import MapView, { Callout, Marker, Polyline } from "react-native-maps"
import trackerApi from "../api/tracker"
import { useIsFocused } from '@react-navigation/native'
import { FontAwesome5 } from '@expo/vector-icons'
import { reverseGeocodeAsync } from 'expo-location'

const TrackDetailScreen = ({ navigation, route }) => {
  const { _id } = route.params
  const { state, deleteTrack } = useContext(TrackContext)
  const {fetchPosts, createPost} = useContext(PostContext)
  const {reset} = useContext(LocationContext)
  const [curUser, setCurUser] = useState(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [firstLocation, setFirstLocation] = useState("")
  const [finalLocation, setFinalLocation] = useState("")
  const isFocused = useIsFocused()

  //state is a list of tracks
  const track = state.find((track) => track._id == _id)
  useEffect(() => {
      const getCurrentUser = async () => {
          const res = await trackerApi.get("/user")
          setCurUser(res.data)
      }
      getCurrentUser()
  },[])

  useEffect(() => {
    if(curUser){
      setFirstName(curUser.firstName)
      setLastName(curUser.lastName)
    }
  }, [curUser, isFocused])

  const handleDeleteTrack = (_id) => {
    navigation.navigate("TrackList", {_id})
  }

  const handleShareToFeed = () => {
    const date = new Date()
    const minute = (date.getMinutes()<10?'0':'') + date.getMinutes()
    const hour = (date.getHours()<10?'0':'') + date.getHours()
    createPost(_id, `${firstName} ${lastName}`, track.locations, track.totalDistanceTravelled, track.timeHour, 
      track.timeMinute, track.timeSecond,
      track.markedLocations, track.markedLocationsAddresses, Math.abs(track.averageSpeed), track.type,
      track.sport, track.description, track.commute, hour, minute, track.image, curUser.image, Date.now())
    reset()
    alert("Shared to Feed")
  }
  
  const initialLocation = track.locations.length ? track.locations[0].coords : {
    latitude: 37.33233141,
    longitude: -122.0312186,
}

  const lastLocation = track.locations.length ? track.locations[track.locations.length - 1].coords : {
    latitude: 37.33233141,
    longitude: -122.0312186,
  }

  useEffect(() => {
    const getReverseAddress = async () => {
        const res = await reverseGeocodeAsync(initialLocation)
        const res2 = await reverseGeocodeAsync(lastLocation)
        setFirstLocation(res[0])
        setFinalLocation(res2[0])
    }
    getReverseAddress()
},[])
  return (
    <>
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
          coordinates={track.locations.map(t => t.coords)}
          strokeWidth={5}
          strokeColor="rgb(255, 111, 97)"
          fillColor="rgb(255, 111, 97)"
        />

          <Marker
            coordinate={{
              ...initialLocation
            }}
            title="This is your start point"
            description={`${firstLocation && firstLocation.name} on ${firstLocation && firstLocation.street} ${firstLocation && firstLocation.city}`}
            key="start"
          >
            <Image source={require("../../assets/house-icon.png")}
              style={{ width: 40, height: 40 }}
              resizeMethod="resize"
            />
          </Marker>

          <Marker
            coordinate={{
              ...lastLocation
            }}
            title="This is your end point"
            description={`${finalLocation && finalLocation.name} on ${finalLocation && finalLocation.street} ${finalLocation && finalLocation.city}`}
            key="end"
          >
            <Image source={require("../../assets/house-icon.png")}
              style={{ width: 40, height: 40 }}
              resizeMethod="resize"
            />
          </Marker>
        {track.markedLocations && track.markedLocations.map((location, key) => (
          <Marker
            coordinate={{
              ...location.coords
            }}
            title={`Location ${key + 1}: This place's address is`}
            description={track.markedLocationsAddresses[key]}
            key={key}
          >
            <Image source={require("../../assets/map-marker.png")}
              style={{ width: 40, height: 40 }}
              resizeMethod="resize"
            />
          </Marker>
        ))}
      </MapView>
      <View style={{ height: "50%", width: "100%", display: "flex", flexDirection: "column" }}>
        <View style={styles.nameType}>
          <View style={{width:"50%", height:"100%",borderColor: "rgba(140, 140, 140, 0.5)",
              borderRightWidth: 0.2,
          justifyContent:"center", marginLeft: 10, flexDirection:"row"}}>
            <View style={{width:"25%", height: "100%", justifyContent:"center"}}>
              <Text style={{fontWeight: "bold", color:'white',
              fontSize: Platform.OS === "ios" ? 14 : 12}}>Name</Text>
            </View>
            <View style={{width:"75%", height: "100%", justifyContent:"center"}}>
              <Text style={{marginLeft: 10, color:"#4d4d4d",
            fontSize: Platform.OS === "ios" ? 14 : 12}}>{track.name}</Text>
            </View>
          </View>
          <View style={{width:"50%", height:"100%", justifyContent:"center", marginLeft: 10, flexDirection:"row"}}>
            <View style={{width:"20%", height: "100%", justifyContent:"center"}}>
              <Text style={{fontWeight: "bold", color:"white",
            fontSize: Platform.OS === "ios" ? 14 : 12}}>Type</Text>
            </View>
            <View style={{width:"80%", height: "100%", justifyContent:"center",
             alignItems:"center", flexDirection:"row"}}>
                <FontAwesome5 name="running" size={24} color="black" />
                <Text style={{marginLeft: 10, color:"#4d4d4d", 
              fontSize: Platform.OS === "ios" ? 14 : 12}}>{track.type}</Text>
            </View>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.left}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>AVG SPEED (KM/H)</Text>
            </View>
            <View style={styles.numberContainer}>
              <Text style={styles.numberStyle}>{Math.round(track.averageSpeed * 10) / 10}</Text>
            </View>
          </View>

          <View style={styles.middle}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>DISTANCE (KM)</Text>
            </View>
            <View style={styles.numberContainer}>
              <Text style={styles.numberStyle}>{Math.round(track.totalDistanceTravelled * 100) / 100}</Text>
            </View>
          </View>

          <View style={styles.right}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>TIME</Text>
            </View>
            <View style={styles.numberContainerRight}>
              <Text style={styles.numberStyle}>{track.timeHour} : {track.timeMinute} : {track.timeSecond}</Text>
            </View>
          </View>
        </View>

        <View style={{
          display: 'flex', flexDirection: "row", marginTop: 50, height: "20%", width: "100%",
          justifyContent: "center",
          alignItems: "center"
        }}>

          {/* <TouchableOpacity style={styles.stopBtn} onPress={() => handleDeleteTrack(_id)}>
            <Text style={{ fontWeight: "bold", fontSize: 16, color: "rgb(255, 111, 97)" }}>DELETE</Text>
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.markBtn} onPress={handleShareToFeed}>
            <Text style={{ fontWeight: "bold", 
            fontSize: Platform.OS === "ios" ? 16 : 14, color: "white" }}>SHARE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  map: {
    height: "60%"
  },
  nameType: {
    width: "100%",
    height: "15%",
    flexDirection:"row",
    backgroundColor:"rgb(255, 111, 97)"
  },
  infoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: "15%",
    backgroundColor: "#f2f2f2"
  },

  left: {
    display: "flex",
    flexDirection: "column",
    width: "33.33%",
    height: "100%",
    borderColor: "rgba(140, 140, 140, 0.5)",
    borderRightWidth: 0.2
  },
  middle: {
    display: "flex",
    flexDirection: "column",
    width: "33.33%",
    height: "100%",
    borderColor: "rgba(140, 140, 140, 0.5)",
    borderRightWidth: 0.2
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
    headerText: {
    fontSize: 10,
  },
})

export default TrackDetailScreen
