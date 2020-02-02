// No longer being used -- was not 

import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, StatusBar, AsyncStorage} from 'react-native';


// import HomeScreen from "../../screens/HomeScreen";
export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    
  }

_loginAsync = async () => {
    // TODO - fetch user token and verify user identity 
    // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
    this.props.navigation.navigate('Home');
  }




  render() {
    // const {navigate} = this.props.navigation;
    return (
        <View style={styles.container}>
            <StatusBar
                barStyle = "dark-content"
            />
        
   
        <View style={styles.container}>
        
            <TextInput 
                placeholder="Username"
                style={styles.formBox}
                placeholderTextColor = "#2e4257"
                returnKeyType = "next"
                // onSubmitEditing = {() =>this.passwordInput.focus()} // need to fix
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
                // val = {(input) => this.passwordInput = input} // need to fix 
            />

            <TouchableOpacity style={styles.loginContainer}>
                <Text style={styles.buttonText}>LOGIN from LoginForm</Text>
            </TouchableOpacity>


        </View>
    </View>
    );
  }
}

// Navigate doesn't work here for some reason so it is all in AppNavigator.js
//   onPress={this._loginAsync}


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

    }

});