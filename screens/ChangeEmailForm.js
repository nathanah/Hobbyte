import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, Keyboard, ScrollView, AsyncStorage } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import {styles} from '../styles/styles'
/*=====================================================*/
/*            Phone Verification Screen                */
/*=====================================================*/
export default class ChangePasswordForm extends React.Component {


  state = {
    newEmail: '',
    emailVerificationCode:'',
    phoneVerificationCode:''
    //username: this.props.navigation.getParam('username','none'),
  };

  render() {
    return (
      <View style={{backgroundColor: "#728C69", flex: 1}}>
          <KeyboardAvoidingView behavior="height" style={styles.container}>
          <ScrollView keyboardShouldPersistTaps='never'>

          <Image
            style={styles.logo}
            source={require('../assets/images/islands100black.png')}
            />
          <Text style={styles.header}>Enter your phone verification code, old password, and new password!!!</Text>
          <TextInput
            placeholder="Text Message Code"
            style={styles.formBox}
            placeholderTextColor = "#000000"
            returnKeyType = "go"
            keyboardType="phone-pad"
            autoFocus={true}
            onSubmitEditing = {() => {this.passwordInput.focus();}}
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.phoneVerificationCode}
            onChange ={event => this.setState({phoneVerificationCode:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />
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
            value={this.state.emailVerificationCode}
            onChange ={event => this.setState({emailVerificationCode:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />
          
          <TextInput
            placeholder="new email"
            style={styles.formBox}
            placeholderTextColor = "#000000"
            returnKeyType = "go"
            autoFocus={true}
            onSubmitEditing = {this.changeEmail}
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.newEmail}
            onChange ={event => this.setState({newEmail:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />


        <TouchableOpacity style={styles.ButtonContainer}
        onPress={this.changeEmail}
        activeOpacity = { .8 }>
                <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
          </ScrollView>

      </KeyboardAvoidingView>
      </View>

    );
  }

  /*--------------------Async------------------------*/
    changeEmail = () => {
        console.log(this.state)
        console.log("--------------This is email reset form--------------------------")
        Auth.currentAuthenticatedUser().then(
            (user)=>{
                Auth.updateUserAttributes(user, {'email':this.state.newEmail}).then(
                    ()=>{
                        Auth.verifyCurrentUserAttribute(user, 'email').then(
                            ()=>{
                                console.log("changeEmail scuess!! Going to verify emial")
                                this.props.navigation.navigate('PNV',{authType: "email_verification"});     
                            }
                        ).catch(
                            (err)=>{
                                console.log("error in changeEmail: could not verifyCurrentUserAttribute: email")
                                console.log('error: ', err)
                            }
                        )
                    }
                ).catch(
                    (err)=>{
                        console.log("error in changeEmail: could not updateUserAttribute: email")
                        console.log('error: ', err)
                    }
                )  
            }
        ).catch(
            (err) => {
                console.log("error in changeEmail: could not get currentAuthenticatedUser")
                console.log('error: ', err)
            }
        )
    }
};