import React, { useState } from 'react'
import { useContext } from 'react'
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { Text, Input, Button } from "react-native-elements"
import {AuthContext} from "../context/Context"
import Spacer from '../components/Spacer'
import AuthenticationForm from '../components/AuthenticationForm'
import { useEffect } from 'react'
import { TextInput } from 'react-native-paper';

const SigninScreen = ({navigation}) => {
    const {state, signIn, clearErrorMessage} = useContext(AuthContext)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          clearErrorMessage()
        });
    
        return unsubscribe;
      }, [navigation]);

      return (
        <View style={styles.container}>
            <Spacer>
                <Text style={{marginLeft: -15}} h3>Sign In for Dashboard</Text>
            </Spacer>
            <View styles={styles.inputContainer}>
                <View styles={styles.smallInput}>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        autoCorrect={false}
                        mode="outlined"
                        style={{ marginBottom: 20 }}
                        theme={{ colors: { primary: "rgb(255, 111, 97)", underlineColor: 'transparent', } }}
                    />
                </View>
                <View styles={styles.smallInput}>
                    <TextInput
                        secureTextEntry
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        mode="outlined"
                        style={{ marginBottom: 20 }}
                        theme={{ colors: { primary: "rgb(255, 111, 97)", underlineColor: 'transparent', } }}
                    />
                </View>
            </View>

            {state.errorMessage ? (
                <Text style={styles.errorMessage}>{state.errorMessage}</Text>
            ) : null}

            <View style={{marginVertical: 15}}>
                <Button
                    title={"Sign in"} 
                    onPress={() => signIn(email, password)}
                    buttonStyle={{backgroundColor: 'rgb(255, 111, 97)'}}/>
            </View>

            <Spacer>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                    <Text style={styles.link}>
                        Don't have an account? Sign up with email !
                    </Text>
                </TouchableOpacity>
            </Spacer>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        marginBottom: 100,
        marginHorizontal: 20
    },
    inputContainer: {
        height: "90%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    smallInput: {
        height: "20%",
        width: "100%",
        marginTop: 40
    },
    smallInputGender: {
        height: "20%",
        width: "100%"
    },
    errorMessage: {
        color: "red",
        marginLeft: 15
    },
    link: {
        color: "rgb(255, 111, 97)",
        marginLeft: -15
    }
})
export default SigninScreen
