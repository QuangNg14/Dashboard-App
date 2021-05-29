import React from 'react'
import Spacer from '../components/Spacer'
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { Text, Input, Button } from "react-native-elements"
import { useState } from 'react'

const AuthenticationForm = (props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {navigation, state, headerText, button, authFunc, screen, navLink} = props
    return (
        <>
            <Spacer>
                <View style={{marginLeft: -5, marginBottom: 20}}>
                    <Text h3>{headerText}</Text>
                </View>
            </Spacer>
            <Input 
                label="Email" 
                value={email} 
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                />
                <Spacer />
            <Input 
                secureTextEntry
                label="Password" 
                value={password} 
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
            />
            {state.errorMessage ? (
                <Text style={styles.errorMessage}>{state.errorMessage}</Text> 
            ): null}

            <Spacer>
                <Button 
                    title={button} 
                    onPress={() => authFunc(email, password)} />
            </Spacer>

            <Spacer>
                <TouchableOpacity onPress={() => navigation.navigate(screen)}>
                    <Text style={styles.link}>
                        {navLink}
                    </Text> 
                </TouchableOpacity>
            </Spacer>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: "center",
        marginBottom: 200,
        marginHorizontal: 20     
    },
    errorMessage:{
        color: "red",
        marginLeft: 15
    },
    link:{
        color: "blue"
    }
})

export default AuthenticationForm
