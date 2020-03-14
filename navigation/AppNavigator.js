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
import { createBottomTabNavigator} from 'react-navigation-tabs';
import {Icon} from 'react-native-elements';

//Import screens
//Login Screens
import AuthLoadingScreen        from "../screens/AuthLoadingScreen";
import LoginScreen              from "../screens/Login/LoginScreen";
import ResetScreen              from '../screens/Login/ResetScreen';
import TwoFactorScreen          from "../screens/Login/TwoFactorScreen";
import SignUpScreen             from "../screens/Login/SignUpScreen";
import PhoneNumberVerification  from "../screens/Login/PhoneNumberVerification";
import PhoneResetScreen         from "../screens/Login/PhoneResetScreen";
import PasswordResetScreen      from "../screens/Login/PasswordResetScreen";

//Main Screens
import MainScreen               from "../screens/MainScreen";
import HomeScreen               from "../screens/HomeScreen";

//Chat Screens
import ChatRoom                 from "../screens/Chat/ChatRoomScreen";
import ChatScreen               from "../screens/Chat/ChatScreen";
import CreateChatRoom           from "../screens/Chat/CreateChatRoomScreen";
import RoomSettings             from "../screens/Chat/RoomSettingsScreen";



/*---------------------Navigation Tabs -----------------------------*/
const bottomTabNavigator = createBottomTabNavigator(
    {
      Start: {
        screen: HomeScreen,
        navigationOptions: {
          headerLeft: null,
          tabBarIcon: ({ tintColor }) => (
            <Icon name="home" size={25} color={tintColor} />
          )
        }
      },
      List: {
        screen: ChatRoom,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <Icon name="chat" size={25} color={tintColor} />
          )
        }
    },

    },
    {
      initialRouteName: 'Start',
      tabBarOptions: {
        activeTintColor: '#eb6e3d'
      }
    }
  );


/*---------------------Navigation Stack -----------------------------*/
//Define different pages
const RootStack = createStackNavigator({
  AuthLoading: AuthLoadingScreen,
  //once authloade is loaded, gets taken to see if signed in. if yes, goes to log in screen.else goes to home
  SignIn: {
    screen: LoginScreen,
    navigationOptions:{
      headerLeft: null,
    }
  } ,
  SignUp: SignUpScreen,
  Reset: ResetScreen,
  TFS: TwoFactorScreen,
  PNV: PhoneNumberVerification,
  PhoneReset: PhoneResetScreen,
  PRS: PasswordResetScreen,

  Home: {
    screen: bottomTabNavigator,
    navigationOptions:{
      headerLeft: null,
      gesturesEnabled: false,
    }
  } ,
  Main: {
    screen: bottomTabNavigator,
    navigationOptions:{
      headerLeft: null,
      gesturesEnabled: false,
    }
  } ,


  ChatPage: ChatScreen,
  ChatRoom: ChatRoom,
  makeRoom: CreateChatRoom,
  RoomSettings: RoomSettings,
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
