import React, { useState } from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { Text, Input , ThemeProvider, Button } from "react-native-elements"
import Spacer from '../components/Spacer'
import { AuthContext } from "../context/Context"
import { TextInput } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { Entypo } from '@expo/vector-icons';

const SignupScreen = ({ navigation }) => {
    const { state, signUp, clearErrorMessage } = useContext(AuthContext)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [age, setAge] = useState("")
    const [gender, setGender] = useState("male")

    const theme = {
        Button: {
          titleStyle: {
            color: 'rgb(255, 111, 97)',
          },
        },
      };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            clearErrorMessage()
        });

        return unsubscribe;
    }, [navigation]);


    return (
        <View style={styles.container}>
            <Spacer>
                <Text h3>Sign up for Dashboard</Text>
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
                <View styles={styles.smallInput}>
                    <TextInput
                        label="Firstname"
                        value={firstName}
                        onChangeText={setFirstName}
                        autoCapitalize="none"
                        autoCorrect={false}
                        mode="outlined"
                        style={{ marginBottom: 20 }}
                        theme={{ colors: { primary: "rgb(255, 111, 97)", underlineColor: 'transparent', } }}
                    />
                </View>
                <View styles={styles.smallInput}>
                    <TextInput
                        label="Lastname"
                        value={lastName}
                        onChangeText={setLastName}
                        autoCapitalize="none"
                        autoCorrect={false}
                        theme={{ colors: { primary: "rgb(255, 111, 97)", underlineColor: 'transparent', } }}
                        selectionColor="rgb(255, 111, 97)"
                        style={{ marginBottom: 20 }}
                        mode="outlined"
                    />
                </View>

                <View styles={styles.smallInput}>
                    <TextInput
                        label="Age"
                        value={age}
                        onChangeText={setAge}
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={{ marginBottom: 20 }}
                        theme={{ colors: { primary: "rgb(255, 111, 97)", underlineColor: 'transparent', } }}
                        selectionColor="rgb(255, 111, 97)"
                        mode="outlined"
                    />
                </View>
                <View styles={styles.smallInput}>
                    <TextInput
                        label="Gender"
                        value={gender}
                        mode="outlined"
                        render={() => (
                            <RNPickerSelect
                                placeholder={{label:"Select gender"}}
                                items={[
                                    { label: 'Male', value: 'male'},
                                    { label: 'Female', value: 'female'},
                                    { label: 'Other', value: 'other' },
                                ]}
                                onValueChange={value => {
                                    setGender(value)
                                }}
                                // itemKey={gender}
                                style={pickerStyles}
                                value={gender}
                                useNativeAndroidPickerStyle={false}
                                Icon={() => (
                                    <Entypo name="chevron-down" size={24} color="black" />)}
                            />
                        )}
                    />
                </View>
            </View>

            {state.errorMessage ? (
                <Text style={styles.errorMessage}>{state.errorMessage}</Text>
            ) : null}

            <View style={{marginVertical: 15}}>
                <Button
                    title={"Sign up"} 
                    onPress={() => signUp(email, password, firstName, lastName, age, gender)}
                    buttonStyle={{backgroundColor: 'rgb(255, 111, 97)'}}/>
            </View>

            <Spacer>
                <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
                    <Text style={styles.link}>
                        Already have an account? Sign in
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
        color: "rgb(255, 111, 97)"
    }
})

const pickerStyles = StyleSheet.create({
    iconContainer: {
        justifyContent: 'center',
        height: '100%',
        marginRight: 5,
    },
    inputIOS: {
        fontSize: 16,
        height: 56,
        paddingHorizontal: 14,
        color: "black",
        textAlignVertical: 'center',
        width: '100%',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        height: 56,
        paddingHorizontal: 14,
        color: "black",
        textAlignVertical: 'center',
        width: '100%',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});


export default SignupScreen
