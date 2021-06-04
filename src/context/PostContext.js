import createDataContext from "./createDataContext"
import trackerApi from "../api/tracker"

const initialState = []

const postReducer = (prevState, action) => {
    switch (action.type) {
        case "fetch_posts":
            return action.payload
    
        default:
            return prevState
    }
}


const fetchPosts = (dispatch) => {
    return async () => {
        const res = await trackerApi.get("/posts")
        dispatch({type: "fetch_posts", payload: res.data})
    }
}

const createPost = dispatch => async (trackId, name, locations, totalDistanceTravelled, timeHour, timeMinute, timeSecond,
    markedLocations, markedLocationsAddresses, averageSpeed, type, sport, description, commute, curHour, curMinute, image, avatar, curAddress, createdAt) => {
    try{
        await trackerApi.post('/posts', {trackId, name, locations, totalDistanceTravelled, timeHour, timeMinute, timeSecond,
            markedLocations, markedLocationsAddresses, averageSpeed, type, sport, description, commute, curHour, curMinute, image, avatar, curAddress, createdAt});
    }
    catch(err){
        console.log(err)
    }
  };

const likePost = dispatch => async (postId, likes) => {
    try {
        await trackerApi.post("/posts/like", {likes, postId})
    }
    catch(err){
        console.log(err)
    }
}

const commentPost = dispatch => async (postId, comments) => {
    try {
        await trackerApi.post("/posts/comment", {comments, postId})
    }
    catch(err){
        console.log(err)
    }
}

const deletePost = dispatch => async (id) => {
    const res = await trackerApi.delete(`/posts/${id}`)
}

const rejectPost = dispatch => async (postId) => {
    try {
        await trackerApi.post("/posts/reject", {postId})
    }
    catch(err){
        console.log(err)
    } 
}

const approvePost = dispatch => async (postId) => {
    try {
        await trackerApi.post("/posts/approve", {postId})
    }
    catch(err){
        console.log(err)
    } 
}

export const {Context, Provider} = createDataContext(
    postReducer,
    {fetchPosts, createPost, likePost, commentPost, deletePost, approvePost, rejectPost},
    initialState
)