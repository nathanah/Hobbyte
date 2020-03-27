import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppNavigator from './navigation/AppNavigator';
import MainScreen from './screens/MainScreen';
// import ChatRoom from './screens/Chat/ChatRoomScreen';
// import ChatScreen from './screens/Chat/ChatScreen';

/*John - This is setup for Amplify*/
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);
global.Buffer = global.Buffer || require('buffer').Buffer
/*</John>*/

// Abby - Setup for AWS AppSync and Apollo
// import AWSAppSyncClient from "aws-appsync";
// import {ApolloProvider} from "react-apollo";
// import {Rehydrated} from "aws-appsync-react";
// import AppSyncConfig from "./aws-exports";

import { Component } from 'react';
import { Switch, Route, BrowserRouter as Router, ServerRouter } from 'react-router-dom';
import {createMemoryHistory} from 'history';
const history = createMemoryHistory();



/*=====================================================*/
/*                      MAIN                           */
/*=====================================================*/



export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
        {/* <MainScreen /> */}
      </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/logo.png'),
      require('./assets/images/logo-small.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#d0e0f1",
  },
});
