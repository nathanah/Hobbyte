import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, Keyboard, ScrollView, AsyncStorage } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import {styles} from '../../styles/styles'
/*=====================================================*/
/*            Phone Verification Screen                */
/*=====================================================*/
export default class PasswordResetForm extends React.Component {


  state = {
    verificationCode: '',
    password:'',
    username: this.props.navigation.getParam('username','none'),
  };

  render() {
    return (
      <View style={{backgroundColor: "#728C69", flex: 1}}>
          <KeyboardAvoidingView behavior="height" style={styles.container}>
          <ScrollView keyboardShouldPersistTaps='never'>

          <Image
            style={styles.logo}
            source={require('../../assets/images/islands100black.png')}
            />
          <Text style={styles.header}>Enter your email verification code and new password!!!</Text>
          <TextInput
            placeholder="Email Code"
            style={styles.formBox}
            placeholderTextColor = "#000000"
            returnKeyType = "go"
            keyboardType="phone-pad"
            autoFocus={true}
            onSubmitEditing = {() => {this.passwordInput.focus();}}
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.verificationCode}
            onChange ={event => this.setState({verificationCode:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />
            <TextInput
            placeholder="password"
            style={styles.formBox}
            placeholderTextColor = "#000000"
            returnKeyType = "go"
            secureTextEntry
            autoFocus={true}
            onSubmitEditing = {this._passwordResetAsync}
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.password}
            onChange ={event => this.setState({password:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />


        <TouchableOpacity style={styles.ButtonContainer}
        onPress={this._passwordRestAsync}
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
  _passwordRestAsync = async () => {
      console.log("--------------This is password reset form--------------------------")
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      Auth.forgotPasswordSubmit(this.state.username, this.state.verificationCode, this.state.password).then(
          ()=>{
            console.log("password reset complete!")
            console.log("passwars: ", this.state.password)
            this.props.navigation.navigate('SignIn')  
          }
      ).catch(
          (err)=>{
              console.log("password reset error: ", err)
          }
      )
    };

    _resetAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Redirecting to phone reset page");
      this.props.navigation.navigate('PhoneReset');
    };
}
