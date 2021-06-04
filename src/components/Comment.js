import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

const Comment = (props) => {
    const {username, text, user, avatar} = props
    return (
        <View style={styles.likeContainer}>
            <View style={styles.avatar}>
                <Image style={styles.ava} source={{uri: avatar}}/>
            </View>

            <View style={styles.comment}>
                <View style={{height: "40%", width: "100%", justifyContent:"center",
                }}>
                    <Text style={{fontWeight: "bold"}}>{username.trim()}</Text>
                </View>
                <View style={{height: "50%", width: "100%", justifyContent:"center"
                }}>
                    <Text>
                        {text}
                    </Text>
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
        height: 70,
    },
    avatar:{
        width:"20%",
        height:"100%",
        alignItems:"center",
        justifyContent:"center"
    },
    comment:{
        width: "70%",
        height: "100%",
        flexWrap: 'wrap'
    },
    ava:{
        width: 50,
        height: 50,
        borderRadius: 25
    }
})
export default Comment
