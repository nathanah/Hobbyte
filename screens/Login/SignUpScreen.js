import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, Keyboard, ScrollView } from 'react-native';
import {Auth} from 'aws-amplify';
/*=====================================================*/
/*            Login Screen                              */
/*=====================================================*/
export default class SignUpScreen extends React.Component {


  state = {
    username: '',
    password: '',
    passwordConfirm: '',
    email: '',
    phoneNumber: '',
    confirmationCode: '',
  };

  render() {
    return (
      <View style={{backgroundColor: "#d0e0f1", flex: 1}}>
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <ScrollView keyboardShouldPersistTaps='never'>

          <TextInput
            placeholder="Username"
            style={styles.formBox}
            placeholderTextColor = "#2e4257"
            returnKeyType = "next"
            autoFocus={true}
            onSubmitEditing = {() => {this.emailInput.focus();}}
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.username}
            onChange ={event => this.setState({username:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />

          <TextInput
            placeholder="Email"
            style={styles.formBox}
            placeholderTextColor = "#2e4257"
            returnKeyType = "next"
            onSubmitEditing = {() => {this.phoneInput.focus();}}
            keyboardType="email-address"
            autoCapitalize='none'
            autoCorrect={false}
            ref = {(input) => {this.emailInput = input;}}
            value={this.state.email}
            onChange ={event => this.setState({email:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />

          <TextInput
            placeholder="Phone Number"
            style={styles.formBox}
            placeholderTextColor = "#2e4257"
            returnKeyType = "next"
            onSubmitEditing = {() => {this.passwordInput.focus();}}
            keyboardType="phone-pad"
            autoCapitalize='none'
            autoCorrect={false}
            ref = {(input) => {this.phoneInput = input;}}
            value={this.state.phoneNumber}
            onChange ={event => this.setState({phoneNumber:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />

          <TextInput
            placeholder = "Password"
            style={styles.formBox}
            placeholderTextColor = "#2e4257"
            secureTextEntry
            returnKeyType="next"
            ref = {(input) => {this.passwordInput = input;}}
            value={this.state.password}
            onChange={event => this.setState({password: event.nativeEvent.text })}
            onSubmitEditing = {() => {this.passwordConfirmInput.focus();}}
            underlineColorAndroid = "transparent"
          />

          <TextInput
            placeholder = "Password Confirmation"
            style={styles.formBox}
            placeholderTextColor = "#2e4257"
            secureTextEntry
            returnKeyType="go"
            ref = {(input) => {this.passwordConfirmInput = input;}}
            value={this.state.passwordConfirm}
            onChange={event => this.setState({passwordConfirm: event.nativeEvent.text })}
            onSubmitEditing = {this._submitAsync}
            underlineColorAndroid = "transparent"
          />


        <TouchableOpacity style={styles.loginContainer}>
                <Text style={styles.buttonText}
                  onPress={this._submitAsync}>Sumbit</Text>
        </TouchableOpacity>

          </ScrollView>
          
      </KeyboardAvoidingView>
      </View>

    );
  }



  /*--------------------Async------------------------*/
    _submitAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Sign Up information input from user: ");
      console.log("username:" + this.state.username);
      console.log("email   :" + this.state.email);
      console.log("phone # :" + this.state.phoneNumber);
      console.log("password:" + this.state.password);
      console.log("password:" + this.state.passwordConfirm);

      Auth.signUp({
        username: this.state.username,
        password: this.state.password,
        attributes: {
          email: this.state.email,
          phone_number: this.state.phoneNumber,
        },
      })
        .then(() => {
          console.log('successful sign up!')
          this.props.navigation.navigate('PNV',
                {username: this.state.username, authType: 'signup'})
        })
        .catch(err => console.log('error signing up!: ', err));

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
