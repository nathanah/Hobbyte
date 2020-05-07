import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, Keyboard, ScrollView } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import {styles} from '../../styles/styles'
/*=====================================================*/
/*            Phone Verification Screen                */
/*=====================================================*/
export default class TwoFactorScreen extends React.Component {


  state = {

    verificationCode: '',

  };

  render() {
    return (
      <View style={{backgroundColor: "#728C69", flex: 1}}>
          <KeyboardAvoidingView behavior="height" style={styles.container}>
          <ScrollView keyboardShouldPersistTaps='never'>

          <Image
            style={styles.logo}
            source={require('../../assets/images/islands100white.png')}
            />
          <Text style={styles.header}>Two Factor Verification Code</Text>
          <TextInput
            placeholder="Code"
            style={styles.formBox}
            placeholderTextColor = "#000000"
            returnKeyType = "go"
            autoFocus={true}
            onSubmitEditing = {this._loginAsync}
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.verificationCode}
            onChange ={event => this.setState({verificationCode:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />


        <TouchableOpacity style={styles.ButtonContainer}
        activeOpacity = { .8 }
        onPress={this._loginAsync}>
                <Text style={styles.buttonText}
                  >LOGIN</Text>
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
    _loginAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Login information input from user: ");
      console.log("code:" + this.state.verificationCode);

      Auth.confirmSignUp(this.state.username, this.state.verificationCode)
      .then(() => console.log('successful confirm sign up!'))
      .catch(err => console.log('error confirming signing up!: ', err));
      this.props.navigation.navigate('Home');
    };

    _resetAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Redirecting to phone reset page");
      this.props.navigation.navigate('PhoneReset');
    };
}



