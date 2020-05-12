import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, Keyboard, ScrollView, AsyncStorage } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import {styles} from '../styles/styles'
/*=====================================================*/
/*            Phone Verification Screen                */
/*=====================================================*/
export default class ChangePasswordForm extends React.Component {


  state = {
    newAttribute: '',
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
            value={this.state.newAttribute}
            onChange ={event => this.setState({newAttribute:event.nativeEvent.text})}
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
  
  changeAttribute = () => {
        console.log(this.state)
        console.log("--------------This is email reset form--------------------------")
        let attribute = this.props.navigation.getParam('attribute', 'none');
        var attributeUpdate = {}
        attributeUpdate[attribute] = this.state.newAttribute
        console.log("attributeUpdate: ", attributeUpdate)
        Auth.verifyCurrentUserAttributeSubmit('email',this.state.emailVerificationCode).then(
            ()=>{
                Auth.verifyCurrentUserAttributeSubmit('phone_number',this.state.phoneVerificationCode).then(
                    ()=>{
                        



                        Auth.currentAuthenticatedUser().then(
                            (user)=>{
                                Auth.updateUserAttributes(user, attributeUpdate).then(
                                    ()=>{     
                                        Auth.verifyCurrentUserAttribute(attribute).then(
                                            ()=>{
                                                console.log("changeEmail scuess!! Going to verify emial")
                                                this.props.navigation.navigate('PNV',{authType: attribute});     
                                            }
                                        ).catch(
                                            (err)=>{
                                                console.log("error in changeEmail: could not verifyCurrentUserAttribute: ", attribute)
                                                console.log('error: ', err)
                                                alert("ERROR: " + err["message"])
                                                this.props.navigation.navigate('Main'); 
                                            }
                                        )
                                    }
                                ).catch(
                                    (err)=>{
                                        console.log("error in changeEmail: could not updateUserAttribute: ", attribute)
                                        console.log('error: ', err)
                                        alert("ERROR: " + err["message"])
                                        this.props.navigation.navigate('Main'); 
                                    }
                                )  
                            }
                        ).catch(
                            (err) => {
                                console.log("error in changeEmail: could not get currentAuthenticatedUser")
                                console.log('error: ', err)
                                alert("ERROR: " + err["message"])
                                this.props.navigation.navigate('Main'); 

                            }
                        )



        
                    }
                ).catch(
                    (err)=>{
                        console.log("error in changeEmail: could not verifyCurrentUserAttributeSubmit(phone_number): ", attribute)
                        console.log('error: ', err)
                        alert("ERROR: " + err["message"])
                        this.props.navigation.navigate('Main'); 
                    }
                )
            }
        ).catch(
            (err)=>{
                console.log("error in changeEmail: could not verifyCurrentUserAttributeSubmit(email): ", attribute)
                console.log('error: ', err)
                alert("ERROR: " + err["message"])
                this.props.navigation.navigate('Main'); 
            }
        )

    }
};