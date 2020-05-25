import React, { Component } from 'react';

import { View, 
        Text, 
        TouchableOpacity,  
        KeyboardAvoidingView, 
        TextInput, 
        Image, 
        ScrollView,
        Alert } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import {styles} from '../../styles/styles'
import Icon from 'react-native-vector-icons/Ionicons'
/*=====================================================*/
/*            Phone Verification Screen                */
/*=====================================================*/
export default class PasswordRecoverForm extends React.Component {


  state = {
    verificationCode: '',
    password:'',
    confirmPassword: '',
    //username: this.props.navigation.getParam('username','none'),
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
      <View style={{backgroundColor: "#728C69", flex: 1}}>
          <KeyboardAvoidingView behavior="height" style={styles.container}>
          <ScrollView keyboardShouldPersistTaps='never'>

          <Image
            style={styles.logo}
            source={require('../../assets/images/islands100black.png')}
            />
          <Text style={styles.header}>Enter your email verification code and new password!!!</Text>

          <View>
            <Icon name = {'ios-lock'} size = {28} color = {'rgba(255,255,255,0.7)'} style = {styles.inputIcon} />
            <TextInput
              placeholder="email code"
              style={styles.formBox}
              placeholderTextColor = "#000000"
              returnKeyType = "next"
              keyboardType="phone-pad"
              autoFocus={true}
              onSubmitEditing = {() => {this.refs.password.focus();}}
              autoCapitalize='none'
              autoCorrect={false}
              value={this.state.verificationCode}
              onChange ={event => this.setState({verificationCode:event.nativeEvent.text})}
              underlineColorAndroid = "transparent"
            />

          </View>

          <View>
            <Icon name = {'ios-lock'} size = {28} color = {'rgba(255,255,255,0.7)'} style = {styles.inputIcon} />
            <TextInput
              placeholder="new password"
              style={styles.formBox}
              placeholderTextColor = "#000000"
              returnKeyType = "next"
              secureTextEntry = {this.state.showPass}
              autoFocus={true}
              onSubmitEditing = {() => {this.refs.confirmPassword.focus();}} 
              autoCapitalize='none'
              autoCorrect={false}
              value={this.state.password}
              onChange ={event => this.setState({password:event.nativeEvent.text})}
              underlineColorAndroid = "transparent"
              ref = 'password'
            />
            <TouchableOpacity style = {styles.btnEye}
              onPress = {this.showPass.bind(this)}>
              <Icon name = {this.state.press == false ? 'ios-eye':'ios-eye-off'} size = {26} color = {'rgba(255,255,255,0.7)'}/>
            </TouchableOpacity>
          </View>
          <View>
            <Icon name = {'ios-lock'} size = {28} color = {'rgba(255,255,255,0.7)'} style = {styles.inputIcon} />

            <TextInput
              placeholder="confirm new password"
              style={styles.formBox}
              placeholderTextColor = "#000000"
              returnKeyType = "go"
              secureTextEntry = {this.state.showPass}
              autoFocus={true}
              onSubmitEditing = {this._passwordRestAsync}
              autoCapitalize='none'
              autoCorrect={false}
              value={this.state.confirmPassword}
              onChange ={event => this.setState({confirmPassword:event.nativeEvent.text})}
              underlineColorAndroid = "transparent"
              ref = 'confirmPassword'
            />
            <TouchableOpacity style = {styles.btnEye}
              onPress = {this.showPass.bind(this)}>
              <Icon name = {this.state.press == false ? 'ios-eye':'ios-eye-off'} size = {26} color = {'rgba(255,255,255,0.7)'}/>
            </TouchableOpacity>
          </View>

        <TouchableOpacity style={styles.ButtonContainer}
        onPress={this._passwordRestAsync}
        activeOpacity = { .8 }>
                <Text style={styles.buttonText}
                  >Submit</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.resetContainer}>
                <Text
                  onPress={this._resetAsync}>Changed phone number?</Text>
        </TouchableOpacity>

          </ScrollView>

      </KeyboardAvoidingView>
      </View>

    );
  }

  /*--------------------Async------------------------*/
  /**
   * Check the fields are not emptyu
   * check that password in long enouth
   * pront aws error
   *   state = {
    verificationCode: '',
    password:'',
    username: this.props.navigation.getParam('username','none'),
  };

   */
  _passwordRestAsync = async () => {
      if(this.state.verificationCode == '' ||
         this.state.password == '' ||
         this.state.confirmPassword == '') {
            Alert.alert("A Field Is Empty!", "Please Fill Out ALL Fields Before Trying Again!")
            return
      }
      if(this.state.password != this.state.confirmPassword) {
        Alert.alert("New Passwors/Comfirmation Password Mis-Match!",
        "Please Enter The Same Password In Both Fields!")     
        return 
      }
      if (this.state.password.length < 8) {
        Alert.alert("Your Password Is Less Than 8 Characters!", "Please Choose A Password That Is Atleast 8 Characters Long!")
        return
      }
      console.log("--------------This is password reset form--------------------------")
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      Auth.forgotPasswordSubmit(this.props.navigation.getParam('username','none'), this.state.verificationCode, this.state.password).then(
          ()=>{
            console.log("password reset complete!")
            console.log("passwars: ", this.state.password)
            Alert.alert("Success!", "Your Password Was Successfully Recovered!")
            this.props.navigation.navigate('SignIn')  
          }
      ).catch(
          (err)=>{
              console.log("password reset error: ", err)
              Alert.alert(err.code, err.messsage)
          }
      )
    };

    _resetAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Redirecting to phone reset page");
      this.props.navigation.navigate('PhoneReset');
    };
}
