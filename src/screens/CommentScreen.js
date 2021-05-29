import React, { useContext, useEffect, useRef, useState } from 'react'
import { Text, View, TextInput, KeyboardAvoidingView, Keyboard, Dimensions } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import trackerApi from "../api/tracker"
// import { TextInput } from 'react-native-paper';
import { Context as PostContext } from "../context/PostContext"
import Comment from "../components/Comment"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const CommentScreen = ({route}) => {
    const {_id, user, comments, avatar} = route.params
    const [getCommentsAPI, setGetCommentsAPI] = useState([])
    const {commentPost} = useContext(PostContext)
    const [commentText, setCommentText] = useState("")
    const [clicked, setClicked] = useState(false)
    const [isMounted, setIsMounted] = useState(true)
    const [commented, setCommented] = useState(false)

    const [keyboardOffset, setKeyboardOffset] = useState(0);
    const onKeyboardShow = event => setKeyboardOffset(event.endCoordinates.height - Dimensions.get('window').height*1/15);
    const onKeyboardHide = () => setKeyboardOffset(0);
    const keyboardDidShowListener = useRef();
    const keyboardDidHideListener = useRef();

    useEffect(() => {
        keyboardDidShowListener.current = Keyboard.addListener('keyboardWillShow', onKeyboardShow);
        keyboardDidHideListener.current = Keyboard.addListener('keyboardWillHide', onKeyboardHide);
      
        return () => {
          keyboardDidShowListener.current.remove();
          keyboardDidHideListener.current.remove();
        };
      }, []);

    const onCommentPost = async () => {
        setCommentText("")
        await commentPost(_id,
            getCommentsAPI.concat([{"userId": user._id,
            "username":`${user.firstName} ${user.lastName}`, "text":commentText, "avatar": user.image}]))
        setCommented(true)
    }

    useEffect(() => {
        const getCommentsInPost = async (postId) => {
            try{
                const res = await trackerApi.get(`/posts/comment/${postId}`)
                setGetCommentsAPI(res.data)
                setClicked(true)
            }
            catch(err){
                console.log(err)
            }
        }
        getCommentsInPost(_id)
    }, [isMounted, clicked, commented])

    return (
    <View style={{ flex: 1 }}>
        <View style={{width: "100%", height: "92%"}}>
            {getCommentsAPI && (
                <FlatList
                    data={getCommentsAPI}
                    extraData={getCommentsAPI}
                    keyExtractor={(item) => item._id}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) => {
                        return (
                            <Comment username={item.username} text={item.text} user={user} avatar={item.avatar}/>
                        )
                    }}
                />
                )}
            </View>

            <View style={{width: "100%", height: "8%", flexDirection:"row",
            borderColor: "rgba(140, 140, 140, 0.5)", backgroundColor:"white",
            borderBottomWidth: 0.2, borderTopWidth: 1, position: 'absolute', bottom: keyboardOffset}}>
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">

                <View style={{width: "80%", height: "100%",
             justifyContent:"center", alignItems:"center"}}>
                    <TextInput 
                    placeholder="Add a comment"
                    value={commentText}
                    onChangeText={setCommentText}
                    autoCorrect={false}
                    autoCapitalize="none"
                    autoCompleteType="off"
                    style={{height: "100%", fontSize: 18, width: "100%", marginLeft: 20}}
                    onSubmitEditing={Keyboard.dismiss}
                    />
                </View>
                </KeyboardAvoidingView>
                <View style={{width: "20%", height: "100%",
                 justifyContent:"center", alignItems:"center"}}>
                     <TouchableOpacity onPress={() => onCommentPost(commentText)}>
                        <Text style={{fontWeight:"bold"}}>SEND</Text>
                     </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default CommentScreen
