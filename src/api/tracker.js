import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
    baseURL: "https://tracking-routes-app.df.r.appspot.com"
})

instance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("token")
        if(token){
            config.headers.Authorization = `Bearer ${token}`  
            //get authorization header
        }
        return config
    }, //any function we make before a request
    (err) => {
        return Promise.reject(err)
    }

)

export default instance 