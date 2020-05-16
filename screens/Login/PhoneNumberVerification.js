import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, Keyboard, ScrollView, AsyncStorage } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import {styles} from '../../styles/styles'
/*=====================================================*/
/*            Phone Verification Screen                */
/*=====================================================*/
export default class PhoneNumberVerification extends React.Component {


  state = {
    verificationCode: '',
    username: this.props.navigation.getParam('username','none'),
    // authType: this.props.navigation.getParam('authType', 'none'),
    user: this.props.navigation.getParam('user', 'none'),
  };



  render() {
    return (
      <View style={{backgroundColor: "#19b7bf", flex: 1}}>
          <KeyboardAvoidingView behavior="height" style={styles.container}>
          <ScrollView keyboardShouldPersistTaps='never'>

          <Image
            style={styles.logo}
            source={require('../../assets/images/white_logo_notext.png')}
            />
          <Text style={styles.header}>{this.getPromptMessage()}</Text>
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
    getPromptMessage(){
      if(this.props.navigation.getParam('authType', 'none') == 'verify_email') {
        return "Enter Email Verification Code"
      } else {
        return "Enter Text Verification Code"
      }
    }
    _loginAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Login information input from user: ");
      console.log("code:" + this.state.verificationCode);
      console.log("Passed form login: ", this.state.username)
      console.log("Varification type: ", this.state.authType)
      console.log("this is AuthType: ", this.props.navigation.getParam('authType'))

      if(this.props.navigation.getParam('authType', 'none') == 'signup') {
        console.log("------------This is signup-----------------")
        Auth.confirmSignUp(this.state.username, this.state.verificationCode)
        .then(
            ()=>{
              console.log('successful confirm sign up!')
              AsyncStorage.setItem("userToken", JSON.stringify(Auth))
              //Need to sign in so that the user is authenticated
              this.props.navigation.navigate("SignIn");
            }
          )
        .catch(
          (err) => {
            console.log('error confirming signing up!: ', err);
                alert('error confirming signing up!: '+ err.message);
          }
        )
      } else if(this.props.navigation.getParam('authType', 'none') == 'signin') {
        console.log("------------This is signin-----------------")
        // remove from final version
        // if (this.state.verificationCode==1111){
        //   console.log('Debug code entered - redirecting to main');
        //   this.props.navigation.navigate('Main', Auth.user);
        // }


        // need to comment back in when texting works in AWS
        Auth.confirmSignIn(this.state.user, this.state.verificationCode)
        .then(
          () => {
            console.log('successful confirm sign in!');
            AsyncStorage.setItem("userToken",JSON.stringify(Auth))

            Auth.currentAuthenticatedUser()
              //Check if email is verified, if not verify it, else go to main
              .then(
                (user) => {
                  console.log("email_verified: ", user.attributes.email_verified)
                  console.log("!email_verified: ", !user.attributes.email_verified)
                  if(!user.attributes.email_verified){
                    console.log("Email verified is false")
                    Auth.verifyCurrentUserAttribute('email')
                      .then(
                        ()=>{
                          console.log("init email verification")
                          this.setState({verificationCode:''})
                          this.props.navigation.navigate('PNV', {authType: 'verify_email'})
                        }
                      )
                      .catch(
                        (err)=>{
                          console.log("Error in init email verification: ", err)
                        }
                      )

                  } else {
                    this.props.navigation.navigate('Main' );
                  }
                })
              .catch(
                (err)=>{
                  console.log("Error checking if email is verified: ", err)
                }
              )
          }
        )
        .catch(err => {console.log('error confirming signing in!: ', err);
                alert('error confirming signing in!: '+err.message);});

      } else if(this.props.navigation.getParam('authType', 'none') == 'verify_email') {
        console.log("------------Verifying the email-----------------")
        console.log("comming from: ", this.props.navigation.getParam('authType', 'none'))

        Auth.verifyCurrentUserAttributeSubmit('email', this.state.verificationCode).then(
            ()=>{
              console.log("email has been verified.")
              //We came form signup so we want to go to signin...
              this.props.navigation.navigate("SignIn");

            }
        ).catch((err)=>{
            console.log("Error verifing Email, comming form: ", err)
        })
      }
    };

    _resetAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Redirecting to phone reset page");
      this.props.navigation.navigate('PhoneReset');
    };
}
