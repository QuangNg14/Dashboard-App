import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Image } from "react-native"
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer"
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from "../context/Context"
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
  useTheme
} from "react-native-paper"
import { useContext } from 'react';
import trackerApi from "../api/tracker"
const DrawerContainer = (props) => {
  const paperTheme = useTheme();
  const { signOut, toggleTheme } = useContext(AuthContext)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getCurrentUser = async () => {
      const res = await trackerApi.get("/user")
      setUser(res.data)
    }
    getCurrentUser()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
              <Image
                source={{
                  uri: user && user.image
                }}
                style={{ width: 50, height: 50, borderRadius: 25 }}
              />
              <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                <Title style={styles.title}>{user && user.firstName} {user && user.lastName}</Title>
                <Caption style={styles.caption}>{user && user.email}</Caption>
              </View>
            </View>

            {/* <View style={styles.row}>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>14</Paragraph>
                <Caption style={styles.caption}>Following</Caption>
              </View>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>92</Paragraph>
                <Caption style={styles.caption}>Followers</Caption>
              </View>
            </View> */}
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              )}
              label="Home"
              onPress={() => { props.navigation.navigate('TrackList') }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons name="account-outline" size={size} color={color} />
              )}
              label="Account"
              onPress={() => { props.navigation.navigate('AccountDetail') }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Ionicons name="create-outline" size={size} color={color} />
              )}
              label="Create Track"
              onPress={() => { props.navigation.navigate('TrackCreate') }}
            />

            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons name="newspaper" size={size} color={color} />
              )}
              label="Feed"
              onPress={() => { props.navigation.navigate('Feed') }}
            />
            {user && user.email == "admindashboard@gmail.com" ? (
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialCommunityIcons name="newspaper" size={size} color={color} />
                )}
                label="Admin"
                onPress={() => { props.navigation.navigate('Feed') }}
              />
            ):null}
          </Drawer.Section>
          {/* <Drawer.Section title="Preferences">
            <TouchableRipple onPress={() => { toggleTheme() }}>
              <View style={styles.preference}>
                <Text>Dark Theme</Text>
                <View pointerEvents="none">
                  <Switch value={paperTheme.dark} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section> */}
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          label="@Product by Quang Nguyen"
        />
      </Drawer.Section>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <MaterialIcons name="exit-to-app" size={size} color={color} />
          )}
          label="Sign out"
          onPress={signOut}
        />
      </Drawer.Section>
    </View>
  )
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default DrawerContainer
