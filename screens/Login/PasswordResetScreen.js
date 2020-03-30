import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, ScrollView,Keyboard } from 'react-native';
import {Auth} from 'aws-amplify';

/*=====================================================*/
/*            Reset Screen                              */
/*=====================================================*/
export default class PasswordResetScreen extends React.Component {


  state = {
    username: ''
  };

  render() {
    return (
      <View style={{backgroundColor: "#129649", flex: 1}}>
         <ScrollView keyboardShouldPersistTaps='never'>
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <Image
            style={styles.logo}	            style={styles.logo}
            source={require('../../assets/images/islands100black.png')}	 
            />
        <Text style={styles.header}>Reset Password</Text>

        <TextInput
                placeholder="Username"
                style={styles.formBox}
                placeholderTextColor = "#000000"
                returnKeyType = "next"
                autoFocus={true}
                onSubmitEditing = {() => {this.phoneInput.focus();}}
                keyboardType="email-address"
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.email}
                onChange ={event => this.setState({username:event.nativeEvent.text})}
                underlineColorAndroid = "transparent"
            />


        <TouchableOpacity style={styles.submitContainer}
        activeOpacity = { .8 }
        onPress={this._submitAsync}>
                <Text style={styles.buttonText}
                  >SUBMIT</Text>
        </TouchableOpacity>


        </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }

  /*--------------------Async------------------------*/
    _submitAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Reset information input from user: ");
      console.log("Username:" + this.state.username);
      Auth.forgotPassword(this.state.username).then(() => {
         console.log("Fogot password initiated")
      }
      )
      //this.props.navigation.navigate('SignIn');
    };
}


const styles = StyleSheet.create({
  container:{
      padding:20,
  },

  header:{
    paddingTop:20,
    textAlign:'center',
    color:'#000'
  },
  formBox:{
    height: 45,
    backgroundColor: '#129649',
    marginBottom: 15,
    paddingHorizontal: 20,
    borderBottomColor: '#000000',
    borderBottomWidth: 1

  },

  submitContainer:{

      paddingVertical: 10,

  },

  resetContainer:{

    paddingVertical: 5,
    backgroundColor: '#129649',
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
