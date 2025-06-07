import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebaseConfig from './firebaseConfig.json';
import { initializeApp } from "firebase/app";
import { Login } from './screens/Login';
import { Home } from './screens/Home';
import {Profile}  from './screens/Profile';
import { MaterialCommunityIcons, AntDesign, Fontisto } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Preload resources or make API calls
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const loadFonts = async () => {
    await Font.loadAsync({
      // Load Fontisto font
      Fontisto: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Fontisto.ttf'),
      fontawesomee: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome.ttf'),
    });
  };

  if (!appIsReady) {
    return null;
  }

  return (
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        {user ? (
          <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: 'black',
              tabBarLabelStyle: {
                fontSize: 12,
              },
              tabBarStyle: {
                height: 50,
              },
            }}
          >
            <Tab.Screen 
              name="Home" 
              component={Home} 
              options={{ 
                headerTitle: "",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="view-dashboard-outline" color={color} size={25} />
                ),
              }}
            />
            <Tab.Screen 
              name="Profile" 
              component={Profile} 
              options={{
                headerTitle: "",
                tabBarIcon: ({ color }) => (
                  <AntDesign name="user" color={color} size={25} />
                ),
              }}
            />
          </Tab.Navigator>
        ) : (
          <Login />
        )}
      </NavigationContainer>
  );
}