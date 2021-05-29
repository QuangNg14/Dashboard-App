import * as Location from "expo-location"
//ONLY FOR TESTING

const tenMetersWithDegrees = 0.0001

const getLocation = (increment) => {
    //trick expo location that our device is moving 
    //fake location change every 1 second 
    return {
        timestamp: 1000000,
        coords:{
            speed: 0,
            heading: 0,
            accuracy: 5,
            altitudeAccuracy: 5,
            altitude: 5,
            longitude: -122.0312186 + increment * tenMetersWithDegrees,
            latitude: 37.33233141 + increment * tenMetersWithDegrees
        }
    }
}

let counter = 0 
setInterval(() => {
    //every 1 second fake the location changed in the real world
    Location.EventEmitter.emit("Expo.locationChanged", {
        watchId: Location._getCurrentWatchId(),
        location: getLocation(counter)
    });
    counter++;
}, 1000);
