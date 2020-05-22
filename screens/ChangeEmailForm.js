import React, { Component } from 'react';

import {View, 
        Text, 
        TouchableOpacity,
        KeyboardAvoidingView, 
        TextInput, 
        Image,
        ScrollView, 
        Alert } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import {styles} from '../styles/styles'
import Icon from 'react-native-vector-icons/Ionicons'

/*=====================================================*/
/*            Phone Verification Screen                */
/*=====================================================*/

export default class ChangePasswordForm extends React.Component {


  state = {
    newAttributeValue: '',
    verificationCode:'',
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
            placeholder="Confirmation Code"
            style={styles.formBox}
            placeholderTextColor = "#000000"
            returnKeyType = "next"
            keyboardType="phone-pad"
            autoFocus={true}
            onSubmitEditing = {() => {this.refs.newAttribute.focus();}}
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.verificationCode}
            onChange ={event => this.setState({verificationCode:event.nativeEvent.text})}
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
            ref="newAttribute"
          />
</View>

        <TouchableOpacity style={styles.ButtonContainer}
        onPress={this.changeAttribute}
        activeOpacity = { .8 }>
                <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ButtonContainer}
        onPress={this.resendCode}
        activeOpacity = { .8 }>
                <Text style={styles.buttonText}>Resend Verification Code</Text>
        </TouchableOpacity>
          </ScrollView>

      </KeyboardAvoidingView>
      </View>

    );
  }

  /*--------------------Async------------------------*/
  getTitleMessage(){
      if(this.props.navigation.getParam('attribute', 'none') == 'email') {
          return "Enter The Verification Code That Was Sent To Your Email, And Enter A New Email Address!"
      } else {
         return "Enter The Verification Code That Was Sent To Your Phone, And Enter A New Phone Number!"
      }
  }
    handelChangeError = (err) => {
        // console.log("ERROR in, ", callingFunction, ": ", attribute)
        // console.log('error: ', err)
        // if(err.code == 'LimitExceededException') {
        //     Alert.alert("You Requested Too Many Verification Codes!", "Please Wait A While Before Trying Again.")
        // } else if(err.code == 'CodeMismatchException') {
        //     Alert.alert("The Verification Code That Was Entered Was Incorrect!",
        //                                 "Please Enter And Submit The Correct Verification Code!")
        // } else {
        //     Alert.alert(err.code, err.message)
        // }
        Alert.alert(err.code, err.message)
    }

    resendCode = () => {
        let attribute = this.props.navigation.getParam('attribute', 'none');
        Auth.verifyCurrentUserAttribute(attribute)
        .then(
            ()=>{
                console.log(attribute + " code has been resent")
            }
        )
        .catch(
            (err) => {
                 this.handelChangeError(err)
            }
        ) 
    }

    changeAttribute = () => {
        let attribute = this.props.navigation.getParam('attribute', 'none');
        console.log(this.state)
        console.log("--------------This is changeAttribute reset form--------------------------")
        console.log("___________________we are changing ", attribute, "______________________")
        if(this.state.verificationCode == '') {
            Alert.alert('A Verification Code Field Is Empty!', "Please Fill Out All Fields Before Submitting.")
            return;
        }
        if(this.state.newAttributeValue == ''){
            Alert.alert('New Attribure Field Is Empty!', "Please Fill Out All Fields Before Submitting.")
        }

        Auth.verifyCurrentUserAttributeSubmit(attribute,this.state.verificationCode)
            .then(
                ()=>{
                    console.log(attribute, " verification SUCCESS!")
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
                                            this.handelChangeError(err)
                                        }
                                    )
                            }
                        )
                        .catch(
                            (err) => {
                                this.handelChangeError(err)
                            }
                        )
                }
            )
            .catch(
                (err) => {
                    this.handelChangeError(err)
                }
            )
    }
};

// Error message for tooManyAtemptss
// Error for invalid code
// Catch All error.
// I want to add a check to the new field attribure to insure that it meets the requirements
