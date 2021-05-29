import { useIsFocused } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { View, Text } from 'react-native'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import Post from '../components/Post'
import { Context as PostContext } from "../context/PostContext"
import * as Location from 'expo-location';
import Constants from 'expo-constants';

const FeedScreen = ({navigation}) => {
    const isFocused = useIsFocused()
    const { state, fetchPosts } = useContext(PostContext)
    const [invalidate, setInvalidate] = useState(true)
    const [isMounted, setIsMounted] = useState(true)
    const [sortedState, setSortedState] = useState([])
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        fetchPosts()
    }, [isFocused]) 

    useEffect(() => {
        if(state){
            setSortedState(state.slice().sort((a, b) => b.createdAt - a.createdAt))
        }
    }, [state])

    return (
        <SafeAreaView style={styles.container}>
            {sortedState && (
                <FlatList
                    data={sortedState}
                    extraData={sortedState}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => {
                        return (
                            <Post
                                _id={item._id}
                                name={item.name}
                                locations={item.locations}
                                totalDistanceTravelled={item.totalDistanceTravelled}
                                timeHour={item.timeHour}
                                timeMinute={item.timeMinute}
                                timeSecond={item.timeSecond}
                                markedLocations={item.markedLocations}
                                markedLocationsAddresses={item.markedLocationsAddresses}
                                averageSpeed={item.averageSpeed}
                                type={item.type}
                                sport={item.sport}
                                description={item.description}
                                commute={item.commute}
                                curHour={item.curHour}
                                curMinute={item.curMinute}
                                likes={item.likes}
                                comments={item.comments}
                                image={item.image}
                                avatar={item.avatar}
                                navigation={navigation}
                            />
                        )
                    }}
                />
            )}
            {/* <Post/> */}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width:"100%",
        flex: 1,
        backgroundColor: "hsl(0, 0%, 88%)",
        display: "flex",
        alignItems: "center"
    },
    input: {
        fontSize: 18,
        borderWidth: 1,
        borderColor: "black",
        marginBottom: 15,
        padding: 5
    },
})

export default FeedScreen
