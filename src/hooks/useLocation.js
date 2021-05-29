import { useState, useEffect } from "react"
import { requestPermissionsAsync, watchPositionAsync, Accuracy, requestForegroundPermissionsAsync, requestBackgroundPermissionsAsync } from "expo-location"
import * as Location from "expo-location"
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';
//put things that might be reusable sometime in the future
//put everything related to Location

export default (isFocused, shouldTrack, callback) => {
    const [err, setErr] = useState(null)
    const [stopValue, setStopValue] = useState(null)
    const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION';
    try{
        TaskManager.defineTask(TASK_FETCH_LOCATION, async ({ data: { locations }, error }) => {
            if (error) {
              console.error(error);
              return;
            }
            const [location] = locations;
            try {
              callback(location)
              console.log(location)
              // you should use post instead of get to persist data on the backend
            } catch (err) {
              console.error(err);
            }
          });
    }
    catch(err){
        console.log(err)
    }
    //luôn define functions trong useEffect
    useEffect(() => {
        let subscriber; //cleanup
        const startWatching = async () => {
            try {
                // const { granted } = await Location.requestPermissionsAsync();
                // if (!granted) {
                //     throw new Error('Location permission not granted');
                // }
                const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
                    if (status !== 'granted') {
                        throw new Error('Location permission not granted');
                    } 
                // const {granted2} = await Location.requestBackgroundPermissionsAsync()
                // if (!granted2){
                //     throw new Error("Location permission not granted")
                // }
                await Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
                    accuracy: Accuracy.BestForNavigation,
                    timeInterval: 1000, //update every second
                    distanceInterval: 1, //update every 10 meters,
                    deferredUpdatesInterval: 1000, 
                    foregroundService: {
                        notificationTitle: 'Using your location to track your route for the best experience',
                        notificationBody: 'To turn off, go back to the app and press STOP.',
                    },
                    // pausesUpdatesAutomatically: true
                })
                //callback = (location) => addLocation(location)
            } catch (e) {
                setErr(e);
                console.log(e)
            }
        };

        if (isFocused && shouldTrack) {
            startWatching();
            //shouldTrack = isFocused: nếu đang trong màn hình trackCreate thì track
        } else if(!shouldTrack) {
            Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then((value) => {
                if (value) {
                    Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
                }
            });
            // subscriber.remove(); //nếu ko trong màn hình đó thì remove
        }
        // return () => {
        //     Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then((value) => {
        //         if (value) {
        //             Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
        //         }
        //     });
        // };
    }, [shouldTrack, callback]);
    //cái nào là state, context hoặc variable changed trong 
    //useEffect thì phải cho vào array
    return [err]
}