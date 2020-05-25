import React, { Component } from 'react';
import {styles} from '../../styles/styles'
import {View, 
        Text, 
        TouchableOpacity, 
        KeyboardAvoidingView, 
        TextInput, 
        Image, 
        ScrollView,
        Alert } from 'react-native';
import {Auth} from 'aws-amplify';

/*=====================================================*/
/*            Reset Screen                              */
/*=====================================================*/
export default class PasswordResetScreen extends React.Component {


  state = {
    username: ''
  };

  render() {
    return (
      <View style={{backgroundColor: "#19b7bf", flex: 1}}>
         <ScrollView keyboardShouldPersistTaps='never'>
          <KeyboardAvoidingView behavior="height" style={styles.container}>
          <Image
            style={styles.logo}	            style={styles.logo}
            source={require('../../assets/images/white_logo_notext.png')}	 
            />
        <Text style={styles.title}>Reset Password</Text>
        <TextInput
          placeholder="username"
          style={styles.formBox}
          underlineColorAndroid = {'transparent'}
          placeholderTextColor = "#FFFFFF"
          returnKeyType = "go"
          onSubmitEditing = {this._submitAsync}
          keyboardType="email-address"
          autoCapitalize='none'
          autoCorrect={false}
          value={this.state.username}
          onChange ={event => this.setState({username:event.nativeEvent.text})}
          underlineColorAndroid = "transparent"
        />

        {/* <TextInput
          placeholder="Username"
          style={styles.formBox}
          placeholderTextColor = "#FFFFFF"
          returnKeyType = "submit"
          autoFocus={true}
          onSubmitEditing = {this._submitAsync}
          keyboardType="email-address"
          autoCapitalize='none'
          autoCorrect={false}
          value={this.state.username}
          onChange ={(event) => {
            this.setState({username:event.nativeEvent.text})
            console.log("Username: ", this.state.username)
          }}
          underlineColorAndroid = "transparent"
        /> */}


        <TouchableOpacity style={styles.ButtonContainer}
        activeOpacity = { .8 }
        onPress={this._submitAsync}>
                <Text style={styles.buttonText}
                  >SUBMIT</Text>
        </TouchableOpacity>


        </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }

  /*--------------------Async------------------------*/

    handelError(error) {
      if(error.code == 'UserNotFoundException') {
        Alert.alert("User Name Does Not Exist!"
        ,"Please Enter The Correct Username!")
      } else if(error.code == 'InvalidParameterException'){
        Alert.alert("Unverified Email!",
        "Your Password Can Only Be Recovered If You Have Verified Your Email :(")
      } else if(error.code == 'LimitExceededException') {
        Alert.alert("Attempt Limit Reached!", 
        "Please Wait A While And Try Again!")
      } else {
        Alert.alert(error.code, error.message)
      }
      /**
 * 
 *  Email not Verified
 * Object {
  "code": "InvalidParameterException",
  "message": "Cannot reset password for the user as there is no registered/verified email or phone_number",
  "name": "InvalidParameterException",
}



//User name not found
Object {
  "code": "UserNotFoundException",
  "message": "Username/client id combination not found.",
  "name": "UserNotFoundException",
}

//Too many atempts
THis is username:  user
Object {
  "code": "LimitExceededException",
  "message": "Attempt limit exceeded, please try after some time.",
  "name": "LimitExceededException",
}

 */
    }
    _submitAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      if(this.state.username == ''){
        Alert.alert("You Did Not Enter Your User Name!", "Please Enter Your User Name And Try Again!")
        return
      }
      console.log("THis is username: ", this.state.username)
      Auth.forgotPassword(this.state.username).then(
        ()=> {
          console.log("init password reset.. going to PRF")
          this.props.navigation.navigate('PRF', {authType: "password_reset", username: this.state.username})
        }
     ).catch(
       (err)=>{
         console.log(err)
         this.handelError(err)
         this.props.navigation.navigate('PRR')
       }
     )
    };
}


/**
 * 
 *  Email not Verified
 * Object {
  "code": "InvalidParameterException",
  "message": "Cannot reset password for the user as there is no registered/verified email or phone_number",
  "name": "InvalidParameterException",
}



//User name not found
Object {
  "code": "UserNotFoundException",
  "message": "Username/client id combination not found.",
  "name": "UserNotFoundException",
}

//Too many atempts
THis is username:  user
Object {
  "code": "LimitExceededException",
  "message": "Attempt limit exceeded, please try after some time.",
  "name": "LimitExceededException",
}

 */