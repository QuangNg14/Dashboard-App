import React, { useContext, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { Context as LocationContext } from '../context/LocationContext';

const TimerUp = ({isRecording}) => {
    const {state:{timeSecond, timeMinute, timeHour}, updateTime} = useContext(LocationContext)
    const [second, setSecond] = useState(parseInt(timeSecond))
    const [timeSecondLocal, setTimeSecondLocal] = useState(timeSecond)
    const [minute, setMinute] = useState(parseInt(timeMinute))
    const [timeMinuteLocal, setTimeMinuteLocal] = useState(timeMinute)
    const [hour, setHour] = useState(parseInt(timeHour))
    const [timeHourLocal, setTimeHourLocal] = useState(timeHour)

    useEffect(() => {
        let interval = setTimeout(() => setSecond(second + 1), 1000)
        if(isRecording){
            if(second < 10){
                setTimeSecondLocal(`0${second}`)
            }
            else{
                setTimeSecondLocal(`${second}`)
            }
            if(minute < 10){
                setTimeMinuteLocal(`0${minute}`)
            }
            else{
                setTimeMinuteLocal(`${minute}`)
            }
            if(hour < 10){
                setTimeHourLocal(`0${hour}`)
            }
            else{
                setTimeHourLocal(`${hour}`)
            }
            if(second >= 59){
                setSecond(0)
                setMinute(minute + 1)
                clearInterval(interval)
            }
            if(minute > 59){
                setMinute(0)
                setHour(hour + 1)
                clearInterval(interval)
            }
        }
        else{
            updateTime(timeSecondLocal, timeMinuteLocal, timeHourLocal)
        }
    }, [second, isRecording])

    return (
        <View>
            <Text>{timeHourLocal} : {timeMinuteLocal} : {timeSecondLocal}</Text> 
        </View>
    )
}

export default TimerUp
