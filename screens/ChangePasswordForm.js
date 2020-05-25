import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, Keyboard, ScrollView, AsyncStorage, Alert } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import {styles} from '../styles/styles'
import Icon from 'react-native-vector-icons/Ionicons'

/*=====================================================*/
/*            Phone Verification Screen                */
/*=====================================================*/
export default class ChangePasswordForm extends React.Component {


  state = {
    oldPassword:'',
    newPassword:'',
    confirmNewPassword:'',
    minPasswordLenght: 8,
  };
  constructor(){
    super()
    this.state = {
      showPass: true,
      press: false
    }
  }
  showPass = () => {
    if (this.state.press == false){
      this.setState({showPass:false, press:true})
    }else{
      this.setState({showPass:true, press:false})
    }
  }
  render() {
    return (
      <View style={{backgroundColor: "#19b7bf", flex: 1}}>
          <KeyboardAvoidingView behavior="height" style={styles.container}>
          <ScrollView keyboardShouldPersistTaps='never'>

          <Image
            style={styles.logo}
            source={require('../assets/images/white_logo_notext.png')}
            />
          <Text style={styles.title}>Enter your SMS verification code below, old and new password!</Text>


         <View>
            <Icon name = {'ios-lock'} size = {28} color = {'rgba(255,255,255,0.7)'} style = {styles.inputIcon} />
           
            <TextInput
            placeholder="old password"
            style={styles.formBox}
            placeholderTextColor = "#000000"
            returnKeyType = "next"
            secureTextEntry = {this.state.showPass}
            autoFocus={true}
            onSubmitEditing = {() => {this.refs.newPassword.focus();}}
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.oldPassword}
            onChange ={event => this.setState({oldPassword:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
            ref="oldPassword"
            />
            <TouchableOpacity style = {styles.btnEye}
              onPress = {this.showPass.bind(this)}>
              <Icon name = {this.state.press == false ? 'ios-eye':'ios-eye-off'} size = {26} color = {'rgba(255,255,255,0.7)'}/>
            </TouchableOpacity>
          </View>

    






          <View>
            <Icon name = {'ios-lock'} size = {28} color = {'rgba(255,255,255,0.7)'} style = {styles.inputIcon} />
          
            <TextInput
            placeholder="new password"
            style={styles.formBox}
            placeholderTextColor = "#000000"
            returnKeyType = "next"
            secureTextEntry = {this.state.showPass}
            autoFocus={true}
            onSubmitEditing = {() => {this.refs.confirmPassword.focus();}}
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.newPassword}
            onChange ={event => this.setState({newPassword:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
            ref="newPassword"
            />
            <TouchableOpacity style = {styles.btnEye}
              onPress = {this.showPass.bind(this)}>
              <Icon name = {this.state.press == false ? 'ios-eye':'ios-eye-off'} size = {26} color = {'rgba(255,255,255,0.7)'}/>
            </TouchableOpacity>
          </View>

          <View>
            <Icon name = {'ios-lock'} size = {28} color = {'rgba(255,255,255,0.7)'} style = {styles.inputIcon} />
            
            <TextInput
            placeholder="confirm new password"
            style={styles.formBox}
            placeholderTextColor = "#000000"
            returnKeyType = "go"
            secureTextEntry = {this.state.showPass}
            autoFocus={true}
            onSubmitEditing = {this.changePassword}
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.confirmNewPassword}
            onChange ={event => this.setState({confirmNewPassword:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
            ref="confirmPassword"
            />
            <TouchableOpacity style = {styles.btnEye}
              onPress = {this.showPass.bind(this)}>
              <Icon name = {this.state.press == false ? 'ios-eye':'ios-eye-off'} size = {26} color = {'rgba(255,255,255,0.7)'}/>
            </TouchableOpacity>
          </View>

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
/**
 * 
 * 
 * If old passowrd too short -> worng old password
 * 
 * If "code": "NotAuthorizedException", worng old password
 * 
 * if   "code": "InvalidParameterException", form of new password is incorrect.
 * 
 * LimitExceededException - tryed too many times
 */
  handelChangeError = (err) => {
    console.log('error: ', err)
    if(err.code == 'NotAuthorizedException') {
      Alert.alert("Old Password Is Incorrect!", "Please Enter The Correct Password And Try Again!")
      return
    }
    if(err.code == 'InvalidParameterException'){
      Alert.alert("Your New Password Is Too Short!", "Please A Password That Is At Least 8 Characters Long!")
      return
    }
    if(err.code == 'LimitExceededException') {
      Alert.alert('You Have Made Too Many Attempts To Change Your Password!', 'Please Try Again After Some Time!')
      return
    }
    Alert.alert(err.code, err.message)
}
    changePassword = () => {
        console.log(this.state)
        console.log("--------------This is password reset form--------------------------")

        if(this.state.oldPassword == ''|| 
          this.state.newPassword == ''||
          this.state.confirmNewPassword == ''){
            Alert.alert("One Of The Fields Is Empty!", "Please Fill Out ALL Fields!")
            return
        }
        if(this.state.oldPassword.length < this.state.minPasswordLenght) {
          Alert.alert("Old Password Is Incorrect!", "Please Enter The Correct Password And Try Again!")
          return
        }
        if(this.state.newPassword != this.state.confirmNewPassword){
          Alert.alert("New Password/Comfirmation Password Mis-Match!",
          "Please Enter The Same Password In Both Fields!")
          return
        }
        Auth.currentAuthenticatedUser().then(
            (user) => {
                Auth.changePassword(user, this.state.oldPassword, this.state.newPassword).then(
                    ()=>{
                        console.log("password change success! going to main...")
                        this.setState({
                          oldPassword:'',
                          newPassword:'',
                          confirmNewPassword:'',
                        })
                        Alert.alert("Success!","Your password has been changed!")
                        this.props.navigation.navigate('AR');
                    }
                ).catch(
                    (err)=>{
                        console.log("error in changePassword. could not changePassword")
                        this.handelChangeError(err)
                    }
                )
            }
        ).catch(
            (err) => {
                console.log("error in changePassword. Could not get currentAuthenticatedUser")
                this.handelChangeError(err)
            }
        )
  }
};

//Check that fields are not empty.
//Check that new password conforms to specifications -- Add form validation to Signup, recover password and change email / password
//handel error where old password in inforrect



/*
Whed I entered the worng past pastword
--------------This is password reset form--------------------------
error in changePassword. could not changePassword. I think that this is because it is too short.
error:  Object {
  "code": "InvalidParameterException",
  "message": "2 validation errors detected: Value at 'previousPassword' failed to satisfy constraint: Member must have length greater than or equal to 6; Value at 'previousPassword' failed to satisfy constraint: Member must satisfy regular expression pattern: ^[\\S]+.*[\\S]+$",
  "name": "InvalidParameterException",
}


WHen it was the correct lenght, but worng, I got this:

Object {
  "newPassword": "hhhhyyyy",
  "oldPassword": "passwird",
}
--------------This is password reset form--------------------------
error in changePassword. could not changePassword
error:  Object {
  "code": "NotAuthorizedException",
  "message": "Incorrect username or password.",
  "name": "NotAuthorizedException",
}

*/


/**
 * 
 * 
 * If old passowrd too short -> worng old password
 * 
 * If "code": "NotAuthorizedException", worng old password
 * 
 * if   "code": "InvalidParameterException", form of new password is incorrect.
 */