import React, { Component } from 'react';
//import { Video } from 'expo-av';
import {View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput, Image, Keyboard, ScrollView, ImageBackground} from 'react-native';
import {Auth} from 'aws-amplify';
import {styles} from '../../styles/styles'
import bgImage from '../../assets/images/white_logo_text.png'
import Icon from 'react-native-vector-icons/Ionicons'
/*=====================================================*/
/*            Login Screen                              */
/*=====================================================*/
export default class LoginScreen extends React.Component {
  state = {
    username: '',
    password: '',
    confirmationCode: '',
    user: {},
    errorMessage: '',
  };
  constructor(){
    super()
    this.state = {
      showPass: true,
      press: false
    }
  }
  showPass = () => {
    if (this.state.press == false){
      this.setState({showPass:false, press:true})
    }else{
      this.setState({showPass:true, press:false})
    }
  }
  render() {
    return (
      <View style={{backgroundColor: "#19b7bf", flex: 1}}>
          <KeyboardAvoidingView behavior="height" style={styles.container}>
          <ScrollView keyboardShouldPersistTaps='never'>

          <Image
            style={styles.logo}
            source={require('../../assets/images/white_logo_text.png')}
            />
          <View>
            <Icon name = {'ios-person'} size = {28} color = {'rgba(255,255,255,0.7)'} style = {styles.inputIcon} />
          
          <TextInput
            placeholder="Username"
            style={styles.formBox}
            underlineColorAndroid = {'transparent'}
            placeholderTextColor = "#FFFFFF"
            returnKeyType = "next"
            onSubmitEditing = {() => {this.passwordInput.focus();}}
            keyboardType="email-address"
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.username}
            onChange ={event => this.setState({username:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />
</View>
<View>
<Icon name = {'ios-lock'} size = {28} color = {'rgba(255,255,255,0.7)'} style = {styles.inputIcon} />

          <TextInput
            placeholder = "Password"
            style={styles.formBox}
            placeholderTextColor = "#FFFFFF"
            secureTextEntry = {this.state.showPass}
            returnKeyType="go"
            ref = {(input) => {this.passwordInput = input;}}
            value={this.state.password}
            onChange={event => this.setState({password: event.nativeEvent.text })}
            onSubmitEditing = {this._loginAsync}
            underlineColorAndroid = "transparent"
          />
<TouchableOpacity style = {styles.btnEye}
          onPress = {this.showPass.bind(this)}>
            <Icon name = {this.state.press == false ? 'ios-eye':'ios-eye-off'} size = {26} color = {'rgba(255,255,255,0.7)'}/>
          </TouchableOpacity>
</View>
        <TouchableOpacity
        style={styles.ButtonContainer}
        activeOpacity = { .8 }
        onPress={this._loginAsync}>
                <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.sidebuttoncontainer}>

        <TouchableOpacity style={styles.resetContainer}>
                <Text style={styles.texts}
                  onPress={this._goToPasswordReset}>Forgot password?</Text>
                  </TouchableOpacity>

                  </View>
        <TouchableOpacity style = {{paddingTop:45}}>

                <Text style={styles.texts}
                  onPress={this._signUpAsync}>New User? Sign Up Here!</Text>
        </TouchableOpacity>


        </ScrollView>




      </KeyboardAvoidingView>
      </View>

    );
  }

  /*--------------------Async------------------------*/
    _loginAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Login information input from user: ");
      console.log("username:" + this.state.username);
      console.log("password:" + this.state.password);

      const { username, password } = this.state;
      Auth.signIn(username, password)
        .then(user => {
          this.setState({ user });
          console.log('successful sign in!');
          this.props.navigation.navigate('PNV',
            {user: this.state.user, authType: 'signin'})
        })
        .catch(err => console.log('error signing in!: ', err));
    };

    _resetAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Redirecting to reset page");
      this.props.navigation.navigate('Reset');
    };

    _signUpAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Redirecting to Sign Up page");
      this.props.navigation.navigate('SignUp');
    };
    _goToHome = async () => {
      if(Auth.user !== null) {
        this.props.navigation.navigate('Home', Auth.user);
      } else {
        console.log("User is ", Auth.user)
        console.log("Must login before going to home screen")
      }
    };
    _goToPasswordReset = async () => {
      console.log("Going to reset screen.")
      this.props.navigation.navigate('PRS');
    }
}
