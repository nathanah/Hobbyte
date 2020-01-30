import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, KeyboardAvoidingView } from 'react-native';
import LoginForm from './LoginForm';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
    
          <View style = {styles.appLogo}>
            
            <Image 
            style={styles.logo}
            source={require('../../assets/images/bilbo.png')}
            />

            <Text style={styles.title}>Welcome to The Shire</Text>
          </View>

          <View style={styles.loginContainer}>
            < LoginForm />
          </View>
    
      </KeyboardAvoidingView>
    );
  }


  
}

const styles = StyleSheet.create({
   container:{
       flex:1, 
       backgroundColor:'#FFDFD3'
   }, 

   appLogo: {
    alignItems: 'center',
    flexGrow:1, 
    justifyContent: 'center'
   },

   loginContainer:{

   },

   logo:{
    width:100, 
    height: 200
   },

   title:{
       fontSize: 15,
       marginTop: 15, 
       width: 200, 
       textAlign: 'center',
       opacity: 0.9,
   }
});