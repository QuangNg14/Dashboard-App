import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons'
import React, { useContext, useEffect } from 'react'
import { Image, StyleSheet, Text, View, Share } from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { reverseGeocodeAsync } from "expo-location"
import { useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import trackerApi from "../api/tracker"
import { Context as PostContext } from "../context/PostContext"
import Modal from 'react-native-modal';
import { Platform } from 'react-native'

const AdminPost = (props) => {
    const { _id, name, locations, totalDistanceTravelled, timeHour, timeMinute, timeSecond,
        markedLocations, markedLocationsAddresses, averageSpeed,
        type, sport, description, commute, curHour, curMinute, likes, comments, image, avatar, verified, navigation } = props

    const { likePost, deletePost, rejectPost, approvePost } = useContext(PostContext)
    const initialLocation = locations.length ? locations[0].coords : {
        latitude: 37.33233141,
        longitude: -122.0312186,
    }
    const lastLocation = locations.length ? locations[locations.length - 1].coords : {
        latitude: 37.33233141,
        longitude: -122.0312186,
    }
    const [firstLocation, setFirstLocation] = useState("")
    const [finalLocation, setFinalLocation] = useState("")
    const [deleted, setDeleted] = useState(false)
    useEffect(() => {
        const getReverseAddress = async () => {
            const res = await reverseGeocodeAsync(initialLocation)
            const res2 = await reverseGeocodeAsync(lastLocation)
            setFirstLocation(res[0])
            setFinalLocation(res2[0])
        }
        getReverseAddress()
    },[])


    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisible2, setModalVisible2] = useState(false)
    const [isModalVisible3, setModalVisible3] = useState(false)
    const [curAddress, setCurAddress] = useState({})
    const [user, setUser] = useState(null)
    const [thisPost, setThisPost] = useState(null)
    const [uniqueValue, setUniqueValue] = useState(0)

    const toggleModal = () => {
        setModalVisible(!isModalVisible)
    }

    const toggleModal2 = () => {
        setModalVisible2(!isModalVisible2)
    }

    const toggleModal3 = () => {
        setModalVisible3(!isModalVisible3)
    }

    //_id là postId
    const onLikePost = () => {
        const currentLikes = likes.map((like) => like.userId)
        if (!currentLikes.includes(user._id)) {
            likePost(_id, likes.concat([{ "userId": user._id, "username": `${user.firstName} ${user.lastName}`,
        "avatar": user.image }]))
        }
        navigation.navigate("Likes", { _id, user, avatar })
    }

    const onCommentPost = () => {
        navigation.navigate("Comments", { _id, user, comments, avatar })
    }

    const handleDeletePost = () => {
        if (thisPost.userId == user._id) {
            deletePost(_id)
            toggleModal()
            navigation.navigate("Feed")
        }
        else {
            alert("You are not authorized")
        }
    }

    const handleApprovePost = () => {
        approvePost(_id)
        toggleModal2()
    }

    const handleRejectPost = () => {
        rejectPost(_id)
        toggleModal3()
    }

    const onSharePost = async () => {
        try {
            const result = await Share.share({
                message: `I have done an exercise going ${Math.round(totalDistanceTravelled * 100) / 100} km with average pace ${Math.round(averageSpeed * 10) / 10} km/h in ${timeHour}:${timeMinute}:${timeSecond}`,
                uri: image
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        const getCurrentUser = async () => {
            const res = await trackerApi.get("/user")
            setUser(res.data)
        }
        getCurrentUser()
    }, [])

    useEffect(() => {
        const getCurrentPost = async () => {
            const res = await trackerApi.get(`/posts/${_id}`)
            setThisPost(res.data)
        }
        getCurrentPost()
    }, [])

    useEffect(() => {
        const getReverseAddress = async () => {
            const res = await reverseGeocodeAsync(initialLocation)
            setCurAddress(res[0])
        }
        getReverseAddress()
    }, [])

    return (
        <View style={styles.postContainer} key={uniqueValue}>
            <View style={styles.topInfo}>
                <View style={{
                    width: "20%", height: "100%", justifyContent:
                        'center', alignItems: "center", marginRight: 10
                }}>
                    <Image
                        style={{ width: 60, height: 60, borderRadius: 30 }}
                        source={{uri: avatar && avatar}}
                    />
                </View>
                <View style={{ width: "50%", height: "90%" }}>
                    <View style={{ width: "100%", height: "50%", justifyContent: "center" }}>
                        <Text style={{ fontWeight: "bold", fontSize: Platform.OS === "ios" ? 14 : 12 }}>{name}</Text>
                    </View>
                    <View style={{ width: "100%", height: "50%", fontSize: Platform.OS === "ios" ? 14 : 12 }}>
                        <Text>{type} at {curHour}:{curMinute} {Platform.OS === "ios" ? `at ${curAddress && curAddress.name} in ${curAddress && curAddress.city}`: `at ${curAddress ? curAddress.street : null}`}</Text>
                    </View>
                </View>
                <View style={{
                    width: "30%", height: "100%", justifyContent: "center",
                    alignItems: "center", flexDirection:"row"
                }}>

                    <TouchableOpacity onPress={toggleModal2}>
                        <AntDesign name="checkcircleo" size={24} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={toggleModal3}>
                        <Entypo name="circle-with-cross" size={30} color="black" />
                    </TouchableOpacity>
   
                    <TouchableOpacity onPress={toggleModal}>
                        <Ionicons name="remove-circle-outline" size={30} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setModalVisible(false)}
                style={{
                    display: "flex", justifyContent: "center",
                    alignItems: "center"
                }}>
                <View style={{
                    backgroundColor: "white", width: "80%", 
                    height: Platform.OS === "ios" ? "15%" : "20%", flexDirection: "column"
                }}>
                    <View style={{ height: "30%", width: "100%", alignItems: "center", justifyContent: "flex-end" }}>
                        <Text style={{ fontSize: Platform.OS === "ios" ? 16 : 14, fontWeight: "bold" }}>Do you want to delete this post?</Text>
                    </View>
                    <View style={{
                        flexDirection: "row", width: "100%", height: "70%", justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <View style={{
                            width: "40%", height: "50%", backgroundColor: "rgb(255, 111, 97)", justifyContent: "center", marginRight: 20,
                            alignItems: "center"
                        }}>
                            <TouchableOpacity onPress={handleDeletePost}>
                                <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            width: "40%", height: "50%", justifyContent: "center",
                            alignItems: "center", borderWidth: 1
                        }}>
                            <TouchableOpacity onPress={toggleModal}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            <Modal
                isVisible={isModalVisible2}
                onBackdropPress={() => setModalVisible2(false)}
                style={{
                    display: "flex", justifyContent: "center",
                    alignItems: "center"
                }}>
                <View style={{
                    backgroundColor: "white", width: "80%", 
                    height: Platform.OS === "ios" ? "15%" : "20%", flexDirection: "column"
                }}>
                    <View style={{ height: "30%", width: "100%", alignItems: "center", justifyContent: "flex-end" }}>
                        <Text style={{ fontSize: Platform.OS === "ios" ? 16 : 14, fontWeight: "bold" }}>Do you want to delete this post?</Text>
                    </View>
                    <View style={{
                        flexDirection: "row", width: "100%", height: "70%", justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <View style={{
                            width: "40%", height: "50%", backgroundColor: "rgb(51, 204, 51)", justifyContent: "center", marginRight: 20,
                            alignItems: "center"
                        }}>
                            <TouchableOpacity onPress={handleApprovePost}>
                                <Text style={{ color: "white", fontWeight: "bold" }}>Approve</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            width: "40%", height: "50%", justifyContent: "center",
                            alignItems: "center", borderWidth: 1
                        }}>
                            <TouchableOpacity onPress={toggleModal2}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                isVisible={isModalVisible3}
                onBackdropPress={() => setModalVisible3(false)}
                style={{
                    display: "flex", justifyContent: "center",
                    alignItems: "center"
                }}>
                <View style={{
                    backgroundColor: "white", width: "80%", 
                    height: Platform.OS === "ios" ? "15%" : "20%", flexDirection: "column"
                }}>
                    <View style={{ height: "30%", width: "100%", alignItems: "center", justifyContent: "flex-end" }}>
                        <Text style={{ fontSize: Platform.OS === "ios" ? 16 : 14, fontWeight: "bold" }}>Do you want to delete this post?</Text>
                    </View>
                    <View style={{
                        flexDirection: "row", width: "100%", height: "70%", justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <View style={{
                            width: "40%", height: "50%", backgroundColor: "red", justifyContent: "center", marginRight: 20,
                            alignItems: "center"
                        }}>
                            <TouchableOpacity onPress={handleRejectPost}>
                                <Text style={{ color: "white", fontWeight: "bold" }}>Reject</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            width: "40%", height: "50%", justifyContent: "center",
                            alignItems: "center", borderWidth: 1
                        }}>
                            <TouchableOpacity onPress={toggleModal3}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.description}>
                {description ? (
                    <Text style={{ fontSize: 15, marginHorizontal: 12 }}>{description}</Text>
                ) : (
                        <Text style={{ fontSize: 15, marginHorizontal: 12, fontWeight: "bold" }}>{type}</Text>
                    )}
                <Text style={{fontSize: 16, fontWeight:"bold"}}>{verified ? "Verified" : "Not Verified"}</Text>
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.left}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>PACE</Text>
                    </View>
                    <View style={styles.numberContainer}>
                        {/* <Text style={styles.numberStyle}>{Math.round(averageSpeed * 10) / 10}</Text> */}
                        <Text>{Math.round(averageSpeed * 10) / 10} KM/H</Text>
                    </View>
                </View>

                <View style={styles.middle}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>DISTANCE</Text>
                    </View>
                    <View style={styles.numberContainer}>
                        {/* <Text style={styles.numberStyle}>{Math.round(totalDistanceTravelled * 100) / 100}</Text> */}
                        <Text>
                            {Math.round(totalDistanceTravelled * 100) / 100} KM
                        </Text>
                    </View>
                </View>

                <View style={styles.right}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>TIME</Text>
                    </View>
                    <View style={styles.numberContainerRight}>
                        {/* <Text style={styles.numberStyle}>{timeHour} : {timeMinute} : {timeSecond}</Text> */}
                        <Text>{timeHour} : {timeMinute} : {timeSecond}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.map}>
                {image ? (
                    <Image source={{ uri: image }} style={{ height: "100%", width: "100%" }} />
                ) : (<MapView
                    style={{ height: "100%" }}
                    initialRegion={{
                        ...initialLocation,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                // region={{
                //     ...initialLocation,
                //     latitudeDelta: 0.01,
                //     longitudeDelta: 0.01,
                // }}

                >
                    <Polyline
                        coordinates={locations.map(t => t.coords)}
                        strokeWidth={5}
                        strokeColor="rgb(255, 111, 97)"
                        fillColor="rgb(255, 111, 97)"
                    />
                    <Marker
                        coordinate={{
                            ...initialLocation
                        }}
                        title="This is your start point"
                        description={`${firstLocation.name} on ${firstLocation.street} ${firstLocation.city}`}
                        key="start"
                    >
                        <Image source={{uri: "https://smarttrain.edu.vn/assets/uploads/2017/10/678111-map-marker-512.png"}}
                            style={{ width: 40, height: 40 }}
                            resizeMethod="resize"
                        />
                    </Marker>

                    <Marker
                        coordinate={{
                            ...lastLocation
                        }}
                        title="This is your end point"
                        description={`${finalLocation.name} on ${finalLocation.street} ${finalLocation.city}`}
                        key="end"
                    >
                        <Image source={{uri: "https://smarttrain.edu.vn/assets/uploads/2017/10/678111-map-marker-512.png"}}
                            style={{ width: 40, height: 40 }}
                            resizeMethod="resize"
                        />
                    </Marker>
                    {/* {markedLocations && markedLocations.map((location, key) => (
                        <Marker
                            coordinate={{
                                ...location.coords
                            }}
                            title="This place's address is"
                            description={markedLocationsAddresses[key]}
                            key={key}
                        >
                            <Image source={require("../../assets/map-marker.png")}
                                style={{ width: 40, height: 40 }}
                                resizeMode="center"
                                resizeMethod="resize"
                            />
                        </Marker>
                    ))} */}
                </MapView>)}
            </View>
            <View style={{ width: "100%", height: "3%", alignItems: "center" }}></View>
            <View style={styles.likeComment}>
                <View style={{
                    width: "33.33%", height: "70%", borderColor: "rgba(140, 140, 140, 0.5)",
                    borderRightWidth: 0.3, justifyContent: "center", alignItems: "center"
                }}>
                    <TouchableOpacity onPress={onLikePost}>
                        <AntDesign name="like2" size={20} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={{
                    width: "33.33%", height: "70%", borderColor: "rgba(140, 140, 140, 0.5)",
                    borderRightWidth: 0.3, justifyContent: "center", alignItems: "center"
                }}>
                    <TouchableOpacity onPress={onCommentPost}>
                        <MaterialCommunityIcons name="comment-text-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={{ width: "33.33%", height: "70%", justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={onSharePost}>
                        <SimpleLineIcons name="share-alt" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    postContainer: {
        width: "100%",
        height: 550,
        backgroundColor: "white",
        display: "flex",
        marginTop: 20
    },
    topInfo: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        height: "15%",

    },
    description: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        height: "12%",
        alignItems: "center",
    },

    //////////////////////Info container
    infoContainer: {
        width: "80%",
        display: "flex",
        flexDirection: "row",
        height: "10%"
    },
    headerContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        height: "40%",
    },
    numberContainer: {
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: "60%",
        marginHorizontal: 12,
    },
    numberContainerRight: {
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: "60%",
        marginHorizontal: 12,
    },
    left: {
        display: "flex",
        flexDirection: "column",
        width: "30%",
        height: "80%",
        borderColor: "rgba(140, 140, 140, 0.5)",
        borderRightWidth: 0.3
    },
    middle: {
        display: "flex",
        flexDirection: "column",
        width: "30%",
        height: "80%",
        borderColor: "rgba(140, 140, 140, 0.5)",
        borderRightWidth: 0.3
    },
    right: {
        display: "flex",
        flexDirection: "column",
        width: "40%",
        height: "80%"
    },
    numberStyle: {
        fontSize: Platform.OS === "ios" ? 14 : 13,
        fontWeight: 'bold'
    },
    textStyle: {
        fontSize: Platform.OS === "ios" ? 14 : 13
    },
    headerText: {
        fontSize: Platform.OS === "ios" ? 12 : 10,
        marginHorizontal: 12,
        color: "#b3b3b3"
    },
    /////////////////////// end infocontainer
    map: {
        width: "100%",
        height: "50%"
    },
    likeComment: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        backgroundColor: "hsl(0, 0%, 94%)",
        height: "10%",
        justifyContent: "center",
        alignItems: "center"
    },

})

export default AdminPost
