
// HomeScreen
// Should appear after Login page
// currently displays green screen with Sign Out button

import * as WebBrowser from 'expo-web-browser';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  AsyncStorage,
  Alert,
} from 'react-native';

// import Login from './Login/';

import { MonoText } from '../components/StyledText';
import {Auth} from 'aws-amplify';
import {styles} from '../styles/styles'
import Icon from 'react-native-vector-icons/Ionicons'



/*=====================================================*/
/*            Home Screen                              */
/*=====================================================*/
export default class AttributeReset extends React.Component {
  render() {
    return (
      <View style={{backgroundColor: "#19b7bf", flex: 1}}>
      <Image
          style={styles.logo}
          source={require('../assets/images/white_logo_notext.png')}
          />
      <Text style={{
    fontSize:15,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily:'space-mono',
    textAlign:'center',
    color:'#FFF'
    }}>Reset User Information</Text>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View>
        <TouchableOpacity
        style={styles.ButtonContainer}
        activeOpacity = { .8 }
        onPress={() => this.changePassword()}
        ><View>
        <Icon name = {'ios-lock'} size = {28} color = {'rgba(255,255,255,0.7)'} style = {styles.buttonIcon} />

        <Text style={styles.signoutbuttonText}>Reset Password</Text></View>

        </TouchableOpacity>
        </View>
        <View>
            <Icon name = {'ios-mail'} size = {28} color = {'rgba(255,255,255,0.7)'} style = {styles.buttonIcon} />

        <TouchableOpacity
        style={styles.ButtonContainer}
        activeOpacity = { .8 }
        onPress={() => this.changeAttribure('email')}
        >
                <Text style={styles.signoutbuttonText}>Reset Email Adress</Text>
        </TouchableOpacity>
        </View>
        <View>
            <Icon name = {'ios-phone-portrait'} size = {28} color = {'rgba(255,255,255,0.7)'} style = {styles.buttonIcon} />

        <TouchableOpacity
        style={styles.ButtonContainer}
        activeOpacity = { .8 }
        onPress={() => this.changeAttribure('phone_number')}
        >
                <Text style={styles.signoutbuttonText}>Reset Phone Number</Text>
        </TouchableOpacity>
        </View>
        <View>
            <Icon name = {'ios-home'} size = {28} color = {'rgba(255,255,255,0.7)'} style = {styles.buttonIcon} />

        <TouchableOpacity
        style={styles.ButtonContainer}
        activeOpacity = { .8 }
        onPress={() => this.props.navigation.navigate('Home')}
        >
                <Text style={styles.signoutbuttonText}>Return to Home Page</Text>
        </TouchableOpacity>
        </View>
      </View>
      </View>
    );
  }


  /*--------------------Async------------------------*/
  changePassword = () => {
    Auth.verifyCurrentUserAttribute("phone_number").then(
      this.props.navigation.navigate("ChangePasswordForm")
    ).catch(
      (err)=>{
        console.log("error in AttribureReset: resetPassword: could not verifyCurrentUserAttribute: phone number")
        console.log("error: ", err)
      }
    )
  }

  handelChangeError = (err, callingFunction, attribute, nextPage) => {
    console.log("ERROR in, ", callingFunction, ": ", attribute)
    console.log('error: ', err)

    if(err.code == 'LimitExceededException') {
      Alert.alert("You Requested Too Many Email Verification Codes!", "Please Wait A While Before Trying Again")
    } else {
      Alert.alert("An Unspecified Error Has Occured!", "Please Try Again Some Other Time :(")
    }
    this.props.navigation.navigate("AR")
  }

  verifyCurrentUserAttribute(attribute) {
        Auth.verifyCurrentUserAttribute(attribute)
        .then(
            ()=>{
                console.log("changeEmail scuess!! Going to verify emial")
                // return true;
            }
        )
        .catch(
            (err) => {
                 this.handelChangeError(err,
                    "verifyCurrentUserAttribute",
                    attribute)
            }
        )
    }

  changeAttribure = (attribute) => {
    let next = {}
    next['attribute'] = attribute
    console.log("going to change: ", attribute)

    Auth.verifyCurrentUserAttribute('email')
        .then(
            ()=>{
                console.log("changeEmail scuess!! Going to verify emial")
                Auth.verifyCurrentUserAttribute('phone_number')
                  .then(
                      ()=>{
                          console.log("changeEmail scuess!! Going to verify emial")
                          this.props.navigation.navigate("ChangeEmailForm", next)
                      }
                  )
                  .catch(
                      (err) => {
                          this.handelChangeError(err,
                              "verifyCurrentUserAttribute",
                              'phone_number')
                      }
                  )
            }
        )
        .catch(
            (err) => {
                 this.handelChangeError(err,
                    "verifyCurrentUserAttribute",
                    'emial')
            }
        )
  }
};
AttributeReset.navigationOptions = {
  header: null,
};



/*
Make special error message for tooManyAtempts

make generic message for all other errors.
*/