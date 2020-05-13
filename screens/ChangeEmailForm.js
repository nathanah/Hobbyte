import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, Keyboard, ScrollView, AsyncStorage } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import {styles} from '../styles/styles'
/*=====================================================*/
/*            Phone Verification Screen                */
/*=====================================================*/

export default class ChangePasswordForm extends React.Component {


  state = {
    newAttributeValue: '',
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
            placeholder="new attribute value"
            style={styles.formBox}
            placeholderTextColor = "#000000"
            returnKeyType = "go"
            autoFocus={true}
            onSubmitEditing = {this.changeAttribute}
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.newAttributeValue}
            onChange ={event => this.setState({newAttributeValue: '',
                                               emailVerificationCode:'',
                                               phoneVerificationCode:''})}
            underlineColorAndroid = "transparent"
          />


        <TouchableOpacity style={styles.ButtonContainer}
        onPress={this.changeAttribute}
        activeOpacity = { .8 }>
                <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
          </ScrollView>

      </KeyboardAvoidingView>
      </View>

    );
  }

  /*--------------------Async------------------------*/

  verifyCurrentUserAttributeSubmit = (attribute, verificationCode) => {
    Auth.verifyCurrentUserAttributeSubmit('email',verificationCode)
        .then(
            ()=>{
                console.log(attribute, " verification SUCCESS!")
                return true
            }
        )
        .catch(
            (err) => {
                this.handelChangeError(err, 
                    "verifyCurrentUserAttributeSubmit", 
                    attribute)
            }
        )
    }

    handelChangeError = (err, callingFunction, attribute, nextPage) => {
        console.log("ERROR in, ", callingFunction, ": ", attribute)
        console.log('error: ', err)
        alert("ERROR: " + err["message"])
        // this.setState({newAttributeValue: '',
        //                emailVerificationCode:'',
        //                phoneVerificationCode:''
        //             })
        return false;
    }


    currentAuthenticatedUser(){
        Auth.currentAuthenticatedUser()
            .then(
                (user)=>{
                    return user;
                }
            )
            .catch(
                (err) => {
                    this.handelChangeError(err, 
                        "currentAuthenticatedUser", 
                        attribute)
                }
            )
    }

    updateUserAttributes(user, attribute) {
        var attributeUpdate = {}
        attributeUpdate[attribute] = this.state.newAttributeValue
        Auth.updateUserAttributes(user, attributeUpdate)
        .then(
            () => {
                console.log("Attribute Updeate SUCESS")
                return true
            }
        )
        .catch(
            (err) => {
                this.handelChangeError(err, 
                    "updateUserAttributes", 
                    attribute)
            }
        )
    }
    verifyCurrentUserAttribute(attribute) {
        Auth.verifyCurrentUserAttribute(attribute)
        .then(
            ()=>{
                console.log("changeEmail scuess!! Going to verify emial") 
                return true   
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



  changeAttribute = () => {
        let attribute = this.props.navigation.getParam('attribute', 'none');
        console.log(this.state)
        console.log("--------------This is changeAttribute reset form--------------------------")
        console.log("___________________we are changing ", attribute, "______________________")
        
        
        // console.log("attributeUpdate: ", attributeUpdate)
        if(this.state.emailVerificationCode == '' ||
            this.state.phoneVerificationCode == '') {
                alert('Verification codes cannot be empty!')
                return;
            }
        let recp;
        recp = this.verifyCurrentUserAttributeSubmit('email', this.state.emailVerificationCode)
        if(!recp) return;
        recp = this.verifyCurrentUserAttributeSubmit('phone_number', this.state.phoneVerificationCode)
        if(!recp) return;
        let user = this.currentAuthenticatedUser()
        if(user == false) return;
        recp = this.updateUserAttributes(user, attribute)
        if(!recp) return;          
        recp = this.verifyCurrentUserAttribute(attribute)
        if(!recp) return;
        this.props.navigation.navigate('PNV',{authType: attribute});   
    }
};