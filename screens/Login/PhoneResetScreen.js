import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, ScrollView,Keyboard } from 'react-native';

/*=====================================================*/
/*            Phone Reset Screen                       */
/*=====================================================*/
export default class PhoneResetScreen extends React.Component {


  state = {

    email: '',
    phone: '',
  };

  render() {
    return (
      <View style={{backgroundColor: "#b5e788", flex: 1}}>
         <ScrollView keyboardShouldPersistTaps='never'>
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <Image
            style={styles.logo}	            style={styles.logo}
            source={require('../../assets/images/logo.png')}
            />
        <Text style={styles.header}>Reset Phone Number</Text>
        <TextInput
                placeholder="Email"
                style={styles.formBox}
                placeholderTextColor = "#2e4257"
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


        <TouchableOpacity style={styles.submitContainer}>
                <Text style={styles.buttonText}
                  onPress={this._submitAsync}>SUBMIT</Text>
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
      backgroundColor: '#FFF',
      marginBottom: 15,
      paddingHorizontal: 20,

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
      padding:10

  },

  logo: {
    width: 100,
    height:200,
    marginBottom:30

  }

});
