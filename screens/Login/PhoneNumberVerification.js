import React, { Component } from 'react';

import { View,
         Text, 
         TouchableOpacity, 
         KeyboardAvoidingView, 
         TextInput, 
         Image, 
         ScrollView, 
         AsyncStorage,
         Alert } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import {styles} from '../../styles/styles'
import Icon from 'react-native-vector-icons/Ionicons'

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
          <Text style={styles.title}>{this.getPromptMessage()}</Text>
          <View>
            <Icon name = {'ios-chatbubbles'} size = {28} color = {'rgba(255,255,255,0.7)'} style = {styles.inputIcon} />
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
</View>

        <TouchableOpacity style={styles.ButtonContainer}
        onPress={this._loginAsync}
        activeOpacity = { .8 }>
                <Text style={styles.buttonText}
                  >Submit</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.resetContainer}>
                <Text style={styles.texts}
                  onPress={()=>{this.props.navigation.navigate("SignIn")}}>
                    Verification code not working?
                    Click to return to the Login page and try to login again!
                </Text>
        </TouchableOpacity>

          </ScrollView>


      </KeyboardAvoidingView>
      </View>
    );
  }

  /*--------------------Async------------------------*/
    getPromptMessage(){
      let authType = this.props.navigation.getParam('authType', 'none')
      if(authType == 'verify_email') {
        return "Enter Email Verification Code To Verify Your Email"
      } else if (authType == 'signin'){
        return "Enter Text Verification Code To Login"
      } else if(authType == 'signup'){
        return "Enter Text Verification Code To Verify Your Phone Number"
      } else {
        return "Enter Unknown Code For Unkown Reason"
      }
    }
    handelAWSError(authType, error) {
      let errorType;
      if(authType == 'signup') {
        errorType = 'New User Confirmation'
      } else if(authType == 'signin') {
         errorType = "Login"
      } else if(authType == 'verify_email') {
        errorType = 'Email Verification'
      } else {
        errorType = error.code
      }
      
      let errorMessage;
      console.log("This is error code: ", error.code)
      if(error.code =='NotAuthorizedException') {
        return
      } else if(error.code == 'CodeMismatchException') {
        errorMessage = "Invalid Verification Code Entered!"
      } else if(error.code == 'LimitExceededException') {
        errorMessage = 'You Have Exceeded The Verification Code Limit. Please Wait A While And Then Try Again.'
      } //else if (error.message == "Invalid session for the user, session is expired."){
      //   errorMessage = "Your Verification Code Has Expired. Please Resend The Code."
      // } 
      else {
        errorMessage = error.message
      }
      Alert.alert(errorType + " Error!", errorMessage)
      return

    }
    _loginAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Login information input from user: ");
      console.log("code:" + this.state.verificationCode);
      console.log("Passed form login: ", this.state.username)
      console.log("Varification type: ", this.state.authType)
      console.log("this is AuthType: ", this.props.navigation.getParam('authType'))

      let authType = this.props.navigation.getParam('authType', 'none');
      if(this.state.verificationCode == '') {
        
        let errorType;
        if(authType == 'signup') {
          errorType = 'New User Confirmation'
        } else if(authType == 'signin') {
           errorType = "Login"
        } else if(authType == 'verify_email') {
          errorType = 'Email Verification'
        } else {
          errorType = 'Unknown Type'
        }
        Alert.alert(errorType + " Error!",'The Verification Code Field Can Not Be Empty!')
        return
      } 

      if(authType == 'signup') {
        console.log("------------This is signup-----------------")
        Auth.confirmSignUp(this.state.username, this.state.verificationCode)
        .then(
            ()=>{
              console.log('successful confirm sign up!')
              //AsyncStorage.setItem("userToken", JSON.stringify(Auth))
              //Need to sign in so that the user is authenticated
              this.props.navigation.navigate("SignIn");
            }
          )
        .catch(
          (err) => {
            console.log('error confirming signing up!: ', err);
            this.handelAWSError(authType, err)
          }
        )
      } else if(authType == 'signin') {
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
            //AsyncStorage.setItem("userToken",JSON.stringify(Auth))

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
                          this.handelAWSError(authType, err)
                        }
                      )

                  } else {
                    AsyncStorage.setItem("userToken",JSON.stringify(Auth))
                    this.props.navigation.navigate('Home' );
                  }
                })
              .catch(
                (err)=>{
                  console.log("Error checking if email is verified: ", err)
                }
              )
          }
        )
        .catch(
          err => {
                console.log('error confirming signing in!: ', err);
                this.handelAWSError(authType, err)
              }
        );

      } else if(authType == 'verify_email') {
        console.log("------------Verifying the email-----------------")
        console.log("comming from: ", this.props.navigation.getParam('authType', 'none'))

        Auth.verifyCurrentUserAttributeSubmit('email', this.state.verificationCode).then(
            ()=>{
              console.log("email has been verified.")
              //We came form signup so we want to go to signin...
              AsyncStorage.setItem("userToken",JSON.stringify(Auth))
              this.props.navigation.navigate("Home");

            }
        ).catch((err)=>{
          this.handelAWSError(authType, err)
        })
      }
    };

}

// error name:  - happens when you press submite twicec DONE
// when code field is empty, app chashes. add check to see that it is not empty. 
// White spage is not an empty string. DONE
// CodeMismatchException - when the code is incorrect. DONE

//Clear username / password upon submit loginy
//Want to add resend code button.

/*
Happend when you wait too longe before submittiong the code.
error confirming signing in!:  Object {
  "code": "NotAuthorizedException",
  "message": "Invalid session for the user, session is expired.",
  "name": "NotAuthorizedException",
}
*/ 


//Too many email reset codes sent code: LimitExceededException DONE


/*
When you enter the same code twice.
error confirming signing in!:  Object {
  "code": "NotAuthorizedException",
  "message": "Invalid session for the user, session can only be used once.",
  "name": "NotAuthorizedException",
}
*/