//this hook is for connecting LocationContext and TrackContext
import {useContext} from "react"
import {Context as LocationContext} from "../context/LocationContext"
import {Context as TrackContext} from "../context/TrackContext"
import * as RootNavigation from "../RootNavigation";

export default () => {
    const {fetchTracks, createTrack} = useContext(TrackContext)
    const {state: {name, locations, markedLocations, averageSpeed,
         markedLocationsAddresses, totalDistanceTravelled, timeHour, timeMinute, timeSecond,
         type, sport, description, commute, image, curAddress}
         , reset} = useContext(LocationContext)
    
    const saveTrack = async () => {
        await createTrack(name, locations, totalDistanceTravelled, timeHour, timeMinute, timeSecond,
            markedLocations, markedLocationsAddresses, Math.abs(averageSpeed), type, sport, description, commute, image, curAddress)
        reset()
        RootNavigation.navigate('TrackList');
    }
    return [saveTrack]
    //nếu bất kì khi nào muốn saveTrack thì chỉ cần gọi đến useSaveTrack và
    //lấy saveTrack
}