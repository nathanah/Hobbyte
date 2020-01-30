
// AuthLoadingScreen
// First landing page when user enters app 
// Frontend: Displays App Logo 
// Backend: Fetches user token to determine if user needs sign in again

import React, { Component } from 'react';

import {
    ActivityIndicator, 
    AsyncStorage, 
    StatusBar, 
    StyleSheet, 
    View, 
    Text
} from 'react-native';


export default class AuthLoadingScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {
      };
      this._bootstrapAsync();
    }
  
    render() {
      return (
          <View behavior="padding" style={styles.container}>
      
            <View style = {styles.container}>
              <Text >auth page</Text>
            </View>
  
     
        </View>
      );
    }

      // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };
  }


  const styles = StyleSheet.create({
    container: {
        flex:1, 
        backgroundColor:'#FFDFD3',
        alignItems:'center',
        flexGrow:1,
        justifyContent:'center'
    }, 
    loadingIcon:{
        
    }
  })
  