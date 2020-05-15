import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, Keyboard, ScrollView, AsyncStorage } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import {styles} from '../styles/styles'
/*=====================================================*/
/*            Phone Verification Screen                */
/*=====================================================*/
export default class ChangePasswordForm extends React.Component {


  state = {
    verificationCode: '',
    oldPassword:'',
    newPassword:'',
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
            value={this.state.verificationCode}
            onChange ={event => this.setState({verificationCode:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />
          
            <TextInput
            placeholder="old password"
            style={styles.formBox}
            placeholderTextColor = "#000000"
            returnKeyType = "go"
            secureTextEntry
            autoFocus={true}
            onSubmitEditing = {this._passwordResetAsync}
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.oldPassword}
            onChange ={event => this.setState({oldPassword:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />
          <TextInput
            placeholder="new password"
            style={styles.formBox}
            placeholderTextColor = "#000000"
            returnKeyType = "go"
            secureTextEntry
            autoFocus={true}
            onSubmitEditing = {this.changePassword}
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.newPassword}
            onChange ={event => this.setState({newPassword:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />


        <TouchableOpacity style={styles.ButtonContainer}
        onPress={this.changePassword}
        activeOpacity = { .8 }>
                <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
          </ScrollView>

      </KeyboardAvoidingView>
      </View>

    );
  }

  /*--------------------Async------------------------*/
    changePassword = () => {
        console.log(this.state)
        console.log("--------------This is password reset form--------------------------")
        Auth.verifyCurrentUserAttributeSubmit("phone_number",this.state.verificationCode).then(
            ()=>{
                Auth.currentAuthenticatedUser().then(
                    (user) => {
                        Auth.changePassword(user, this.state.oldPassword, this.state.newPassword).then(
                            ()=>{
                                console.log("password change success! going to main...")
                                this.props.navigation.navigate('Main')
                            }
                        ).catch(
                            (err)=>{
                                console.log("error in changePassword. could not changePassword")
                                console.log("error: ", err)
                            }
                        )
                    }
                ).catch(
                    (err) => {
                        console.log("error in changePassword. Could not get currentAuthenticatedUser")
                        console.log("error: ", err)
                    }
                )
            }
        ).catch(
            (err)=>{
                console.log("error in changePassword. could not verifyCurrentUserAttributeSubmit")
                console.log("error: ", err)
            }
        )
    }
};