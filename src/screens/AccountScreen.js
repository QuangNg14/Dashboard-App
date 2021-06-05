import React, { useState, useEffect } from 'react'
import { useContext } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, ImageBackground } from "react-native"
import { Button, Icon } from "react-native-elements"
import Spacer from '../components/Spacer'
import { AuthContext } from '../context/Context'
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from "expo-constants"
import { useIsFocused } from '@react-navigation/native'
import { Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import Animated, { set } from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import trackerApi from "../api/tracker"


const AccountScreen = () => {
  const { signOut } = useContext(AuthContext)
  const isFocused = useIsFocused()
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null)
  const [takeImage, setTakeImage] = useState(false)
  const [changedAvatar, setChangedAvatar] = useState(false)
  const [clickedAvatar, setClickedAvatar] = useState(false)
  let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dw2wkqyh5/upload'

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  useEffect(() => {
    const getCurrentUser = async () => {
      const res = await trackerApi.get("/user")
      setUser(res.data)
    }
    getCurrentUser()
  }, [image, changedAvatar, isFocused])

  useEffect(() => {
    if (image) {
      const updateImage = async () => {
        const res = await trackerApi.post(`/user/${user._id}`, { image })
      }
      updateImage()
      setChangedAvatar(!changedAvatar)
    }
  }, [image])

  useEffect(() => {
    if (image) {
      const updatePostAvatar = async () => {
        const res = await trackerApi.post(`/posts/avatar/${user._id}`, { avatar: image })
      }
      updatePostAvatar()
    }
  }, [setImage, changedAvatar])

  const pickImage = async () => {    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
      base64: true
    })

    if (result.cancelled) {
      return
    }

    let base64Img = `data:image/jpg;base64,${result.base64}`;
    let data = {
      "file": base64Img,
      "upload_preset": "iqtz1hm2",
    }
    await fetch(CLOUDINARY_URL, {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
    }).then(async r => {
      let data = await r.json()
      console.log(data.url)
      setImage(data.url)
      alert("Please refresh the screen to load avatar")
      sheetRef.current.snapTo(1)
    }).catch(err => console.log(err))
  };

  const takeImageFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
      base64: true
    });
    if (result.cancelled) {
      return
    }

    let base64Img = `data:image/jpg;base64,${result.base64}`;
    let data = {
      "file": base64Img,
      "upload_preset": "iqtz1hm2",
    }
    fetch(CLOUDINARY_URL, {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
    }).then(async r => {
      let data = await r.json()
      console.log(data.url)
      setImage(data.url);
      sheetRef.current.snapTo(1)
    }).catch(err => console.log(err))
  }

  const onClickAvatar = () => {
    setClickedAvatar(true)
  }

  const sheetRef = React.useRef(null);

  const renderInner = () => (
    <>
      {Platform.OS === "ios" ? (
        <View style={styles.panel}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.panelTitle}>Upload Photo</Text>
            <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
          </View>
          <TouchableOpacity style={styles.panelButton} onPress={takeImageFromCamera}>
            <Text style={styles.panelButtonTitle}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.panelButton} onPress={pickImage}>
            <Text style={styles.panelButtonTitle}>Choose From Library</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.panelButton}
            onPress={() => sheetRef.current.snapTo(1)}>
            <Text style={styles.panelButtonTitle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.panel}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.panelTitle}>Upload Photo</Text>
            <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
          </View>
          <Button title="Take Photo" onPress={takeImageFromCamera}/>
          <Button title="Choose From Library" onPress={pickImage}/>
          {/* <TouchableOpacity style={styles.panelButton} onPress={takeImageFromCamera}>
            <Text style={styles.panelButtonTitle}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.panelButton} onPress={pickImage}>
            <Text style={styles.panelButtonTitle}>Choose From Library</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.panelButton}
            onPress={() => sheetRef.current.snapTo(1)}>
            <Text style={styles.panelButtonTitle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </>

  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}
      >
        <View style={{
          alignItems: "center", justifyContent: "center", width: "100%", height: "10%",
          marginTop: 50
        }}>
          <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }} 
            onPress={Platform.OS === "ios" ? () => sheetRef.current.snapTo(0) : onClickAvatar}>
            <Image style={styles.image} source={{ uri: user && user.image }} />
            <Text style={{ fontWeight: "bold", marginTop: 20 }}>CHANGE AVATAR</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <View style={styles.eachLine}>
            <View style={{ width: "40%", height: "100%", justifyContent: "center", alignItems: "flex-end" }}>
              <Text style={{ fontWeight: "bold", marginRight: 20, fontSize: 16 }}>Email</Text>
            </View>
            <View style={{ width: "60%", height: "100%", justifyContent: "center" }}>
              <Text style={{ color: "#4d4d4d", fontSize: 16 }}>{user && user.email}</Text>
            </View>
          </View>

          <View style={styles.eachLine}>
            <View style={{ width: "40%", height: "100%", justifyContent: "center", alignItems: "flex-end" }}>
              <Text style={{ fontWeight: "bold", marginRight: 20, fontSize: 16 }}>Username</Text>
            </View>
            <View style={{ width: "60%", height: "100%", justifyContent: "center" }}>
              <Text style={{ color: "#4d4d4d", fontSize: 16 }}>{user && user.firstName} {user && user.lastName}</Text>
            </View>
          </View>

          <View style={styles.eachLine}>
            <View style={{ width: "40%", height: "100%", justifyContent: "center", alignItems: "flex-end" }}>
              <Text style={{ fontWeight: "bold", marginRight: 20, fontSize: 16 }}>Age</Text>
            </View>
            <View style={{ width: "60%", height: "100%", justifyContent: "center" }}>
              <Text style={{ color: "#4d4d4d", fontSize: 16 }}>{user && user.age}</Text>
            </View>
          </View>

          <View style={styles.eachLine}>
            <View style={{ width: "40%", height: "100%", justifyContent: "center", alignItems: "flex-end" }}>
              <Text style={{ fontWeight: "bold", marginRight: 20, fontSize: 16 }}>Gender</Text>
            </View>
            <View style={{ width: "60%", height: "100%", justifyContent: "center" }}>
              <Text style={{ color: "#4d4d4d", fontSize: 16 }}>{user && user.gender}</Text>
            </View>
          </View>

        </View>
      </View>
      
      <View style={{width: "100%", height: "25%", alignItems:"center"}}>
        {Platform.OS === "ios" ? (
          <BottomSheet
            ref={sheetRef}
            snapPoints={[330, 0]}
            borderRadius={10}
            renderContent={renderInner}
            callbackNode={new Animated.Value(1)}
            enabledGestureInteraction={true}
            renderHeader={renderHeader}
            initialSnap={1}
          />
        ) : (
          <>
            {clickedAvatar ? (
              <View style={{width: "100%", height: "100%", justifyContent:"space-around", display:'flex'}}>
                <Button style={{marginBottom: 10}} title="Take Photo" onPress={takeImageFromCamera}/>
                <Button style={{marginBottom: 10}} title="Choose From Library" onPress={pickImage}/>
                <Button style={{marginBottom: 10}} title="Cancel" onPress={() => setClickedAvatar(false)}/>
            </View>
            ) : null}
          </>
        )}
      </View>

      <View style={{
        justifyContent: "center", alignItems: "center",
        width: "100%", height: "8%", backgroundColor: "rgb(255, 111, 97)"
      }}>
        <TouchableOpacity onPress={signOut}>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  info: {
    height: "45%",
    width: "100%",
    marginTop: 40
  },
  eachLine: {
    width: "100%",
    height: "25%",
    flexDirection: "row"
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: Platform.OS === "ios" ? 27 : 23,
    height: Platform.OS === "ios" ? 35 : 40,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
});

export default AccountScreen
