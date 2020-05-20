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
export default class HomeScreen extends React.Component {
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
      }}>Options</Text>
        <View style={{backgroundColor: "#19b7bf", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View>
            <Icon name = {'ios-exit'} size = {28} color = {'rgba(255,255,255,0.7)'} style = {styles.buttonIcon} />

<TouchableOpacity
        style={styles.ButtonContainer}
        activeOpacity = { .8 }
        onPress={this.confirmSignOutAsync}
        >
                <Text style={styles.signoutbuttonText}>Sign out</Text>
        </TouchableOpacity>
        </View>
        {/* <Button
          title="Clear Rooms"
          onPress={() => AsyncStorage.removeItem("rooms")}
        /> */}
        <View>
            <Icon name = {'ios-mail'} size = {28} color = {'rgba(255,255,255,0.7)'} style = {styles.buttonIcon} />

        <TouchableOpacity
        style={styles.ButtonContainer}
        activeOpacity = { .8 }
        onPress={
          ()=>{
            Auth.verifyCurrentUserAttribute('email').then(()=>{
              console.log("email verification worked")
              this.props.navigation.navigate('PNV',{authType: "email"});
            }).catch(
              (err)=>{console.log("email verificatino error: ", err)
            })
          }
      }>
                <Text style={styles.signoutbuttonText}>Authenticate email</Text>
        </TouchableOpacity>
        </View>
        <View>
            <Icon name = {'ios-refresh'} size = {28} color = {'rgba(255,255,255,0.7)'} style = {styles.buttonIcon} />

        <TouchableOpacity
        style={styles.ButtonContainer}
        activeOpacity = { .8 }
        onPress={
          this._resetAttributes
      }>
                <Text style={styles.signoutbuttonText}>Reset User Information</Text>
        </TouchableOpacity>
        </View>
        </View>
      </View>
    );
  }


  /*--------------------Async------------------------*/

  confirmSignOutAsync = async () => {
    Alert.alert(
      'Confirm Sign Out',
      'Are you sure you want to sign out? This will wipe all locally stored files including all conversation history.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this._signOutAsync() },
      ],
      { cancelable: false }
    );
  }

  _signOutAsync = async () => {
    // TODO - clear Async storage
    await AsyncStorage.clear();
    Auth.signOut()
    .then(() => {
      console.log("Signed Out");
      AsyncStorage.clear();
      this.props.navigation.navigate('SignIn'); // not redirecting for some reason
    })
    .catch(err => console.log('error confirming signing out!: ', err));
  };


  _resetAttributes = async ()=> {
    Auth.currentAuthenticatedUser().then(
      (user) => {
        console.log("{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}")
        console.log(user.attributes)
        console.log("type: ", typeof("hello"))
        // Auth.userAttributes(user).then(
        //   (attribures) => {
        //     console.log(attribures)
        //   }
        // ).catch(err=>console.log(err))
        this.props.navigation.navigate('AR');
      }
    ).catch(err=>console.log(err));

  }
}
