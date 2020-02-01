import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, StatusBar, AsyncStorage} from 'react-native';
export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
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
                onSubmitEditing = {() =>this.passwordInput.focus()}
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
                val = {(input) => this.passwordInput = input}
            />

            <TouchableOpacity style={styles.loginContainer}>
                <Text style={styles.buttonText} onPress={this._loginAsync}>LOGIN</Text>
            </TouchableOpacity>


        </View>
    </View>
    );
  }

  
_loginAsync = async () => {
    // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
    this.props.navigation.navigate('App');
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

    }

});

