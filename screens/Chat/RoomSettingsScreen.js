
import React, { Component } from 'react';
import { View, Text, TextInput, ActivityIndicator, Button, FlatList, TouchableOpacity, Alert , AsyncStorage, TouchableHighlight} from "react-native";
import {styles} from '../../styles/styles'


export default class RoomSettings extends Component {
  constructor(props) {
    super(props);

    console.log(this.props.navigation.getParam('id'));
    const {navigation} = this.props;
    this.state = {
      id: this.props.navigation.getParam('id'),
      name: "",
      bubbleColor: "",
      textColor: "",
    }
    this.loadSettings();
  }



  render(){
    return(
      <View style={{ flex: 1, /*alignItems: 'center'/*, justifyContent: 'center'*/ }}>

        <Text>Room Name</Text>

        <TextInput
          placeholder={this.state.name}
          style={styles.formBox}
          underlineColorAndroid = {'transparent'}
          placeholderTextColor = "#000000"
          returnKeyType = "done"
          onSubmitEditing = {() => {this.submitChange();}}
          keyboardType="default"
          autoCapitalize='none'
          autoCorrect={false}
          value={this.state.name}
          onChange ={event => this.setState({name:event.nativeEvent.text})}
          underlineColorAndroid = "transparent"
        />

        <Text>Bubble Color</Text>

        <TextInput
          placeholder={this.state.bubbleColor}
          style={styles.formBox}
          underlineColorAndroid = {'transparent'}
          placeholderTextColor = "#000000"
          returnKeyType = "done"
          onSubmitEditing = {() => {this.submitChange();}}
          keyboardType="default"
          autoCapitalize='none'
          autoCorrect={false}
          value={this.state.bubbleColor || '#0084ff'}
          onChange ={event => this.setState({bubbleColor:event.nativeEvent.text})}
          underlineColorAndroid = "transparent"
        />

        <Text>Text Color</Text>

        <TextInput
          placeholder={this.state.textColor}
          style={styles.formBox}
          underlineColorAndroid = {'transparent'}
          placeholderTextColor = "#000000"
          returnKeyType = "done"
          onSubmitEditing = {() => {this.submitChange();}}
          keyboardType="default"
          autoCapitalize='none'
          autoCorrect={false}
          value={this.state.textColor || '#000000'}
          onChange ={event => this.setState({textColor:event.nativeEvent.text})}
          underlineColorAndroid = "transparent"
        />
      </View>
    )
  }

  loadSettings = async () => {
    var result = await AsyncStorage.getItem(this.state.id+"settings");
    console.log("load settings from local storage:");
    if(result != null){
      console.log("not null");
      var parsed = JSON.parse(result);
      this.setState({name: parsed.name, bubbleColor: parsed.bubbleColor, textColor: parsed.textColor});
    }
    else{

    }
  }

  submitChange = async () => {
    var rooms = await AsyncStorage.getItem("rooms");
    console.log("load rooms from local storage")
    // console.log(rooms);

    if(rooms != null){

      var parsed = await JSON.parse(rooms);
      // console.log(parsed);
      // console.log("parsed");
      // console.log(this.state.id)


      var idx = -1
      for (let i = 0; i < parsed.length; i++){
        if (parsed[i].id == this.state.id){
          idx = i;
          break;
        }
      }

      // console.log(idx)
      if(idx != -1){
        var room = parsed[idx]
        // console.log(room)
        // console.log(this.state.name)
        room.name = this.state.name;
        // console.log(room.name)
        parsed[idx] = room;
        // console.log(parsed[idx]);
        // console.log(JSON.stringify(parsed))

        AsyncStorage.setItem("rooms", JSON.stringify(parsed));
      }
      else{
        console.log("not found")
      }
    }

    else{
      console.log("nothing in this else");
    }

    console.log("rooms updated");

    AsyncStorage.setItem(this.state.id+"settings", JSON.stringify(this.state))
  }


}
