// AppNavigator
// Sets up route from auth page to login to home screen
// Called by App.js

/*=====================================================*/
// TO DO
// - Add async functions for obtaining user input and verifying identity
// - remove back button in default header
// - fix spinning/slow auth page
// -
/*=====================================================*/
import * as React from 'react';
import { Button, View, Text, TouchableOpacity, StyleSheet,  TextInput } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import AuthLoadingScreen from "../screens/AuthLoadingScreen";
import LoginScreen from "../screens/Login/LoginScreen";
import MainScreen from "../screens/MainScreen";
import ResetScreen from '../screens/Login/ResetScreen';
import TwoFactorScreen from "../screens/Login/TwoFactorScreen"
import PhoneNumberVerification from "../screens/Login/PhoneNumberVerification";
import PhoneResetScreen from "../screens/Login/PhoneResetScreen";
import HomeScreen from "../screens/HomeScreen";
import SignUpScreen from "../screens/Login/SignUpScreen";
import ChatScreen from "../screens/Chat/ChatScreen";
// import ChatRoom from "../screens/Chat/ChatRoomScreen"; 




/*---------------------Navigation Stack -----------------------------*/

//Define different pages
const RootStack = createStackNavigator({
  AuthLoading: AuthLoadingScreen,
  //once authloade is loaded, gets taken to see if signed in. if yes, goes to log in screen.else goes to home
  SignIn: LoginScreen,
  SignUp: SignUpScreen,
  Home: HomeScreen,
  Main: MainScreen,
  Reset: ResetScreen,
  TFS: TwoFactorScreen,
  PNV: PhoneNumberVerification,
  PhoneReset: PhoneResetScreen,
  ChatPage: ChatScreen,
  // ChatRoom: ChatRoom, // not working 
},
{
  initialRouteName: 'AuthLoading',
}
);

/*----------------------Styles    ----------------------------*/
const styles = StyleSheet.create ({
  container:{
    flex:1,
    backgroundColor:'#FFDFD3'
  },

  buttonText:{
    textAlign:'center',
    color:'#FFF',
    fontWeight: "600",
    backgroundColor:'#db8a75',
    padding:20,
    paddingBottom: 30,

},
  formBox:{
    height: 45,
    backgroundColor: '#FFF',
    marginBottom: 20,
    paddingHorizontal: 20,

  },
  })

  /*-----------------------Export default ---------------------------*/
  export default createAppContainer(RootStack);
