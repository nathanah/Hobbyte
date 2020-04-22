
// AuthLoadingScreen
// First landing page when user enters app
// Frontend: Displays App Logo
// Backend: Fetches user token to determine if user needs sign in again
// NO longer being called - need to add back into App Navigator 1/31/2020 Abby


import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StatusBar, AsyncStorage} from 'react-native';

export default class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this._bootstrapAsync();
  }

   // Fetch the token from storage then navigate to our appropriate place
   _bootstrapAsync = async () => {

    // TODO This logic needs to be implemented once database is set up
    const userToken = JSON.parse(await AsyncStorage.getItem('userToken'));

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.

    if(userToken){
      this.props.navigation.navigate('Home', userToken.username);
    }
    else

    // TODO This logic needs to be implemented once we obtain userToken
      // then user is redirected to SignIn or Home
    // this.props.navigation.navigate(userToken ? 'SignIn' : 'Home');
      this.props.navigation.navigate('SignIn');
  };

  render() {
    return (
      <View style={styles.container}>
        <Text > AuthLoadingScreen </Text>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#728C69',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
