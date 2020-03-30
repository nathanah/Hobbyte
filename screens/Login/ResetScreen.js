import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, ScrollView,Keyboard } from 'react-native';

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
      <View style={{backgroundColor: "#129649", flex: 1}}>
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


        <TouchableOpacity style={styles.submitContainer}
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
    borderBottomColor: '#2e4257',
    borderBottomWidth: 1

  },

  submitContainer:{

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
