import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, Keyboard, ScrollView } from 'react-native';
import {Auth} from 'aws-amplify';

/*=====================================================*/
/*            Login Screen                              */
/*=====================================================*/
export default class LoginScreen extends React.Component {
  state = {
    username: '',
    password: '',
    confirmationCode: '',
    user: {},
  };

  render() {
    return (
      <View style={{backgroundColor: "#d0e0f1", flex: 1}}>
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <ScrollView keyboardShouldPersistTaps='never'>

          <Image
            style={styles.logo}
            source={require('../../assets/images/logo.png')}
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
            onSubmitEditing = {this._loginAsync}
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

        <TouchableOpacity style={styles.resetContainer}>
                <Text
                  onPress={this._signUpAsync}>New User? Sign Up Here!</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetContainer}>
                <Text
                  onPress={this._goToHome}>Home Screen</Text>
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
      
      const { username, password } = this.state;
      Auth.signIn(username, password)
        .then(user => {
          this.setState({ user });
          console.log('successful sign in!');
          this.props.navigation.navigate('PNV',
            {user: this.state.user, authType: 'signin'})
        })
        .catch(err => console.log('error signing in!: ', err));
    };

    _resetAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Redirecting to reset page");
      this.props.navigation.navigate('Reset');
    };

    _signUpAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Redirecting to Sign Up page");
      this.props.navigation.navigate('SignUp');
    };
    _goToHome = async () => {
      if(Auth.user !== null) {
        this.props.navigation.navigate('Home');
      } else {
        console.log("User is ", Auth.user)
        console.log("Must login before going to home screen")
      }
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