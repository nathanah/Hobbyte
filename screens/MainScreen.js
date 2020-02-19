import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator} from 'react-navigation-tabs';
import {Icon} from 'react-native-elements';
import {Auth} from 'aws-amplify';
import ChatScreen from "../screens/Chat/ChatScreen";
import ChatRoom from "../screens/Chat/ChatRoomScreen";
import {
    Image,
    Platform,
    ScrollView,
    TouchableOpacity,
    Button,
    AsyncStorage,
  } from 'react-native';

export default class MainScreen extends React.Component {
  render() {
    return (
        <AppContainer />
    );
  }
}

class StartScreen extends React.Component {
  render() {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text> This is my Start screen </Text>

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
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
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
          console.log("Signed Out")
          this.props.navigation.navigate('SignIn')
        })
        .catch(err => console.log('error confirming signing in!: ', err));
      };
    
    
}

class ListScreen extends React.Component {
  render() {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {/* <ChatScreen/> */}
        {/* <Text> This is my chat rooms screen </Text> */}
        <ChatRoom />
      </View>
    );
  }
}
class ExploreScreen extends React.Component {
    render() {
      return(
        <View style={{flex: 1}}>
          <ChatScreen/>
        </View>
      );
    }
  }

// Need to redo this... should only be one navigator!!! 
// https://reactnavigation.org/docs/en/common-mistakes.html
const bottomTabNavigator = createBottomTabNavigator(
    {
      Start: {
        screen: StartScreen,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <Icon name="home" size={25} color={tintColor} />
          )
        }
      },
      Chat: {
        screen: ExploreScreen,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <Icon name="chat" size={25} color={tintColor} />
          )
        }
      },
      List: {
        screen: ListScreen,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <Icon name="chat" size={25} color={tintColor} />
          )
        }
    },
      
    },
    {
      initialRouteName: 'Start',
      tabBarOptions: {
        activeTintColor: '#eb6e3d'
      }
    }
  );



  
const AppContainer = createAppContainer(bottomTabNavigator);