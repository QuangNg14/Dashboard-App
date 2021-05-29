import AsyncStorage from '@react-native-async-storage/async-storage';
import createDataContext from "./createDataContext" 
import trackerApi from "../api/tracker"

const initialState = {
    token: "",
    errorMessage: '', 
    user: null
}

const authReducer = (state, action) => {
    switch (action.type) {
        case "add_error":
            return {...state, errorMessage: action.payload}
        case "signup":
            return {...state, errorMessage: "", token: action.payload}
        case "get_current_user":
            return {...state, user: action.payload}
        default:
            return state
    }
}

const signup = (dispatch) => {
    //make api request to sign up
    // if we sign up -> modify our state say that we are signed up 
    // if sign up fail -> show errorMessage
    // take JWT token and store it in the device 
    // dispatch an action to put the token in the state and change the state
    // navigate to main screen (TrackList Screen)
    return async ({email, password}) => {
        try{
            const res = await trackerApi.post("/signup",{email, password})
            await AsyncStorage.setItem('token', res.data.token)
            dispatch({type: 'signup', payload: res.data.token})
            // RootNavigation.navigate("TrackList")
        }   
        catch(err){
            //always call dispatch to update our state
            dispatch({type: 'add_error', payload: 'Something went wrong with Sign Up'})
            console.log(err.response.data)
        }
    }
}

const signin = (dispatch) => {
    //try to signin
    //handle success by updating state
    //handle failure by showing error message
    return async ({email, password}) => {
        try{
            const res = await trackerApi.post("/signin", {email, password})
        }
        catch(err){
            dispatch({type: "add_error", payload: "Something went wrong with Sign In"})
            console.log(err.response.data)
        }
    }
}

const signout = (dispatch) => {
    return () => {
        //signout
    }
}

const getCurrentUser = (dispatch) => {
    return async () => {
        const res = await trackerApi.get("/user")
        dispatch({type: "get_current_user", payload: res.data})
    }
}

export const {Context, Provider} = createDataContext(
    authReducer, //reducer
    {signin, signup, signout, getCurrentUser}, //actions
    initialState //initial state
)