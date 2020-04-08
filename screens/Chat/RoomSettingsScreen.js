
import React, { Component } from 'react';
import { View, Text, TextInput, ActivityIndicator, Button, FlatList, TouchableOpacity, Alert , AsyncStorage, TouchableHighlight} from "react-native";
import {styles} from '../../styles/styles'


export default class RoomSettings extends Component {
  constructor(props) {
    super(props);

    const {navigation} = this.props;
    this.state = {
      id: this.props.navigation.getParam('id'),
      title: "",
      bubbleColor: "",
      textColor: "",
    }
    this.loadSettings();
  }



  render(){
    return(
      <View style={{ flex: 1, /*alignItems: 'center'/*, justifyContent: 'center'*/ }}>
        <Text> Settings aren't implemented yet</Text>


        <Text>Room Name</Text>

        <TextInput
          placeholder={this.state.title}
          style={styles.formBox}
          underlineColorAndroid = {'transparent'}
          placeholderTextColor = "#000000"
          returnKeyType = "done"
          onSubmitEditing = {() => {this.submitNameChange();}}
          keyboardType="default"
          autoCapitalize='none'
          autoCorrect={false}
          value={this.state.title}
          onChange ={event => this.setState({title:event.nativeEvent.text})}
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
      this.setState({title: parsed.title, bubbleColor: parsed.bubbleColor});
    }
    else{

    }
  }

  submitNameChange = async () => {
    var rooms = await AsyncStorage.getItem("rooms");
    console.log("load rooms from local storage")
    console.log(rooms);

    if(rooms != null){

      var parsed = await JSON.parse(rooms);
      console.log(parsed);
      console.log("parsed");
      console.log(this.state.id)

      // var tempId = this.state.id
      // var room = parsed.filter(function( roomSearch ) {
      //   return roomSearch.id.toString() == tempId;
      // });
      var idx = -1
      // parsed.findIndex((room => room.id == this.state.id))
      for (let i = 0; i < parsed.length; i++){
        if (parsed[i].id == this.state.id){
          idx = i;
          break;
        }
      }

      // console.log(room);
      // var idx = parsed.indexOf(room);
      console.log(idx)
      if(idx != -1){
        var room = parsed[idx]
        console.log(room)
        console.log(this.state.title)
        room.name = this.state.title;
        console.log(room.name)
        parsed[idx] = room;
        console.log(parsed[idx]);

        console.log(JSON.stringify(parsed))

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
