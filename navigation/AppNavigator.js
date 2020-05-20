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
import LoginScreen              from "../screens/Login/LoginScreen";
import ResetScreen              from '../screens/Login/ResetScreen';
import TwoFactorScreen          from "../screens/Login/TwoFactorScreen";
import SignUpScreen             from "../screens/Login/SignUpScreen";
import PhoneNumberVerification  from "../screens/Login/PhoneNumberVerification";
import PasswordRecoverForm        from "../screens/Login/PasswordRecoverForm"
import PasswordResetRejection   from "../screens/Login/PasswordResetRejection"

import PhoneResetScreen         from "../screens/Login/PhoneResetScreen";
import PasswordResetScreen      from "../screens/Login/PasswordResetScreen";

//Main Screens
import HomeScreen               from "../screens/HomeScreen";

import AttributeReset           from "../screens/AttributeReset";
import ChangePasswordForm       from "../screens/ChangePasswordForm"
import ChangeEmailForm          from "../screens/ChangeEmailForm"
//Chat Screens
import ChatRoom                 from "../screens/Chat/ChatRoomScreen";
import ChatScreen               from "../screens/Chat/ChatScreen";
import CreateChatRoom           from "../screens/Chat/CreateChatRoomScreen";
import RoomSettings             from "../screens/Chat/RoomSettingsScreen";





/*---------------------Navigation Stack -----------------------------*/
//Define different pages


const RootStack = createStackNavigator({
  SignIn: {
    screen: LoginScreen,
    navigationOptions:{
      headerLeft: null,
      headerShown: false,

    }
  } ,
  SignUp: {
    screen: SignUpScreen,
    navigationOptions:{
      headerLeft: null,
      headerShown: false,
    }
  },
  Reset: {
    screen: ResetScreen,
    navigationOptions:{
      headerLeft: null,
      headerShown: false,
    }
  },
  TFS: {
    screen: TwoFactorScreen,
    navigationOptions:{
      headerLeft: null,
      headerShown: false,
    }
  },
  PNV: {
    screen: PhoneNumberVerification,
    navigationOptions:{
      headerLeft: null,
      headerShown: false,
    }
  },
  AR: {
    screen: AttributeReset,
    navigationOptions:{
      headerLeft: null,
      headerShown: false,
    }
  },
  ChangePasswordForm: {
    screen: ChangePasswordForm,
    navigationOptions:{
      headerLeft: null,
      headerShown: false,
    }
  },
  ChangeEmailForm: {
    screen: ChangeEmailForm,
    navigationOptions:{
      headerLeft: null,
      headerShown: false,
    }
  },
  PhoneReset: {
    screen: PhoneResetScreen,
    navigationOptions:{
      headerLeft: null,
      headerShown: false,
    }
  },
  PRS: {
    screen: PasswordResetScreen,
    navigationOptions:{
      headerLeft: null,
      headerShown: false,
    }
  },
  PRF: {
    screen: PasswordRecoverForm,
    navigationOptions:{
      headerLeft: null,
      headerShown: false,
    }
  },
  PRR: {
    screen: PasswordResetRejection,
    navigationOptions:{
      headerLeft: null,
      headerShown: false,
    }
  },

  User: {
    screen: HomeScreen,
    navigationOptions:{
      gesturesEnabled: true,
      headerShown: true,
    }
  },

  Home: {
    screen: ChatRoom,
    navigationOptions:{
      gesturesEnabled: false,
      headerShown: true,
    }
  },

  ChatPage: {
    screen: ChatScreen,
    navigationOptions:{

      gesturesEnabled: false,
    }
  },
  ChatRoom: {
    screen: ChatRoom,
    navigationOptions:{

      gesturesEnabled: false,
    }
  },
  makeRoom: {
    screen: CreateChatRoom,
    navigationOptions:{

      gesturesEnabled: false,
    }
  },
  RoomSettings: {
    screen: RoomSettings,
    navigationOptions:{

      gesturesEnabled: false,
    }
  },

},
{
  initialRouteName: 'SignIn',
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
