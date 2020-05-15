import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, Keyboard, ScrollView, AsyncStorage } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import {styles} from '../../styles/styles'
import { EThree } from '@virgilsecurity/e3kit-native';
import io from 'socket.io-client';

async function setUpEkit(tokenObj){
  console.log("initializing user...");
  EThree.initialize(tokenObj.data)
  .then(e3kit => {
    showMessage('e3kit ready for identity: ' + e3kit.identity);
    e3kit.register();

  });
}
async function setUpSocket(username) {
  console.log("username now: " + username); 
    'use strict';
  const socket = require('socket.io-client')('http://10.1.10.190:3006');
  var info = {  };
  var response ={
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username
        })
    };
  console.log("attempting to connect socket..."); 
  socket.on('connect', function () {
  console.log('connected to server');
  info.username = username;
  console.log("Response: " + response);
 
  console.log('username: ' + info.username);
  socket.emit('pass data to server',info, response); 
  
  // Listener
  socket.on('dataFromServer', message => {
    console.log("Message from Server:" + JSON.stringify(message)); 
    // return message.json().then(data=>data.VirgilToken);
  
  })

  socket.on('tokenFromServer', message => {
    console.log("Token from Server:" + JSON.stringify(message)); 
    setUpEkit(message);
    // return message.json().then(data=>data.VirgilToken);
  
  })

});
}
/*=====================================================*/
/*            Phone Verification Screen                */
/*=====================================================*/


export default class PhoneNumberVerification extends React.Component {

  componentDidMount() {
/*
// move to socket set up?
    this.socket = io('http://10.1.10.190:3006', {
      body: JSON.stringify({
        username: this.state.username
    })
    })
    
    E3kit.EThree.initialize(this._getVirgilToken)
				.then(e3kit => {
					showMessage('e3kit ready for identity: ' + e3kit.identity);
					return e3kit.register();
        });
    */
  }
  state = {

    verificationCode: '',
    username: this.props.navigation.getParam('username','none'),
    authType: this.props.navigation.getParam('authType', 'none'),
    user: this.props.navigation.getParam('user', 'none')
  };

  render() {
    return (
      <View style={{backgroundColor: "#728C69", flex: 1}}>
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <ScrollView keyboardShouldPersistTaps='never'>

          <Image
            style={styles.logo}
            source={require('../../assets/images/islands100black.png')}
            />
          <Text style={styles.header}>Verify Phone Number</Text>
          <TextInput
            placeholder="Code"
            style={styles.formBox}
            placeholderTextColor = "#000000"
            returnKeyType = "go"
            keyboardType="phone-pad"
            autoFocus={true}
            onSubmitEditing = {this._loginAsync}
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.verificationCode}
            onChange ={event => this.setState({verificationCode:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />


        <TouchableOpacity style={styles.ButtonContainer}
        onPress={this._loginAsync}
        activeOpacity = { .8 }>
                <Text style={styles.buttonText}
                  >Submit</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.resetContainer}>
                <Text
                  onPress={this._resetAsync}>Changed phone number?</Text>
        </TouchableOpacity>

          </ScrollView>


      </KeyboardAvoidingView>
      </View>

    );
  }

  /*--------------------Async------------------------*/
  /*
  _getVirgilToken = async() => {
    const response = await fetch('http://192.168.0.19:3000/virgil-jwt', {
      body: JSON.stringify({
        username: this.state.username
    })
    })
    if (!response.ok) {
        throw new Error(`Error code: ${response.status} \nMessage: ${response.statusText}`);
    }
    // If request was successful we return Promise which will resolve with token string.
    //return response.json().then(data => data.virgilToken);
}
*/
    _loginAsync = async () => {
      alert("just testing socket");
      await setUpSocket(this.state.user.username); 
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      // console.log("Login information input from user: ");
      // console.log("code:" + this.state.verificationCode);
      // console.log("Passed from login: ", this.state.user.username)
      // console.log("Verification type: ", this.state.authType)

      // if(this.state.authType == 'signup') {
      //   Auth.confirmSignUp(this.state.username, this.state.verificationCode)
      //   .then(() => {
      //       console.log('successful confirm sign up!')
      //       AsyncStorage.setItem("userToken",JSON.stringify(Auth))

      //       setUpSocket(this.state.user.username); 

      //        // TODO uncomment out when virgil is set up.
      //       alert("Sign in successful.. need to remove this alert when virgil done"); 
      //       // this.props.navigation.navigate('Home', Auth.user);
      //     })
      //   .catch(err => {console.log('error confirming signing up!: ', err);
      //           alert('error confirming signing up!: '+ err.message);});
      // } else if(this.state.authType == 'signin') {

      //   // remove from final version
      //   // if (this.state.verificationCode==1111){
      //   //   console.log('Debug code entered - redirecting to main');
      //   //   this.props.navigation.navigate('Main', Auth.user);
      //   // }


      //   // need to comment back in when texting works in AWS
      //   Auth.confirmSignIn(this.state.user, this.state.verificationCode)
      //   .then(() => {
      //     console.log('successful confirm sign in!');
      //     AsyncStorage.setItem("userToken",JSON.stringify(Auth))
      //     //while(socket.connected){
      //      // console.log('Hello Server! Time for tokens!')
      //     //}     
      //     //await eThree.register();
      //     setUpSocket(this.state.user.username);

      //     // TODO uncomment out when virgil is set up.
      //     alert("redirect to main");  
      //     // this.props.navigation.navigate('Main' );
      //   })
      //   .catch(err => {console.log('error confirming signing in!: ', err);
      //           alert('error confirming signing in!: '+err.message);});
      // }
    };

    _resetAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Redirecting to phone reset page");
      this.props.navigation.navigate('PhoneReset');
    };
}