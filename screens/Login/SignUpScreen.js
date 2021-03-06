import React from 'react';
import {
  SafeAreaView,
  TextInput,
  Button,
  ActivityIndicator,
  Text,
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import {Auth} from 'aws-amplify';
import {styles} from '../../styles/styles'
const FieldWrapper = ({ children, label, formikProps, formikKey }) => (
  <View style={{ marginHorizontal: 20, marginVertical: 5 }}>
    <Text style={{ marginBottom: 3 }}>{label}</Text>
    {children}
    <Text style={{ color: 'red' }}>
      {formikProps.touched[formikKey] && formikProps.errors[formikKey]}
    </Text>
  </View>
);

const StyledInput = ({ label, formikProps, formikKey, ...rest }) => {


  if (formikProps.touched[formikKey] && formikProps.errors[formikKey]) {
    styles.formBox.borderColor = 'red';
  }

  return (
    <FieldWrapper label={label} formikKey={formikKey} formikProps={formikProps}>
      <TextInput
        style={styles.formBox}
        onChangeText={formikProps.handleChange(formikKey)}
        onBlur={formikProps.handleBlur(formikKey)}
        placeholderTextColor = "#FFFFFF"
        {...rest}
      />
    </FieldWrapper>
  );
};

const StyledSwitch = ({ formikKey, formikProps, label, ...rest }) => (
  <FieldWrapper label={label} formikKey={formikKey} formikProps={formikProps}>
    <Switch
      value={formikProps.values[formikKey]}
      onValueChange={value => {
        formikProps.setFieldValue(formikKey, value);
      }}
      {...rest}
    />
  </FieldWrapper>
);

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .label('Username')
    .required(),
  email: yup
    .string()
    .label('Email')
    .email()
    .required(),
  phoneNumber: yup
    .string()
    .label('Phone Number')
    .required(),
  password: yup
    .string()
    .label('Password')
    .required()
    .min(8, 'Password must be over 8 characters')
    .max(100, 'Password must be under 100 characters'),
  confirmPassword: yup
    .string()
    .required()
    .label('Confirm password')
    .test('passwords-match', 'Passwords do not match', function(value) {
      return this.parent.password === value;
    }),
  agreeToTerms: yup
    .boolean()
    .label('By checking this, you agree to the Terms and Conditions.')
    .test(
      'is-true',
      'Must agree to terms to continue',
      value => value === true
    ),
});


function signInError(err){
  console.log(err);
  switch(err.message){
    case "Invalid phone number format.":
      alert("Invalid phone number entered. Please enter phone number in the following format: +14445556666");
      break;

    case "User already exists":
      alert("Sorry, this username is already taken.");
      break;
    default:
      Alert.alert("Sign In Error:", err.message);
      break;
  }
}
export default class SignUpScreen extends React.Component{
  state = {
    username: '',
    password: '',
    passwordConfirm: '',
    email: '',
    phoneNumber: '',
    confirmationCode: '',
  };
  render(){
    return(
  <SafeAreaView style={{ backgroundColor: "#19b7bf",flex: 1 }}>
    <ScrollView>
    <Formik
      initialValues={{
        username:'',
        email: '',
        phoneNumber:'',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
      }}
      onSubmit={(values, actions) => {}}
      validationSchema={validationSchema}
    >
      {formikProps => (
        <React.Fragment>
           <StyledInput
            label = "Username"
            formikProps={formikProps}
            formikKey="username"
            placeholder="JohnDoe"
            returnKeyType = "next"
            autoFocus={true}
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.username}
            onChange ={event => this.setState({username:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />
          <StyledInput
            label = "Email"
            formikProps={formikProps}
            formikKey="email"
            placeholder="johndoe@example.com"
            returnKeyType = "next"
            autoFocus={true}
            autoCapitalize='none'
            autoCorrect={false}
            ref = {(input) => {this.emailInput = input;}}
            value={this.state.email}
            onChange ={event => this.setState({email:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />
           <StyledInput
            label = "Phone Number"
            formikProps={formikProps}
            formikKey="phoneNumber"
            placeholder="+14445556666"
            returnKeyType = "next"
            autoFocus={true}
            autoCapitalize='none'
            autoCorrect={false}
            ref = {(input) => {this.phoneInput = input;}}
            value={this.state.phoneNumber}
            onChange ={event => this.setState({phoneNumber:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />

          <StyledInput
            label = "Password"
            formikProps={formikProps}
            formikKey="password"
            placeholder="password"
            secureTextEntry
            returnKeyType = "next"
            ref = {(input) => {this.passwordInput = input;}}
            value={this.state.password}
            onChange={event => this.setState({password: event.nativeEvent.text })}
            underlineColorAndroid = "transparent"
          />

          <StyledInput
            label = "Confirm Password"
            formikProps={formikProps}
            formikKey="confirmPassword"
            placeholder="confirm password"
            secureTextEntry
          />

          <StyledSwitch
            label="By checking this, you agree to the Terms and Conditions."
            formikKey="agreeToTerms"
            formikProps={formikProps}
          />

          {formikProps.isSubmitting ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity

        activeOpacity = { .8 }
        onPress={this._submitAsync}>
                <Text
                style={{
                        textAlign:'center',
                        color:'#FFF',
                        fontWeight: "600",
                        backgroundColor:'#db8a75',
                        // borderRadius:20,
                        borderWidth: 1,
                        padding:10
                      }}
                >
                Submit
                </Text>
        </TouchableOpacity>
          )}
        </React.Fragment>
      )}
    </Formik>
    </ScrollView>
  </SafeAreaView>
  )
}
_submitAsync = async () => {


  // TODO - fetch user token and verify user identity
  // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
  console.log("Sign Up information input from user: ");
  console.log("username:" + this.state.username);
  console.log("email   :" + this.state.email);
  console.log("phone # :" + this.state.phoneNumber);
  console.log("password:" + this.state.password);

  if ( this.state.username == null ||this.state.username== '' ){
    Alert.alert("Sign Up Error:","Please enter a username. ");
  } else if(this.state.email == null || this.state.email == ''){
    Alert.alert("Sign Up Error:","Please enter an email.");
  } else if (this.state.phoneNumber == null || this.state.phoneNumber== ''){
    Alert.alert("Sign Up Error:","Please enter a phone number with the following format: +14445556666");
  } else if (this.state.password == null || this.state.password== ''){
    Alert.alert("Sign Up Error:","Please enter a password.");
  } else {

    Auth.signUp({
      username: this.state.username,
      password: this.state.password,
      attributes: {
        email: this.state.email,
        phone_number: this.state.phoneNumber,
      },
    })
      .then(() => {
        console.log('successful sign up!')
        this.props.navigation.navigate('PNV',
              {username: this.state.username, authType: 'signup'})
      })
      .catch(err => signInError(err));


  }

};
}
