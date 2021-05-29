import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react'
import { ImageBackground } from 'react-native';
import { View, Text, SafeAreaView, StyleSheet, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';

const WelcomeScreen = ({navigation}) => {

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, height: "60%", width: "100%", flexDirection: 'row', justifyContent: 'center', }}>
                <ImageBackground style={styles.image} source={require("../../assets/running.jpg")}>
                    <View style={styles.child} />
                    <View style={{ position: 'absolute', left: 30, bottom: 30, flex: 1 }}>
                        <Text style={{ color: "rgb(255, 111, 97)", fontWeight: "bold", fontSize: 30, marginBottom: 10 }}>Welcome to Dashboard</Text>
                        <Text style={{ color: "white", fontSize: 20 }}>We hope you enjoy the experience</Text>
                    </View>
                </ImageBackground>
            </View>

            <View style={{ height: "40%", width: "100%", justifyContent:"center", alignItems:"center"}}>
                <View style={{height:"40%", width:"90%", justifyContent:"center"}}>
                    <View style={{alignItems:"center", width:"100%"}}>
                        <Text style={{marginBottom: 20, fontSize: 16}}>Already have an account? Sign in!</Text>
                    </View>
                    <TouchableOpacity style={{
                        height: 50,
                        backgroundColor: "rgb(255, 111, 97)", alignItems: "center", justifyContent: "center",
                        borderRadius: 5
                    }}
                        onPress={() => navigation.navigate("Signin")}
                    >
                        <View>
                            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Sign In</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{height:"40%", width:"90%", justifyContent:"center"}}>
                    <View style={{alignItems:"center", width:"100%"}}>
                        <Text style={{marginBottom: 20, fontSize: 16}}>Are you a new user? Sign up with Email</Text>
                    </View>
                    <TouchableOpacity style={{
                        height: 50,
                        alignItems: "center", justifyContent: "center",
                        borderRadius: 5, borderWidth: 1
                    }}
                        onPress={() => navigation.navigate("Signup")}
                    >
                        <View>
                            <Text style={{ color: "black", fontWeight: "bold", fontSize: 16 }}>Sign Up with Email</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: "cover",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        marginHorizontal: 20
    },
    child: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    link: {
        color: "blue"
    }
})

export default WelcomeScreen
