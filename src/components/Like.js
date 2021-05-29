import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'; 

const Like = (props) => {
    const {username, user, avatar} = props
    return (
        <View style={styles.likeContainer}>
            <View style={styles.avatar}>
                <Image style={styles.ava} 
                    source={{uri: avatar}}
                />
            </View>

            <View style={styles.comment}>
                <View style={{height: "40%", width: "100%", justifyContent:"center",
                alignItems:"center"}}>
                    <Text style={{fontWeight:"bold"}}>{username}</Text>
                </View>
                <View style={{height: "40%", width: "100%", justifyContent:"center",
                }}>
                    <AntDesign name="like2" size={20} color="black" />
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    likeContainer: {
        width: "100%",
        flex: 1,
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        flexDirection:"row",
        marginTop: 20,
        height: 70
    },
    avatar:{
        width:"20%",
        height:"100%",
        alignItems:"center",
        justifyContent:"center"
    },
    ava:{
        width: 50,
        height: 50,
        borderRadius: 25
    }
})
export default Like
