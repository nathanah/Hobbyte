// AppNavigator
// Sets up route from auth page to login to home screen 
// Called by App.js 

/*=====================================================*/
// TO DO
// - Add async functions for obtaining user input and verifying identity 
// - remove back button in default header
// - fix spinning/slow auth page
// - 
/*=====================================================*/
import * as React from 'react';
import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import AuthLoadingScreen from "../screens/AuthLoadingScreen";
import Login from "../screens/Login/Login";


/*=====================================================*/
/*            Login Screen                              */
/*=====================================================*/
class LoginScreen extends React.Component {
  render() {
    return (
      <View style={{backgroundColor: "#d0e0f1", flex: 1}}>
         <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Login/>
        <TouchableOpacity style={styles.loginContainer}>
                <Text style={styles.buttonText} 
                  onPress={this._loginAsync}>LOGIN</Text>
        </TouchableOpacity>
        </KeyboardAvoidingView>

      </View>
    );
  }

  /*--------------------Async------------------------*/
    _loginAsync = async () => {
      // TODO - fetch user token and verify user identity 
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      this.props.navigation.navigate('Home');
    };
}

/*=====================================================*/
/*            Home Screen                              */
/*=====================================================*/
class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <Button
          title="Sign out"
          onPress={this._signOutAsync}
        />
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />


          {/* TODO - note Not sure why going back to auth page leads to spinning loading button */}
        <Button
          title="Go back to auth page"
          onPress={() => this.props.navigation.navigate('AuthLoading')}
        />
      </View>
    );
  }

  /*--------------------Async------------------------*/
  _signOutAsync = async () => {
    // TODO - clear Async storage
    // await AsyncStorage.clear();
    this.props.navigation.navigate('SignIn');
  };
  
}

/*---------------------Navigation Stack -----------------------------*/

const RootStack = createStackNavigator({
  AuthLoading: AuthLoadingScreen,
  SignIn: LoginScreen,
  Home: HomeScreen,
},
{
  initialRouteName: 'AuthLoading',
}
);

/*----------------------Styles    ----------------------------*/
const styles = StyleSheet.create ({
  container:{
    flex:1, 
    backgroundColor:'#FFDFD3'
  },

  buttonText:{
    textAlign:'center', 
    color:'#FFF',
    fontWeight: "600",
    backgroundColor:'#db8a75',
    padding:20,
    paddingBottom: 30,

}
})

/*-----------------------Export default ---------------------------*/
export default createAppContainer(RootStack);

