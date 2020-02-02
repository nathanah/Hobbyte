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
import { Button, View, Text, TouchableOpacity, StyleSheet,  TextInput } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import AuthLoadingScreen from "../screens/AuthLoadingScreen";
import LoginScreen from "../screens/Login/LoginScreen";




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

//Define different pages
const RootStack = createStackNavigator({
  AuthLoading: AuthLoadingScreen,
  //once authloade is loaded, gets taken to see if signed in. if yes, goes to log in screen.else goes to ho
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

},
  formBox:{
    height: 45,
    backgroundColor: '#FFF',
    marginBottom: 20,
    paddingHorizontal: 20,

  },
  })

  /*-----------------------Export default ---------------------------*/
  export default createAppContainer(RootStack);