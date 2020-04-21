import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, ScrollView,Keyboard } from 'react-native';
import {styles} from '../../styles/styles'
/*=====================================================*/
/*            Reset Screen                              */
/*=====================================================*/
export default class ResetScreen extends React.Component {


  state = {

    email: '',
    phone: '',
  };

  render() {
    return (
      <View style={{backgroundColor: "#728C69", flex: 1}}>
         <ScrollView keyboardShouldPersistTaps='never'>
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <Image
            style={styles.logo}	            style={styles.logo}
            source={require('../../assets/images/islands100black.png')}	 
            />
        <Text style={styles.header}>Reset Password</Text>
        <TextInput
                placeholder="Email"
                style={styles.formBox}
                placeholderTextColor = "#000000"
                returnKeyType = "next"
                autoFocus={true}
                onSubmitEditing = {() => {this.phoneInput.focus();}}
                keyboardType="email-address"
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.email}
                onChange ={event => this.setState({email:event.nativeEvent.text})}
                underlineColorAndroid = "transparent"
            />

            <TextInput
                placeholder = "Phone Number"
                style={styles.formBox}
                placeholderTextColor = "#000000"
                keyboardType="phone-pad"
                returnKeyType="send"
                ref = {(input) => {this.phoneInput = input;}}
                value={this.state.phone}
                onChange={event => this.setState({phone: event.nativeEvent.text })}
                underlineColorAndroid = "transparent"
            />


        <TouchableOpacity style={styles.ButtonContainer}
        onPress={this._submitAsync}
        activeOpacity = { .8 }>
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
      console.log("email:" + this.state.email);
      console.log("phone:" + this.state.phone);
      this.props.navigation.navigate('SignIn');
    };
}


