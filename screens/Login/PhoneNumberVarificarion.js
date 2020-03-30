import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, Keyboard, ScrollView } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';

/*=====================================================*/
/*            Phone Verification Screen                */
/*=====================================================*/
export default class TwoFactorScreen extends React.Component {


  state = {

    verificationCode: '',

  };

  render() {
    return (
      <View style={{backgroundColor: "#129649", flex: 1}}>
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <ScrollView keyboardShouldPersistTaps='never'>

          <Image
            style={styles.logo}
            source={require('../../assets/images/islands100white.png')}
            />
          <Text style={styles.header}>Phone Number Confermation</Text>
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


        <TouchableOpacity style={styles.loginContainer}
        onPress={this._loginAsync}
        activeOpacity = { .8 }>
                <Text style={styles.buttonText}
                  >LOGIN</Text>
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
    _loginAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Login information input from user: ");
      console.log("code:" + this.state.verificationCode);

      Auth.confirmSignUp(this.state.username, this.state.verificationCode)
      .then(() => console.log('successful confirm sign up!'))
      .catch(err => console.log('error confirming signing up!: ', err));
      this.props.navigation.navigate('Home');
    };

    _resetAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Redirecting to phone reset page");
      this.props.navigation.navigate('PhoneReset');
    };
}


const styles = StyleSheet.create({
  container:{
      padding:20,
  },
  header:{
    paddingBottom: 25,
    fontSize: 18,
  },
  formBox:{
    height: 45,
    backgroundColor: '#129649',
    marginBottom: 15,
    paddingHorizontal: 20,
    borderBottomColor: '#000000',
    borderBottomWidth: 1
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
    borderRadius:20,
    borderWidth: 1,
    padding:10

  },

  logo: {
    alignSelf: 'center',
    height: 200,
    width: 200,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

  }

});
