import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image } from 'react-native';

/*=====================================================*/
/*            Login Screen                              */
/*=====================================================*/
export default class LoginScreen extends React.Component {
  render() {
    return (
      <View style={{backgroundColor: "#d0e0f1", flex: 1}}>
         <KeyboardAvoidingView behavior="padding" style={styles.container}>
          {/* <LoginForm/> */}
          <Image 
            style={styles.logo}	            style={styles.logo}
            source={require('../../assets/images/bilbo.png')}	 
            /> 

        <TextInput
                placeholder="Username"
                style={styles.formBox}
                placeholderTextColor = "#2e4257"
                returnKeyType = "next"
                onSubmitEditing = {() => {this.passwordInput.focus();}}
                keyboardType="email-address"
                autoCapitalize='none'
                autoCorrect={false}
                // value 
            />
  
            <TextInput
                placeholder = "Password"
                style={styles.formBox}
                placeholderTextColor = "#2e4257"
                secureTextEntry
                returnKeyType="go"
                ref = {(input) => {this.passwordInput = input;}}
                // value = ...
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
      padding:20, 
  }, 

  formBox:{
      height: 45, 
      backgroundColor: '#FFF',
      marginBottom: 20, 
      paddingHorizontal: 20,

  },

  loginContainer:{
      
      paddingVertical: 10,

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
    height:200
  }

});