import { StatusBar } from 'expo-status-bar';
import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SigninScreen from './src/screens/SigninScreen';
import SignupScreen from './src/screens/SignupScreen';
import TrackListScreen from './src/screens/TrackListScreen';
import TrackCreateScreen from './src/screens/TrackCreateScreen';
import AccountScreen from './src/screens/AccountScreen';
import TrackDetailScreen from './src/screens/TrackDetailScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import trackerApi from "./src/api/tracker"
import { ActivityIndicator } from 'react-native';
import { useMemo } from 'react';
import { AuthContext } from "./src/context/Context"
import { useReducer } from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Provider as LocationProvider } from "./src/context/LocationContext"
import { Provider as TrackProvider } from "./src/context/TrackContext"
import { Provider as PostProvider } from "./src/context/PostContext"
import { Provider as AuthProvider } from "./src/context/AuthContext"
import { navigationRef } from './src/RootNavigation';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import DrawerContainer from "./src/screens/DrawerContainer"

import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme
} from 'react-native-paper';

import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import CustomTrackScreen from './src/screens/CustomTrackScreen';
import FeedScreen from './src/screens/FeedScreen';
import LikeScreen from './src/screens/LikeScreen';
import CommentScreen from './src/screens/CommentScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

const TrackStack = createStackNavigator();
const TrackList = ({ navigation }) => {
  return (
    <TrackStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'rgb(255, 111, 97)',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <TrackStack.Screen
        name="TrackList"
        component={TrackListScreen}
        options={{
          title: "Tracks List",
          headerLeft: () => (
            <Ionicons name="ios-menu" size={24} color="white" style={{ marginLeft: 15 }}
              onPress={() => navigation.openDrawer()}
            />
          )
        }} />
      <TrackStack.Screen
        name="TrackDetail"
        component={TrackDetailScreen} 
        options={{
          title: "Track's Details",
        }} />

      <TrackStack.Screen
        name="Feed"
        component={FeedScreen} />
    </TrackStack.Navigator>
  )
}

const AuthStack = createStackNavigator();
function AuthStackScreen() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="Signin" component={SigninScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
    </AuthStack.Navigator>
  )
}

const Drawer = createDrawerNavigator();

const HomeTab = createBottomTabNavigator();
function HomeTabScreen({ navigation }) {
  return (
    <HomeTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'TrackList') {
            iconName = "list"
            color = focused ? "black" : "grey"
          } else if (route.name === 'TrackCreate') {
            iconName = "plus";
            color = focused ? "black" : "grey"
          }
          else if (route.name === "AccountDetail") {
            iconName = "gear"
            color = focused ? "black" : "grey"
          }
          else if (route.name === "Feed") {
            iconName = "newspaper"
            color = focused ? "black" : "grey"
          }
          // You can return any component that you like here!
          if (route.name !== "Feed") {
            return <FontAwesome name={iconName} size={20} color={color} />;
          }
          else {
            return <MaterialCommunityIcons name={iconName} size={20} color={color} />;
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        keyboardHidesTabBar: Platform.OS === "ios" ? false : true
      }}
    >
      <HomeTab.Screen
        name="TrackCreate"
        component={TrackCreateStackScreen}
        options={{
          title: "Create"
        }} />
        
      <HomeTab.Screen
        name="TrackList"
        component={TrackList}
        options={{
          title: "List"
        }}
      />

      <HomeTab.Screen
        name="Feed"
        component={FeedCreateStackScreen}
        options={{
          title: "Feed"
        }} />
      <HomeTab.Screen name="AccountDetail" component={AccountStackScreen}
        options={{
          title: "Account"
        }} />

        {
          
        }
    </HomeTab.Navigator>
  );
}

const TrackCreateStack = createStackNavigator();
const AccountStack = createStackNavigator();

function TrackCreateStackScreen({ navigation }) {
  return (
    <TrackCreateStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'rgb(255, 111, 97)',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      tabBarOptions={{
        keyboardHidesTabBar: true
     }}>
      <TrackCreateStack.Screen
        name="TrackCreate"
        component={TrackCreateScreen}
        options={{
          title: "Create Track",
          headerLeft: () => (
            <Ionicons name="ios-menu" size={24} color="white" style={{ marginLeft: 15 }}
              onPress={() => navigation.openDrawer()}
            />
          )
        }}
      />
      <TrackCreateStack.Screen
        name="Track Information"
        component={CustomTrackScreen}
      />
    </TrackCreateStack.Navigator>
  )
}

const FeedCreateStack = createStackNavigator();
function FeedCreateStackScreen({ navigation }) {
  return (
    <FeedCreateStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'rgb(255, 111, 97)',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      tabBarOptions={{
        keyboardHidesTabBar: true
     }}>
      <FeedCreateStack.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          title: "Feed",
          headerLeft: () => (
            <Ionicons name="ios-menu" size={24} color="white" style={{ marginLeft: 15 }}
              onPress={() => navigation.openDrawer()}
            />
          )
        }}
      />

      <FeedCreateStack.Screen
        name="Likes"
        component={LikeScreen}
        options={{
          title: "Likes",
        }}
      />

      <FeedCreateStack.Screen
        name="Comments"
        component={CommentScreen}
        options={{
          title: "Comments",
        }}
      />
    </FeedCreateStack.Navigator>
  )
}

function AccountStackScreen({ navigation }) {
  return (
    <AccountStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'rgb(255, 111, 97)',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <AccountStack.Screen name="AccountDetail" component={AccountScreen}
        options={{
          title: "Account",
          headerLeft: () => (
            <Ionicons name="ios-menu" size={24} color="white" style={{ marginLeft: 15 }}
              onPress={() => navigation.openDrawer()}
            />
          )
        }} />
    </AccountStack.Navigator>
  )
}

export default function App({ navigation }) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333'
    }
  }

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff'
    }
  }
  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const initialLoginState = {
    isLoading: true,
    userToken: null,
    errorMessage: ""
  }
  const authReducer = (prevState, action) => {
    switch (action.type) {
      case "add_error":
        return { ...prevState, errorMessage: action.payload }
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          errorMessage: "",
          userToken: action.token,
          isLoading: false
        }
      case "SIGN_UP":
        return {
          ...prevState,
          errorMessage: "",
          userToken: action.token,
          isLoading: false
        }
      case "SIGN_IN":
        return {
          ...prevState,
          errorMessage: "",
          userToken: action.token,
          isLoading: false
        }
      case "LOG_OUT":
        return {
          ...prevState,
          errorMessage: "",
          userToken: null,
          isLoading: false
        }
      case "CLEAR_ERROR_MESSAGE":
        return {
          ...prevState,
          errorMessage: ""
        }
      default:
        return prevState
    }
  }

  const [authState, dispatch] = useReducer(authReducer, initialLoginState)

  const clearErrorMessage = () => {
    dispatch({ type: "CLEAR_ERROR_MESSAGE" })
  }

  const authContext = useMemo(() => ({
    signIn: async (email, password) => {
      try {
        const res = await trackerApi.post("/signin", { email, password })
        await AsyncStorage.setItem('token', res.data.token)
        dispatch({ type: 'SIGN_IN', token: res.data.token })
      }
      catch (err) {
        //always call dispatch to update our state
        dispatch({ type: 'add_error', payload: 'Something went wrong with Sign In. Please recheck your email and password.' })
        console.log(err.response.data)
      }
    },

    signUp: async (email, password, firstName, lastName, age, gender) => {
      try {
        const res = await trackerApi.post("/signup", { email, password, firstName, lastName, age, gender })
        await AsyncStorage.setItem('token', res.data.token)
        dispatch({ type: 'SIGN_UP', token: res.data.token })
      }
      catch (err) {
        //always call dispatch to update our state
        dispatch({ type: 'add_error', payload: 'Something went wrong with Sign Up. This username is already exist. Try a different username.' })
        console.log(err.response.data)
      }
    },

    signOut: async () => {
      try {
        await AsyncStorage.removeItem("token")
      }
      catch (e) {
        console.log(e)
      }
      dispatch({ type: "LOG_OUT" })
    },
    clearErrorMessage: clearErrorMessage,
    toggleTheme: () => {
      setIsDarkTheme(isDarkTheme => !isDarkTheme);
    },
    state: authState
  }))

  useEffect(() => {
    setTimeout(async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem("token")
        //check xem có token ko nếu có thì navigate đến homescreen
      }
      catch (e) {
        console.log(e)
      }
      dispatch({ type: "RETRIEVE_TOKEN", token: userToken })
    }, 2900)
  }, [])

  if (authState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" style={{ marginTop: 200 }} />
      </View>
    )
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <AuthProvider>
          <PostProvider>
            <TrackProvider>
              <LocationProvider>
                <AuthContext.Provider value={authContext}>
                  <NavigationContainer ref={navigationRef} theme={theme}>
                    {authState.userToken != null ? (
                      // <HomeTabScreen/>
                      <Drawer.Navigator
                        initialRouteName="TrackCreate"
                        drawerContent={props => <DrawerContainer {...props} />}>
                        <Drawer.Screen name="TrackCreate" component={HomeTabScreen} />
                      </Drawer.Navigator>
                    ) : (
                        <AuthStackScreen />
                      )}
                  </NavigationContainer>
                </AuthContext.Provider>
              </LocationProvider>
            </TrackProvider>
          </PostProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </PaperProvider>
  )
}

