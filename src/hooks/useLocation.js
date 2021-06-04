import { useState, useEffect, useContext, useRef } from "react"
import { requestPermissionsAsync, watchPositionAsync, Accuracy, requestForegroundPermissionsAsync, requestBackgroundPermissionsAsync } from "expo-location"
import * as Location from "expo-location"
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';
import { Context as LocationContext } from "../context/LocationContext"


export default (isFocused, shouldTrack, callback) => {
    const [err, setErr] = useState(null);
    const [permission, setPermission] = useState(null)

    useEffect(() => {
        const getPermission = async () => {
            const permission = await Location.getPermissionsAsync()
            setPermission(permission)
        }
        getPermission()
    }, [])

    useEffect(() => {
        let subscriber;
            const startWatching = async () => {
                try {
                    const { granted } = await requestPermissionsAsync();
                    if (!granted) {
                        throw new Error('Location permission not granted');
                    }
                    subscriber = await watchPositionAsync(
                        {
                            accuracy: Accuracy.BestForNavigation,
                            timeInterval: 1000,
                            distanceInterval: 1,
                        },
                        callback
                    );
                } catch (e) {
                    setErr(e);
                }
            };
            if (isFocused && shouldTrack) {
                startWatching();
            } else if (!shouldTrack) {
                if (subscriber) {
                    subscriber.remove();
                }
                subscriber = null;
            }
            return () => {
                if (subscriber) {
                    subscriber.remove();
                }
            };

    }, [shouldTrack, callback, permission]);

    return [err];
};
