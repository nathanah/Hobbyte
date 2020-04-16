
// HomeScreen
// Should appear after Login page
// currently displays green screen with Sign Out button

import * as WebBrowser from 'expo-web-browser';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  AsyncStorage,
} from 'react-native';

// import Login from './Login/';

import { MonoText } from '../components/StyledText';
import {Auth} from 'aws-amplify';



/*=====================================================*/
/*            Home Screen                              */
/*=====================================================*/
export default class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Wellcome To This Super Sweet App</Text>
        <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <Button
          title="Sign out"
          onPress={this._signOutAsync}
        />



       <Button
          title="Go back to main screen"
          onPress={() => this.props.navigation.navigate('Main')}
        />
        <Button
        title="Go to conversation chat room page"
        onPress={() => this.props.navigation.navigate('ChatRoom',{ name:Auth.user.username})}
      />
      </View>
    );
  }


  /*--------------------Async------------------------*/
  _signOutAsync = async () => {
    // TODO - clear Async storage
    // await AsyncStorage.clear();
    Auth.signOut()
    .then(() => {
      console.log("Signed Out");
      this.props.navigation.navigate('SignIn'); // not redirecting for some reason
    })
    .catch(err => console.log('error confirming signing in!: ', err));
  };

}


HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#add836',
    alignContent:'center',
    paddingTop: 50,
    paddingHorizontal: 50
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },

  signOutButton:{
    backgroundColor:'#FFF',
    padding:10,
    textAlign:'center',
    fontWeight:"500",

  }
});
