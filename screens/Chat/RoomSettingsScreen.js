
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
      members: "",
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

        <TouchableOpacity
          style={styles.ButtonContainer}
          activeOpacity = { .8 }
          onPress={this.submitChange}>
            <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>


        <FlatList>
          keyExtractor={(item) => item.name}
          data={this.state.members}
          renderItem={this.renderMember}
        </FlatList>
      </View>

    )
  }
  renderMember = ({ item }) => {
    return (
      <TouchableHighlight>

        <View style={styles.list_item}>
          <Text style={styles.list_item_text}>{item.toString()}</Text>
          <Text>Hi</Text>
        </View>

        </TouchableHighlight>
    );
  }

  loadSettings = async () => {
    var result = await AsyncStorage.getItem(this.state.id+"settings");
    console.log("load settings from local storage:");
    if(result != null){
      console.log("not null");
      var parsed = JSON.parse(result);
      this.setState({name: parsed.name, bubbleColor: parsed.bubbleColor, textColor: parsed.textColor, members: parsed.members});
    }
    
    else{

    }
  }

  submitChange = async () => {
    var rooms = await AsyncStorage.getItem("rooms");
    console.log("load rooms from local storage")

    if(rooms != null){

      var parsed = await JSON.parse(rooms);
      var idx = -1
      for (let i = 0; i < parsed.length; i++){
        if (parsed[i].id == this.state.id){
          idx = i;
          break;
        }
      }

      if(idx != -1){
        var room = parsed[idx]
        room.name = this.state.name;
        parsed[idx] = room;

        AsyncStorage.setItem("rooms", JSON.stringify(parsed));
      }
      else{
        console.log("ERROR: room not found")
      }
    }

    else{
      console.log("ERROR: rooms null");
    }

    console.log("rooms updated");
    AsyncStorage.setItem(this.state.id+"settings", JSON.stringify(this.state))
  }


}
