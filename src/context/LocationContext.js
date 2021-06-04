import createDataContext from "./createDataContext"
import * as geolib from 'geolib';

const initialState = {
    isRecording: false,
    currentLocation: null,
    name: "",
    locations: [],
    markedLocations: [],
    markedLocationsAddresses: [],
    currentSpeed: 0,
    speedLst: [],
    averageSpeed: 0,
    totalDistanceTravelled: 0.0,
    timeSecond: "00",
    timeMinute: "00",
    timeHour: "00",
    type: "",
    sport: "",
    description: "",
    commute: false,
    image:"",
    curAddress: {}
}

const locationReducer = (prevState, action) => {
    // isRecording? 
    // get currentLocation
    // get locations array
    switch (action.type) {
        case "add_current_location":
            return {
                ...prevState,
                currentLocation: action.payload
            }
        case "add_location":
            return {
                ...prevState,
                locations: [...prevState.locations, action.payload],
            }       
        case "start_recording":
            return{
                ...prevState,
                isRecording: true
            }
        case "stop_recording":
            return{
                ...prevState,
                isRecording: false
            }
        case "change_name":
            return {
                ...prevState,
                name: action.payload
            }
        case "add_marked_location":
            return {
                ...prevState,
                markedLocations: [...prevState.markedLocations, action.payload.location],
                markedLocationsAddresses: [...prevState.markedLocationsAddresses, `${action.payload.address.name} ${action.payload.address.street} ${action.payload.address.subregion}` ]
            }
        case "add_speed":
            return {
                ...prevState,
                speedLst: [...prevState.speedLst, action.payload]
            }
        case "add_current_speed":
            return {
                ...prevState,
                currentSpeed: action.payload
            }
        case "reset":
            return {
                ...prevState,
                name: "",
                locations: [],
                markedLocations: [],
                markedLocationsAddresses: [],
                currentSpeed: 0,
                speedLst: [],
                averageSpeed: 0,
                totalDistanceTravelled: 0.0,
                timeSecond: "00",
                timeMinute: "00",
                timeHour: "00",
                type: "",
                sport: "",
                description: "",
                commute: false,
                image:"",
            }
        case "get_average_speed":
            return {
                ...prevState,
                averageSpeed: action.payload
            }
        case "get_total_distance_travelled":
            return {
                ...prevState,
                totalDistanceTravelled: action.payload
            }
        case "update_time":
            return{
                ...prevState,
                timeSecond: action.payload.timeSecond,
                timeMinute: action.payload.timeMinute,
                timeHour: action.payload.timeHour
            }
        case "update_extra_info":
            return {
                ...prevState,
                type: action.payload.type,
                sport: action.payload.sport,
                description: action.payload.description,
                commute: action.payload.commute,
                image: action.payload.image,
                curAddress: action.payload.curAddress
            }
        case "reset_locations":
            return {
                ...prevState,
                locations: []
            }
        default:
            return prevState;
    }
}

const resetLocations = (dispatch) => {
    return () => {
        dispatch({type:"reset_locations"})
    }
}

const updateExtraInfo = (dispatch) => {
    return (type, sport, description, commute, image, curAddress) => {
        dispatch({type:"update_extra_info", payload: {type: type, sport: sport,
             description: description, commute: commute, image: image, curAddress: curAddress}})
    }
}

const updateTrackName = (dispatch) => {
    return (name) => {
        dispatch({type: "change_name", payload: name})
    }
}

const startRecording = (dispatch) => {
    return () => {
        dispatch({type:"start_recording"})
    }
}
const stopRecording = (dispatch) => {
    return () => {
        dispatch({type:"stop_recording"})
    }
}
const addLocation = (dispatch) => {
    return (location, isRecording, speedLst) => {
        dispatch({type: "add_current_location", payload: location})
    if(isRecording){
        dispatch({type: "add_location", payload: location})
        dispatch({type: "add_speed", payload: location.coords.speed * 3.6})
        dispatch({type: "add_current_speed", payload: location.coords.speed * 3.6})
    }
    }
}

const getTotalDistanceTravelled = (dispatch) => {
    return (locations) => {
        if(locations){
            dispatch({type: "get_total_distance_travelled", payload: parseFloat(geolib.getPathLength(locations)/1000)})
        }
    }
}

const getAverageSpeed = (dispatch) => {
    return (speedLst) => {
        if(speedLst){
            dispatch({type: "get_average_speed", 
            payload: speedLst.reduce((a, b) => a + b, 0)/speedLst.length})
        }
    }
}

const addMarkedLocation = (dispatch) => {
    return (location, address) => {
        dispatch({type: "add_marked_location", payload: {location: location, address: address}})
    }
}

const updateTime = (dispatch) => {
    return (timeSecond, timeMinute, timeHour) => {
        dispatch({type: "update_time", payload: {timeSecond: timeSecond
            ,timeMinute: timeMinute, timeHour: timeHour}})
    }
}

const reset = (dispatch) => {
    return () => {
        dispatch({type: "reset"})
    }
}


export const {Context, Provider} = createDataContext(
    locationReducer,
    {startRecording, stopRecording, addLocation, updateTrackName, 
        addMarkedLocation, reset, getAverageSpeed, 
        getTotalDistanceTravelled, updateTime, updateExtraInfo, resetLocations},
    initialState
)

