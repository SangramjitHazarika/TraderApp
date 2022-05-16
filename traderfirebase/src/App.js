/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import LoginScreen from './screens/LoginScreen'
import SignupScreen from './screens/SignupScreen'
import CreateAdScreen from './screens/CreateAdScreen'
import HomeScreen from './screens/ListItemScreen'
import AccountScreen from './screens/AccountScreen'
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather'
import auth from '@react-native-firebase/auth'


import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
   
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { DefaultTheme as DefaultThemeNav } from '@react-navigation/native';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: 'deepskyblue'
  },
};

const MyTheme = {
  ...DefaultThemeNav,
  colors: {
    ...DefaultThemeNav.colors,
    background: 'white',
  },
};



const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();
const AuthNavigator = ()=>{
    return(
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Signup" component={SignupScreen} options={{headerShown:false}}/>
      </Stack.Navigator>
    )
}


const TabNavigator=()=>{
  return(
    // <NavigationContainer>
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home'
          } else if(route.name === 'Create') {
            iconName = 'plus-circle'
          } else if(route.name === 'Account'){
            iconName = 'user'
          }

          // You can return any component that you like here!
          return <View style={{borderWidth:15, borderColor:"white", borderRadius:30}}><Feather name={iconName} size={23} color={color} /></View>
        },
      })}
      tabBarOptions={{
        activeTintColor: 'deepskyblue',
        inactiveTintColor: 'gray',
      }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Create" component={CreateAdScreen} />
        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>
    // </NavigationContainer>
  )
}

const Navigation = () =>{
  const [user, setUser] = useState('')

  useEffect(()=>{
    const unsubscribe = auth().onAuthStateChanged((userExist)=>{
      if(userExist) {
        setUser(userExist)
      } else {
        setUser("")
      }
    })
    return unsubscribe // for unregister on exiting from app 
  },[])

  return(
    <NavigationContainer theme={MyTheme}>
      {user?<TabNavigator/>:<AuthNavigator/>}
    </NavigationContainer>
  )
}

const App = () => {
  // useEffect(()=>{
  //   messaging().getToken().then(token=>{
  //     console.log(token)
  //   })
  // },[])
  return(
    <>
    <PaperProvider theme={theme}>
      <StatusBar barStyle="dark-content" backgroundColor="deepskyblue"/>
      <View style={styles.container}>
          {/* <LoginScreen /> */}
          {/* <SignupScreen /> */}
          {/* <CreateAdScreen/> */}
          {/* <HomeScreen/> */}
          <Navigation/>

      </View>
      </PaperProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container:{
    backgroundColor: '#fff',
    flex: 1,
  }
});

export default App;
