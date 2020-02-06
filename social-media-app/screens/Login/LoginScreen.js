import React, { Component } from 'react';
// import {Auth} from '../../App';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, Keyboard, ScrollView } from 'react-native';
/*John - This is setup for Amplify*/
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);
/*</John>*/

/*=====================================================*/
/*            Login Screen                              */
/*=====================================================*/
export default class LoginScreen extends React.Component {


  state = {

    username: '', 
    password: '', 
    status: '', 

  };

  render() {
    return (
      <View style={{backgroundColor: "#d0e0f1", flex: 1}}>
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <ScrollView keyboardShouldPersistTaps='never'>
          
          <Image 
            style={styles.logo}	         
            source={require('../../assets/images/bilbo.png')}	 
            /> 

          <TextInput
            placeholder="Username"
            style={styles.formBox}
            placeholderTextColor = "#2e4257"
            returnKeyType = "next"
            autoFocus={true}
            onSubmitEditing = {() => {this.passwordInput.focus();}}
            keyboardType="email-address"
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.username}
            onChange ={event => this.setState({username:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />
  
          <TextInput
            placeholder = "Password"
            style={styles.formBox}
            placeholderTextColor = "#2e4257"
            secureTextEntry
            returnKeyType="go"
            ref = {(input) => {this.passwordInput = input;}}
            value={this.state.password}
            onChange={event => this.setState({password: event.nativeEvent.text })}
            underlineColorAndroid = "transparent"
          />
  

        <TouchableOpacity style={styles.loginContainer}>
                <Text style={styles.buttonText}
                  onPress={this._loginAsync}>LOGIN</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.resetContainer}>
                <Text 
                  onPress={this._resetAsync}>Forgot password or username?</Text>
        </TouchableOpacity>

          </ScrollView>
       
        
     
      
      </KeyboardAvoidingView>
      </View>
    
    );
  }

  /*--------------------Async------------------------*/
    _loginAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Login information input from user: ");
      console.log("username:" + this.state.username);
      console.log("password:" + this.state.password);
      
      try {
        const user = await Auth.signIn(this.state.username, this.state.password);
        console.log(user);
        this.props.navigation.navigate('Home');

      } catch (err) {
        if (err.code === 'NotAuthorizedException') {
          console.log("bad password");
          console.log(err);
        // The error happens when the incorrect password is provided
        } else if (err.code === 'UserNotFoundException') {
          console.log("bad username");
          console.log(err);
        // The error happens when the supplied username/email does not exist in the Cognito user pool
        } else {
          console.log("Other error");

          console.log(err);
        }
        this.props.navigation.navigate('SignIn');
      }
    }

    _resetAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Redirecting to reset page");
      this.props.navigation.navigate('Reset');
    };
}


const styles = StyleSheet.create({
  container:{
      padding:20, 
  }, 

  formBox:{
      height: 45, 
      backgroundColor: '#FFF',
      marginBottom: 15, 
      paddingHorizontal: 20,

  },

  loginContainer:{
      
      paddingVertical: 10,

  },

  resetContainer:{
      
    paddingVertical: 5,
    backgroundColor: '#d0e0f1',
},

  buttonText:{
      textAlign:'center', 
      color:'#FFF',
      fontWeight: "600",
      backgroundColor:'#db8a75',
      padding:10

  }, 

  logo: {
    width: 100, 
    height:200, 
    marginBottom:30
    
  }

});