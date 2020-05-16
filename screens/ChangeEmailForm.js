import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, Keyboard, ScrollView, AsyncStorage } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import {styles} from '../styles/styles'
import Icon from 'react-native-vector-icons/Ionicons'

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
      <View style={{backgroundColor: "#19b7bf", flex: 1}}>
          <KeyboardAvoidingView behavior="height" style={styles.container}>
          <ScrollView keyboardShouldPersistTaps='never'>

          <Image
            style={styles.logo}
            source={require('../assets/images/white_logo_notext.png')}
            />
          <Text style={styles.title}>{this.getTitleMessage()}</Text>
          <View>
            <Icon name = {'ios-chatboxes'} size = {28} color = {'rgba(255,255,255,0.7)'} style = {styles.inputIcon} />
          
          
          
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
          </View>
          <View>
            <Icon name = {'ios-mail'} size = {28} color = {'rgba(255,255,255,0.7)'} style = {styles.inputIcon} />
          
          
          
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
          </View>
          <View>
            <Icon name = {'ios-phone-portrait'} size = {28} color = {'rgba(255,255,255,0.7)'} style = {styles.inputIcon} />
          
          
          
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
            onChange ={event => this.setState({newAttributeValue:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />
</View>

        <TouchableOpacity style={styles.ButtonContainer}
        onPress={this.changeAttribute}
        activeOpacity = { .8 }>
                <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ButtonContainer}
        onPress={this.resendCodes}
        activeOpacity = { .8 }>
                <Text style={styles.buttonText}>Resend Codes</Text>
        </TouchableOpacity>
          </ScrollView>

      </KeyboardAvoidingView>
      </View>

    );
  }

  /*--------------------Async------------------------*/
  getTitleMessage(){
      if(this.props.navigation.getParam('attribute', 'none') == 'email') {
          return "Fill Out The Form To Change Your Email!"
      } else {
        return "Fill Out The Form To Change Your Phone Number!"
      }
  }
    handelChangeError = (err, callingFunction, attribute, nextPage) => {
        console.log("ERROR in, ", callingFunction, ": ", attribute)
        console.log('error: ', err)
        alert("ERROR: " + err["message"])
    }

    resendCodes = () => {
        Auth.verifyCurrentUserAttribute('email')
        .then(
            ()=>{
                console.log("changeEmail scuess!! Going to verify emial")    
                Auth.verifyCurrentUserAttribute('phone_number')
                  .then(
                      ()=>{
                          console.log("CODES HAVE BEEN RESENT")
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
    changeAttribute = () => {
        let attribute = this.props.navigation.getParam('attribute', 'none');
        console.log(this.state)
        console.log("--------------This is changeAttribute reset form--------------------------")
        console.log("___________________we are changing ", attribute, "______________________")
        if(this.state.emailVerificationCode == '' ||
        this.state.phoneVerificationCode == '') {
            alert('Verification codes cannot be empty!')
            return;
        }
        Auth.verifyCurrentUserAttributeSubmit('email',this.state.emailVerificationCode)
            .then(
                ()=>{
                    console.log("email", " verification SUCCESS!")
                    Auth.verifyCurrentUserAttributeSubmit('phone_number',this.state.phoneVerificationCode)
                        .then(
                            ()=>{
                                console.log("phone_number", " verification SUCCESS!")
                                Auth.currentAuthenticatedUser()
                                    .then(
                                        (user)=>{
                                            var attributeUpdate = {}
                                            attributeUpdate[attribute] = this.state.newAttributeValue
                                            Auth.updateUserAttributes(user, attributeUpdate)
                                                .then(
                                                    () => {
                                                        this.props.navigation.navigate('AR');
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
                                    )
                                    .catch(
                                        (err) => {
                                            this.handelChangeError(err, 
                                                "currentAuthenticatedUser", 
                                                attribute)
                                        }
                                    )
                            }
                        )
                        .catch(
                            (err) => {
                                this.handelChangeError(err, 
                                    "verifyCurrentUserAttributeSubmit", 
                                    "phone_number")
                            }
                        )
                }
            )
            .catch(
                (err) => {
                    this.handelChangeError(err, 
                        "verifyCurrentUserAttributeSubmit", 
                        "email")
                }
            )

        // let recp;
        // recp = this.verifyCurrentUserAttributeSubmit('email', this.state.emailVerificationCode)
        // if(!recp) return;
        // recp = this.verifyCurrentUserAttributeSubmit('phone_number', this.state.phoneVerificationCode)
        // if(!recp) return;
        // let user = this.currentAuthenticatedUser()
        // if(user == false) return;
        // recp = this.updateUserAttributes(user, attribute)
        // if(!recp) return;          
        // recp = this.verifyCurrentUserAttribute(attribute)
        // if(!recp) return;
        // this.props.navigation.navigate('PNV',{authType: attribute});   
    }
};