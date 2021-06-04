// import "../_mockLocation"
import React, { useState, useEffect, useCallback } from 'react'
import { Text, View, Button, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';
import Map from '../components/Map';
import { requestPermissionsAsync, watchPositionAsync, Accuracy, getLastKnownPositionAsync } from "expo-location"
import { useContext } from 'react';
import { Context as LocationContext } from "../context/LocationContext"
import useLocation from '../hooks/useLocation';
import { useIsFocused } from '@react-navigation/native';
import TrackForm from '../components/TrackForm';
import * as Location from "expo-location"
import Modal from 'react-native-modal';
import { EvilIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';

const TrackCreateScreen = ({ navigation, navigator }) => {
    //trackCreateScreen = 2 components Map + TrackForm
    const { state: { isRecording, currentLocation, speedLst }
        , addLocation, addMarkedLocation, getAverageSpeed } = useContext(LocationContext)
    //useCallback used to limit the number of rebuilding functions
    //cái array này giống array trong useEffect nếu có gì thay đổi sẽ run lại function 
    //function vẫn giữ nguyên nếu trong array ko đổi 
    const isFocused = useIsFocused()
    const callback = useCallback(location => {
        addLocation(location, isRecording)
    }, [isRecording]) //only run when state.isRecording changes
    // const [isModalVisible, setModalVisible] = useState(false)
    // const [permission, setPermission] = useState(null)
    // const [agree, setAgree] = useState(false)
    const [err] = useLocation(isFocused, isRecording, callback)

    return (
        // <SafeAreaView forceInset={{top: "always"}}>
        <View style={styles.container}>
            <Map />
            {err ? <Text>Please enable location services</Text> : null}
            <TrackForm navigation={navigation} />
        </View>
        // </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        width: "100%",
        height: "100%"
    }
})

export default TrackCreateScreen
