import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { Image } from 'react-native';
import { ActivityIndicator, StyleSheet, View } from "react-native"
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Context as LocationContext } from '../context/LocationContext';
import * as Location from "expo-location"
import * as Permissions from 'expo-permissions';
import { useIsFocused } from '@react-navigation/core';
import {FontAwesome5 } from '@expo/vector-icons';
import PolylineComponent from './PolylineComponent';


const Map = () => {
  const { state: { currentLocation, locations, isRecording,
    markedLocations, markedLocationsAddresses } } = useContext(LocationContext)
  const [location, setLocation] = useState(null)
  const [permission, setPermission] = useState(null)
  const [status, setStatus] = useState("")
  const [isModalVisible, setModalVisible] = useState(false)
  const isFocused = useIsFocused()
  const [followsUserLocation, setFollowsUserLocation] = useState(false)
  console.log(locations.length)
  useEffect(() => {
    const getPermission = async () => {
      const permission = await Location.getPermissionsAsync()
      setPermission(permission)
    }
    if (status) {
      getPermission()
    }
  }, [status])

  useEffect(() => {
    if (permission) {
      if (permission.status === "granted") {
        const getCurrentLocation = async () => {
          let location = await Location.getCurrentPositionAsync({
            maxAge: 5000,
            requiredAccuracy: 100,
            accuracy: Location.Accuracy.Balanced
          });
          setLocation(location);
        }
        getCurrentLocation()
      }
    }
  }, [permission, isFocused]);

  useEffect(() => {
    const reqPermission = async () => {
      const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        alert('We are using your location to display your training routes on the map. Please turn on location services for the application');
        throw new Error('Location permission not granted');
      }
      setStatus(status)
    }
    reqPermission()
  }, [])

  if (!location) {
    return <ActivityIndicator size="large" style={{ marginTop: 200 }} />
  }
  return (
      <View style={{ flex: 1 }}>
        <MapView
          // provider={PROVIDER_GOOGLE}
          style={{ height: isRecording ? "50%" : "80%", flex: 1 }}
          initialRegion={location ? {
            ...location.coords,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          } : {
            latitude: 37.33233141,
            longitude: -122.0312186,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          region={currentLocation ? {
            ...currentLocation.coords,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          } : {
            latitude: 37.33233141,
            longitude: -122.0312186,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          showsUserLocation={true}
          followsUserLocation={followsUserLocation}
        >
          <PolylineComponent locations={locations}/>

          {markedLocations && markedLocations.map((location, key) => (
            <Marker
              coordinate={{
                ...location.coords
              }}
              title={`Location ${key + 1}: This place's address is`}
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

        <View
          style={{
            position: 'absolute',//use absolute position to show button on top of the map
            bottom: '7%', //for center align
            alignSelf: 'flex-end', //for align to right
            right: '3%'
          }}
        >
          <FontAwesome5 name="search-location" size={24} color="black" 
          onPress={() => setFollowsUserLocation(!followsUserLocation)} />
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
  map: {
    height: "50%",
  },
})
export default Map
