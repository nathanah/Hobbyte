// AppNavigator
// Sets up route from auth page to login to home screen 
// Called by App.js 


import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import HomeScreen from '../screens/HomeScreen';
import Login from '../screens/Login/Login';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import { createStackNavigator } from 'react-navigation-stack';

const AppStack = createStackNavigator({Home: HomeScreen});
const AuthStack = createStackNavigator({Login: Login});

export default createAppContainer(

  createSwitchNavigator({

    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html

    // User should first land on AuthLoading and then Login should appear 
    AuthLoading:AuthLoadingScreen, // comment back in once auth page is built3 hou
    App:AppStack, 
    Auth:AuthStack,

    Main: MainTabNavigator, // comment back in once auth page is built
  }, 
  {
    initialRouteName: 'AuthLoading', // comment back in once auth page is built
  })
);

