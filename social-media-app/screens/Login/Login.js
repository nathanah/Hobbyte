import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image } from 'react-native';
import LoginForm from './LoginForm';

export default /*=====================================================*/
/*            Login Screen                              */
/*=====================================================*/
class Login extends React.Component {
  render() {
    return (
      <View style={{backgroundColor: "#d0e0f1", flex: 1}}>
         <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <Login/>

        <TextInput
                placeholder="Username"
                style={styles.formBox}
                placeholderTextColor = "#2e4257"
                returnKeyType = "next"
                onSubmitEditing = {() => {this.passwordInput.focus();}}
                keyboardType="email-address"
                autoCapitalize='none'
                autoCorrect={false}
            />

            <TextInput
                placeholder = "Password"
                style={styles.formBox}
                placeholderTextColor = "#2e4257"
                secureTextEntry
                returnKeyType="go"
                ref = {(input) => {this.passwordInput = input;}}
            />


        <TouchableOpacity style={styles.loginContainer}>
                <Text style={styles.buttonText}
                  onPress={this._loginAsync}>LOGIN</Text>
        </TouchableOpacity>
        </KeyboardAvoidingView>

      </View>
    );
  }

  /*--------------------Async------------------------*/
    _loginAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      this.props.navigation.navigate('Home');
    };
}

const styles = StyleSheet.create({
   container:{
       flex:1,
       backgroundColor:'#FFDFD3'
   },

});
