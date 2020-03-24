import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, Keyboard, ScrollView, AsyncStorage } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';

/*=====================================================*/
/*            Phone Verification Screen                */
/*=====================================================*/
export default class PhoneNumberVerification extends React.Component {


  state = {

    verificationCode: '',
    username: this.props.navigation.getParam('username','none'),
    authType: this.props.navigation.getParam('authType', 'none'),
    user: this.props.navigation.getParam('user', 'none')
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
          <Text style={styles.header}>Verify Phone Number</Text>
          <TextInput
            placeholder="Code"
            style={styles.formBox}
            placeholderTextColor = "#2e4257"
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


        <TouchableOpacity style={styles.loginContainer}>
                <Text style={styles.buttonText}
                  onPress={this._loginAsync}>Code</Text>
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
      console.log("Passed form login: ", this.state.username)
      console.log("Varification type: ", this.state.authType)

      if(this.state.authType == 'signup') {
        Auth.confirmSignUp(this.state.username, this.state.verificationCode)
        .then(() => {
            console.log('successful confirm sign up!')
            AsyncStorage.setItem("userToken",JSON.stringify(Auth))
            this.props.navigation.navigate('Home', Auth.user);
          })
        .catch(err => {console.log('error confirming signing up!: ', err);
                alert('error confirming signing up!: '+ err.message);});
      } else if(this.state.authType == 'signin') {
        
        // remove from final version 
        if (this.state.verificationCode==1111){
          console.log('Debug code entered - redirecting to main');
          this.props.navigation.navigate('Main', Auth.user);
        }

       
        // need to comment back in when texting works in AWS
        // Auth.confirmSignIn(this.state.user, this.state.verificationCode)
        // .then(() => {
        //   console.log('successful confirm sign in!');
        //   AsyncStorage.setItem("userToken",JSON.stringify(Auth))
        //   this.props.navigation.navigate('Main', Auth.user);
        // })
        // .catch(err => {console.log('error confirming signing in!: ', err);
        //         alert('error confirming signing in!: '+err.message);});
      }
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
    backgroundColor: '#d0e0f1',
    marginBottom: 15,
    paddingHorizontal: 20,
    borderBottomColor: '#2e4257',
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
      padding:10

  },

  logo: {
    width: 100,
    height:200,
    marginBottom:30

  }

});
