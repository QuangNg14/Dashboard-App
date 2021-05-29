import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import {FlatList, Image } from 'react-native';
import { ActivityIndicator, StyleSheet, View } from "react-native"
import { Text } from "react-native-elements"
import MapView, { Polyline, Circle, Marker, Callout, Animated } from 'react-native-maps';
import Pulse from 'react-native-pulse';
import { Context as LocationContext } from '../context/LocationContext';
import * as Location from "expo-location"
import * as Permissions from 'expo-permissions';
import { useIsFocused } from '@react-navigation/core';

const Map = () => {
  const { state: { currentLocation, locations, isRecording,
    markedLocations, markedLocationsAddresses } } = useContext(LocationContext)
    const [errorMsg, setErrorMsg] = useState(null);
    const [location, setLocation] = useState(null)
    const [permission, setPermission] = useState(null)
    const [status, setStatus] = useState("")
    const isFocused = useIsFocused()

  useEffect(() => {
    const reqPermission = async () => {
      const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
          alert('We are using your location for the best experience in the application. Please turn on location services for the application');
          throw new Error('Location permission not granted');
      }
      setStatus(status)
    }
    reqPermission()
  }, [])

  useEffect(() => {
    const getPermission = async () => {
      const permission = await Location.getPermissionsAsync()
      setPermission(permission)
    }
    if(status){
      getPermission()
    }
  }, [status])

  useEffect(() => {
    if(permission){
      console.log(permission)
      if(permission.status === "granted"){
        const getCurrentLocation = async () => {
          let location = await Location.getCurrentPositionAsync({
            maxAge: 5000,
            requiredAccuracy: 100,
            accuracy: Location.Accuracy.Balanced
          });
          console.log(location)
          setLocation(location);
        }
        getCurrentLocation()
      }
    }
  }, [permission, isFocused]);

  if (!location) {
    return <ActivityIndicator size="large" style={{ marginTop: 200 }} />
  }

  return (
    <MapView
      style={{height: isRecording ? "50%" : "80%"}}
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
      region={location ? {
        ...location.coords,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }: {
        latitude: 37.33233141,
        longitude: -122.0312186,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      showsUserLocation={true}
      followUserLocation = {true}
    >

      <Polyline
        coordinates={locations.map((location) => location.coords)}
        strokeWidth={5}
        strokeColor="rgb(255, 111, 97)"
        fillColor="rgb(255, 111, 97)"
        zIndex={-1}
      />
      
      {markedLocations && markedLocations.map((location, key) => (
        <Marker
        coordinate={{
          ...location.coords
        }}
        title={`Location ${key + 1}: This place's address is`}
        description={markedLocationsAddresses[key]}
        key={key}
        >
              <Image source={require("../../assets/map-marker.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="center"
                resizeMethod="resize"
              />
            </Marker>
            ))}
    </MapView>
  )
}

const styles = StyleSheet.create({
  map: {
    height: "50%",
  },
})
export default Map
