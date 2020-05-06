
import React, { Component } from 'react';
import {View,
        Text,
        TextInput,
        ActivityIndicator,
        Button,
        // FlatList,
        TouchableOpacity,
        Alert ,
        AsyncStorage,
        TouchableHighlight,
        ScrollView} from "react-native";
import { SwipeListView } from 'react-native-swipe-list-view';
import {styles} from '../../styles/styles'
import {ActionType, Payload} from '../../src/payload';
import API, { graphqlOperation } from '@aws-amplify/api';
import {createMessage, deleteMessage} from '../../src/graphql/mutations';

//Should make into global function and merge with copy in ChatScreen
async function sendMessage(payload) {
  console.log("in send message")
  roomMembers = payload.roomMembers;
  console.log("roomMembers: ", roomMembers)
  sender = payload.sender;

  //Encrypt payload here

  let payloadStr = JSON.stringify(payload);

  for (var i = 0; i < roomMembers.length ; i++){
    if(roomMembers[i] != sender){
      console.log("other users: " + roomMembers[i]);
      const package_ = {
        to: roomMembers[i],
        from: sender,
        payload: payloadStr,
      };
      console.log("package: " + JSON.stringify(package_));
      const resp = await API.graphql(graphqlOperation(createMessage, { input: package_ })).then(
            console.log("AWS Success - Create Message")
          ).catch(
            (error) => {
              console.log("Error_____________________\n" ,error)
            }
          );
      console.log(resp);
    }
  }
}

async function getAuthObject() {
  // obtains userToken and parses it to access username
  var user = await AsyncStorage.getItem("userToken");
  var userTokenParsed = JSON.parse(user);
  var username = userTokenParsed.user.signInUserSession.accessToken.payload.username;
  return username; // returns a promise
}

export default class RoomSettings extends Component {
  constructor(props) {
    super(props);

    console.log(this.props.navigation.getParam('id'));
    const {navigation} = this.props;
    this.state = {
      id: this.props.navigation.getParam('id'),
      name: "",
      members: [],
      bubbleColor: "",
      textColor: "",
    }
    this.loadSettings();
  }


  renderItem = ({item}) => {
    return(
      <View style={styles.list_user}>
        <Text style={styles.list_user_text}>{item.toString()}</Text>
      </View>
    )
  }

  renderDeleteRoom = ({item}) => {
    return (
      <View style={styles.rowBack}>
            <TouchableOpacity
              style={styles.delete}
              onPress={() =>this.removeMember(item.toString())}
            >
                <Text>Delete</Text>
            </TouchableOpacity>
        </View>
    );
  }


  render(){
    return(
      <ScrollView style={{ flex: 1, /*alignItems: 'center'/*, justifyContent: 'center'*/ }}>

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

        <Text>Room Members</Text>
        <SwipeListView
          data={this.state.members}
          renderItem={this.renderItem}
          renderHiddenItem={this.renderDeleteRoom}
          keyExtractor={(item)=>item.toString()}
          leftOpenValue={0}
          rightOpenValue={-75}
          ListEmptyComponent = {<View style={styles.user}>
            <Text style={styles.list_user_text}>{"How is nobody in this room?"}</Text>
            </View>}



          ListFooterComponent= {
            <View style={styles.user_footer}>
              <TextInput
                placeholder={"Add New User"}
                style={styles.add_user}
                underlineColorAndroid = {'transparent'}
                placeholderTextColor = "#000000"
                returnKeyType = "done"
                onSubmitEditing = {() => {this.addMember();}}
                keyboardType="default"
                autoCapitalize='none'
                autoCorrect={false}
                value={this.newMember}
                onChange ={event => this.newMember = event.nativeEvent.text}
                underlineColorAndroid = "transparent"
              />
              <TouchableOpacity
              style={styles.add_user_button}
              activeOpacity = { .8 }
              onPress={() => {this.addMember();}}>
                <Text style={styles.add_user_text}>Add User</Text>
              </TouchableOpacity>
            </View>}
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

        <TouchableOpacity
          style={styles.ButtonContainer}
          activeOpacity = { .8 }
          onPress={this.confirmBackup}>
            <Text style={styles.buttonText}>Send Backup</Text>
        </TouchableOpacity>

      </ScrollView>

    )
  }

  //////////////////////
  // Settings Changes //
  //////////////////////

  removeMember = async (remove) => {
    console.log(remove)
    var newMembers = this.state.members;
    newMembers = newMembers.filter(function( member ) {
      return member.toString() !== remove;
    });
    await this.setState({members: newMembers});

    this.submitChange();
  }

  addMember = async (newMember) => {
    //TODO: add input verification
    if(newMember !== ""){
      var newMembers = this.state.members;
      newMembers.push(this.newMember);
      newMembers.sort();
      await this.setState({members: newMembers});
      this.newMember = "";

      this.submitChange();
    }
  }

  loadSettings = async () => {
    var result = await AsyncStorage.getItem(this.state.id+"settings");
    console.log("load settings from local storage:");
    if(result != null){
      console.log("not null");
      var parsed = JSON.parse(result);
      this.setState({name: parsed.name, members: parsed.members, bubbleColor: parsed.bubbleColor, textColor: parsed.textColor});
    }
    else{

    }
  }

  submitChange = async () => {
    var rooms = await AsyncStorage.getItem("rooms");
    console.log("load rooms from local storage")

    // //convert members from string to array
    // var tempMembers = this.state.members;
    // var members = tempMembers.split(",").map(function(item) {
    //   return item.trim();
    // });
    // members.sort();
    // await this.setState({members: members});

    //change room name in "rooms"
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
        // console.log(room)
        // console.log(this.state.name)
        room.name = this.state.name;
        // console.log(room.name)
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
    this.sendSettingsChange(this.state);
  }



  ///////////////
  // Messaging //
  ///////////////

  confirmBackup = async () => {
    Alert.alert(
      'Confirm Backup',
      'Are you sure you want to send a backup? This will override the message history of all other users.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this.sendBackup(this.state) },
      ],
      { cancelable: false }
    );
  }

  sendBackup = async (room) => {
    console.log("Sending Backup");
    console.log("To: " + room.members)
    var backup = await AsyncStorage.getItem(this.state.id);
    const date = new Date();
    var user = await getAuthObject();
    const payload = new Payload(
                        actionType=ActionType.BACKUP,
                        roomId=room.id,
                        roomName=room.name,
                        roomMembers=room.members,
                        from = user,
                        created = date,
                        joiningMember=null,
                        leavingMember=null,
                        textContent= backup,
                        newRoomName=null
                        ).get()
    sendMessage(payload);
  }

  sendSettingsChange = async (room) => {
    console.log("Sending Settings Change");
    console.log("To: " + room.members)
    var settings = await AsyncStorage.getItem(this.state.id+"settings");
    const date = new Date();
    var user = await getAuthObject();
    const payload = new Payload(
                        actionType=ActionType.SETTINGS_CHANGE,
                        roomId=room.id,
                        roomName=room.name,
                        roomMembers=room.members,
                        from = user,
                        created = date,
                        joiningMember=null,
                        leavingMember=null,
                        textContent= settings,
                        newRoomName=null
                        ).get()
    sendMessage(payload);
  }




}
