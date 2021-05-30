import { useState, useEffect, useContext, useRef } from "react"
import { AppState } from "react-native"
import { requestPermissionsAsync, watchPositionAsync, Accuracy, requestForegroundPermissionsAsync, requestBackgroundPermissionsAsync } from "expo-location"
import * as Location from "expo-location"
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';
import { Context as LocationContext } from "../context/LocationContext"


export default (isFocused, shouldTrack, callback) => {
    const [err, setErr] = useState(null);
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const [permission, setPermission] = useState(null)
    const [isModalVisible, setModalVisible] = useState(true)

    useEffect(() => {
        AppState.addEventListener('change', _handleAppStateChange);
        return () => {
            AppState.removeEventListener('change', _handleAppStateChange);
        };
    }, []);

    const _handleAppStateChange = (nextAppState) => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log('App has come to the foreground!');
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
    };

    useEffect(() => {
        const getPermission = async () => {
            const permission = await Location.getPermissionsAsync()
            setPermission(permission)
        }
        getPermission()
    }, [])

    useEffect(() => {
        let subscriber;
        if (appStateVisible == "active") {
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
                            distanceInterval: 10,
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
        }
        else {
            const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION';
            TaskManager.defineTask(TASK_FETCH_LOCATION, async ({ data: { locations }, error }) => {
                if (error) {
                    console.error(error);
                    return;
                }
                const [location] = locations;
                callback(location)
            });
            const startWatching = async () => {
                try {
                    const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
                    if (status !== 'granted') {
                        throw new Error('Location permission not granted');
                    }

                    subscriber = await Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
                        accuracy: Accuracy.BestForNavigation,
                        timeInterval: 3000, //update every second
                        distanceInterval: 30, //update every 10 meters,
                        deferredUpdatesInterval: 3000,
                        foregroundService: {
                            notificationTitle: 'Using your location',
                            notificationBody: 'To turn off, go back to the app and switch something off.',
                        },
                        pausesUpdatesAutomatically: true
                    })

                } catch (e) {
                    setErr(e);
                }
            };
            if (isFocused && shouldTrack) {
                startWatching();
            } else if (!shouldTrack) {
                Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then((value) => {
                    if (value) {
                        Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
                    }
                });
                // subscriber.remove(); //nếu ko trong màn hình đó thì remove
            }
            return () => {
                TaskManager.unregisterAllTasksAsync();
            };
        }

    }, [shouldTrack, callback, appStateVisible, permission]);

    return [err];
};
