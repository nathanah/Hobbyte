
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
import {listMessages} from '../../src/graphql/queries';
import nacl from 'tweet-nacl-react-native-expo'



async function getPublicKey(member){	
  console.log("getting public key for: " + member);	
  const keyFromAWS = await API.graphql(graphqlOperation(listMessages, {filter:{to:{eq: "key"}, from: {eq: member}}})).then(	
    console.log("retrieved key")	
  ).catch(	
    (error) => {	
      console.log("Error_____________________\n" ,error)	
    }	
  );	
  console.log(keyFromAWS)	
  const keyString = JSON.stringify(keyFromAWS.data.listMessages.items[0].payload); 	
  var key = keyString.replace(/[{"()"}]/g, '');	
  console.log("Key from AWS: <" + key + ">");	
  key = nacl.util.decodeBase64(key); 	
  console.log("key: " + key); 	
  return key;	
}
//Should make into global function and merge with copy in ChatScreen
async function sendMessage(payload) {
  console.log("in send message")
  roomMembers = payload.roomMembers;
  console.log("roomMembers: ", roomMembers)
  var sender = payload.sender;

  //Encrypt payload here



  let payloadStr = JSON.stringify(payload);

  var fullPayload = {	
    nonce: '',	
    key: '',	
    payloadEncrypted: '',	
    box: true,	
  };	
  	
  //Decoded string to be encrypted	
  const strDecoded = new Uint8Array(nacl.util.decodeUTF8(payloadStr))	
  console.log("strDecoded " + strDecoded); 	
  //new nonce being generated	
  const nonce = await nacl.randomBytes(24)	
  var encryptedNonce = nacl.util.encodeBase64(nonce);	
  	
  fullPayload.nonce = encryptedNonce; 	
  	
  //If the conversation is between 2 (box)	
  if (roomMembers.length==2){	
    console.log("using box");	
    for (var i = 0; i < roomMembers.length ; i++){	
      //If the member is not the sender (recipient)	
      if(roomMembers[i] != payload.sender){	
        //Retrieve decoded public key	
        var recipient_public_key = await getPublicKey(roomMembers[i]);	
        //Retrieve sender's private key	
        const myKeys = await AsyncStorage.getItem('keys');	
        const keysObj = JSON.parse(myKeys);	
        console.log("myKeys" + myKeys); 	
        var sender_private_key = nacl.util.decodeBase64(keysObj.secret);	
        //Create shared key	
        const mySharedKey = nacl.box.before(recipient_public_key, sender_private_key)	
        //Encrypt the message and convert to Base64 format. Base64EncryptedStr is message to be sent.	
        const EncryptedStr = nacl.box.after(strDecoded, nonce, mySharedKey)	
        const Base64EncryptedStr = nacl.util.encodeBase64(EncryptedStr)	
        fullPayload.payloadEncrypted =  Base64EncryptedStr ;	
        fullPayload = JSON.stringify(fullPayload);	
      }	
    }	
     	
    	
  }	
  //If the conversation is between multiple users (secretbox)	
  else{	
    console.log("using secret box");	
    fullPayload.box = false; 	
    //Generate random key	
  	
    const symmetrickey = await nacl.randomBytes(32)	
    console.log("sym key" + symmetrickey); 	
    // var symKey = nacl.util.decodeUTF8(symmetrickey);    	
    //encrypt decoded string with nonce and key	
    const EncryptedStr = nacl.secretbox(strDecoded, nonce, symmetrickey)	
    console.log("Encrypted STring" + EncryptedStr); 	
    //Encrypted string encoded to base 64	
    const Base64EncryptedStr = nacl.util.encodeBase64(EncryptedStr)	
    fullPayload.payloadEncrypted = Base64EncryptedStr;	
    console.log("Base64EncryptedStr " + Base64EncryptedStr); 	
    //Encoded key prepared to be sent	
    const key_encoded = nacl.util.encodeBase64(symmetrickey)	
    fullPayload.key = key_encoded; 	
    fullPayload = JSON.stringify(fullPayload);	
  }	
  	
  const myKeys = await AsyncStorage.getItem('keys');	
  console.log("Keys genererated: Public - " + myKeys);	
          const keysObj = JSON.parse(myKeys);	
  // console.log("Full payload:" + JSON.stringify(fullPayload)); 	
console.log("full payload" + fullPayload); 	
  console.log("private" + keysObj);

  for (var i = 0; i < roomMembers.length ; i++){
    if(roomMembers[i] != sender){
      console.log("other users: " + roomMembers[i]);
      const package_ = {
        to: roomMembers[i],
        from: sender,
        payload: fullPayload,
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
                value={this.state.newMember}
                // onChange ={event => {this.newMember = event.nativeEvent.text;}}
                onChange ={event => this.setState({newMember: event.nativeEvent.text })}
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
      newMembers.push(this.state.newMember);
      newMembers.sort();
      await this.setState({members: newMembers, newMember: ""});
      // this.newMember = "";
      delete this.state.newMember;
      console.log(this.state);

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
    console.log("load rooms from local storage");
    var rooms = await AsyncStorage.getItem("rooms");

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

    //remove unwanted state variables
    delete this.state.newMember;

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
