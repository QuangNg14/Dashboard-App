import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { Image } from 'react-native';
import { ActivityIndicator, StyleSheet, View } from "react-native"
import MapView, { Polyline, Marker } from 'react-native-maps';
import { Context as LocationContext } from '../context/LocationContext';

const PolylineComponent = (props) => {
    const {locations} = props
    // const { state: {locations} } = useContext(LocationContext)
    return (
        <>
          {locations ? (
            <Polyline
              coordinates={locations.map((location) => location.coords)}
              strokeWidth={5}
              strokeColor="rgb(255, 111, 97)"
              fillColor="rgb(255, 111, 97)"
              zIndex={-1}
            />
          ) : null}
        </>            
    )
}

export default PolylineComponent
