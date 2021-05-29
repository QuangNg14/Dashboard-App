import { useIsFocused } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import trackerApi from "../api/tracker"
import Like from '../components/Like'

const LikeScreen = ({route}) => {
    const {_id, user, avatar} = route.params
    const [likes, setLikes] = useState([])
    const [clicked, setClicked] = useState(false)
    const [isMounted, setIsMounted] = useState(true)
    const isFocused = useIsFocused()
    useEffect(() => {
        const getLikesInPost = async (postId) => {
            try{
                const res = await trackerApi.get(`/posts/like/${postId}`, {likes, postId})
                setLikes(res.data)
                setClicked(true)
            }
            catch(err){
                console.log(err)
            }
        }
        getLikesInPost(_id)
    }, [clicked, isFocused])

    return (
        <View style={{flex: 1, backgroundColor:"#f2f2f2"}}>
            {likes && (
                <FlatList
                    data={likes}
                    extraData={likes}
                    keyExtractor={(item) => item._id}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) => {
                        return (
                            <Like username={item.username} user={user} avatar={item.avatar}/>
                        )
                    }}
                />
                )}
        </View>
    )
}

export default LikeScreen
