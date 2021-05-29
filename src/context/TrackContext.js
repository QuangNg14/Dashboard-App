import createDataContext from "./createDataContext"
import trackerApi from "../api/tracker"
import * as RootNavigation from "../RootNavigation";

const initialState = []

const trackReducer = (prevState, action) =>{
    switch (action.type) {
        case "fetch_tracks":
            return action.payload //get API luôn là state ban đầu nên return luôn
    
        default:
            return prevState;
    }
}

const fetchTracks = (dispatch) => {
    return async () => {
        const res = await trackerApi.get("/tracks")
        dispatch({type: "fetch_tracks", payload: res.data})
    }
}

const createTrack = dispatch => async (name, locations, totalDistanceTravelled, timeHour, timeMinute, timeSecond,
    markedLocations, markedLocationsAddresses, averageSpeed, type, sport, description, commute, image) => {
    try{
        await trackerApi.post('/tracks', {name, locations, totalDistanceTravelled, timeHour, timeMinute, timeSecond,
            markedLocations, markedLocationsAddresses, averageSpeed, type, sport, description, commute, image});
    }
    catch(err){
        console.log(err)
    }
  };

const deleteTrack = dispatch => async (id) => {
    const res = await trackerApi.delete(`/tracks/${id}`)
    RootNavigation.navigate('TrackList');
}

export const {Context, Provider} = createDataContext(
    trackReducer,
    {fetchTracks, createTrack, deleteTrack},
    initialState
)