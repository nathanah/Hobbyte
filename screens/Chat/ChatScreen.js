import React, { Component } from 'react'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import {AsyncStorage} from "react-native";
import {Icon} from 'react-native-elements';

import nacl from 'tweet-nacl-react-native-expo'


import API, { graphqlOperation } from '@aws-amplify/api';
import {createMessage, deleteMessage} from '../../src/graphql/mutations';
import {OnCreateMessageByRecipient} from '../../src/graphql/subscriptions';
import {listMessages} from '../../src/graphql/queries';
import {ActionType, Payload} from '../../src/payload';
import * as  Crypto from 'expo-crypto';
/*=====================================================*/
// ASYNC FUNCTIONS
/*=====================================================*/
async function deleteMessageAfterRead(messageId) {
  return await API.graphql(graphqlOperation(deleteMessage, { input: { id: messageId }}))
}

async function getPublicKey(member){

  console.log("getting public key for: " + member);
  const keyFromAWS = await API.graphql(graphqlOperation(listMessages, {filter:{to:{eq: "key"}, from: {eq: member}}})).then(
    console.log("retrieved key")
  ).catch(
    (error) => {
      console.log("Error_____________________\n" ,error)
    }
  );
  const keyString = JSON.stringify(keyFromAWS.data.listMessages.items[0].payload); 
  var key = keyString.replace(/[{"()"}]/g, '');
  //console.log("Key from AWS: <" + key + ">");
  key = nacl.util.decodeBase64(key); 
  //console.log("key: " + key); 
  return key;

}
/*
Requires a payload object as defined in payload.js.
TODO: add encrypion, add from field once schema is updated

Sends stringified and encrypted message object to database.
*/
async function sendMessage(payload) {
  console.log("in send message")
  var roomMembers = payload.roomMembers;
  console.log("roomMembers: ", roomMembers)
  console.log("from: "  + payload.sender);
  let payloadStr = JSON.stringify(payload);
  console.log("payloadStr " + payloadStr); 
  
  var fullPayload = {
    nonce: '',
    key: '',
    payloadEncrypted: '',
    box: true,
  };
  
  //Decoded string to be encrypted
  const strDecoded = new Uint8Array(nacl.util.decodeUTF8(payloadStr))
  //console.log("strDecoded " + strDecoded); 

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
        //console.log("myKeys" + myKeys); 
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
    //console.log("sym key" + symmetrickey); 
    // var symKey = nacl.util.decodeUTF8(symmetrickey);    

    //encrypt decoded string with nonce and key
    const EncryptedStr = nacl.secretbox(strDecoded, nonce, symmetrickey)
    //console.log("Encrypted STring" + EncryptedStr); 
    //Encrypted string encoded to base 64
    const Base64EncryptedStr = nacl.util.encodeBase64(EncryptedStr)
    fullPayload.payloadEncrypted = Base64EncryptedStr;
    //console.log("Base64EncryptedStr " + Base64EncryptedStr); 

    //Encoded key prepared to be sent
    const key_encoded = nacl.util.encodeBase64(symmetrickey)
    fullPayload.key = key_encoded; 
    fullPayload = JSON.stringify(fullPayload);

  }
  

  await getPublicKey(payload.roomMembers[0]); 
  const myKeys = await AsyncStorage.getItem('keys');

  console.log("Keys genererated: Public - " + myKeys);
          const keysObj = JSON.parse(myKeys);

  // console.log("Full payload:" + JSON.stringify(fullPayload)); 
console.log("full payload" + fullPayload); 
  console.log("private" + keysObj);

  for (var i = 0; i < roomMembers.length ; i++){
    if(roomMembers[i] != payload.sender){
      console.log("other users: " + roomMembers[i]);
      const package_ = {
        to: roomMembers[i],
        from: payload.sender,
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

function createNewChatMessage(room, messages /*must be this.state*/) {


  const messageText = messages[0].text; // messages is latest message
  const date = new Date();
  const payload = new Payload(
                      /*actionType=*/ActionType.TEXT_MESSAGE,
                      /*roomId=*/room.id,
                      /*roomName=*/room.name,
                      /*roomMembers=*/room.members,
                      /*from =*/room.username,
                      /*created = */date,
                      /*joiningMember=*/null,
                      /*leavingMember=*/null,
                      /*textContent=*/ messageText,
                      /*newRoomName=*/null
                      ).get()
  console.log("in createNewChatMessage: ", payload );
  console.log("created payload");
  sendMessage(payload);
}

async function displayOneMessage(messageObj, payload, room){
  // displays one message at a time on gifted chat and stores in AsyncStorage
  // alert("displaying");
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
      messageObj.from
  );
  let from = payload.sender;
  var addMessage = {
    _id: messageObj.id,
    text: payload.textContent,
    user: {
      _id: hash,
      name: messageObj.from,
      avatar: 'https://ui-avatars.com/api/?name=${messageObj.from}'
    },
    createdAt: payload.created, // createdAt is generated by AWS
  };
  room.setState(previousState => ({
    messages: GiftedChat.append(previousState.messages, [addMessage]),
  }));

  // todo this is not working, printing previous and duplicate messages
  // console.log("roomid??" + room.state.id );
  console.log ("storing new messages in async" + room.state.messages);
  // AsyncStorage.setItem(room.state.id, JSON.stringify(GiftedChat.append(room.state.messages, [addMessage])));
  // AsyncStorage.setItem(payload.roomId, room.state.messages).then(successMessage =>{console.log("Async store incoming message success")}).catch(fail => {console.log("fail")});
  //todo call delete mutation
  // var messageID = fullPackage.id;
  // const messageID = {
  //   filter: {id: {eq: fullPackage.id}}
  // };
  // const deleteresp = await API.graphql(graphqlOperation(deleteMessage, messageID ));
  // console.log(messagesFromQueue);


}

async function settingsChange(payload){
  AsyncStorage.setItem(payload.roomId+"settings",payload.textContent);

  var rooms = await AsyncStorage.getItem("rooms");

  if(rooms != null){
    var parsed = await JSON.parse(rooms);
    var idx = -1
    for (let i = 0; i < parsed.length; i++){
      if (parsed[i].id == payload.roomId){
        idx = i;
        break;
      }
    }

    if(idx != -1){
      var newRoom = parsed[idx]
      newRoom.name = JSON.parse(payload.textContent).name;
      parsed[idx] = newoom;

      AsyncStorage.setItem("rooms", JSON.stringify(parsed));
    }
    else{
      console.log("ERROR: room not found");
    }
  }
  else{
    console.log("ERROR: rooms null");
  }

}

function displayIncomingMessages(messagesFromQueue, currentObj){
  // Function: Takes AWS object returned from DynamoDB and adds it to Gifted Chat display

  const newMessages = messagesFromQueue.data.listMessages;
  const numMessages = newMessages.items.length;
  var k;
  for (k = 0; k < numMessages; k++){
    displayOneMessage(newMessages.items[k], currentObj);
  }
}

// todo need to fix this
async function getNewMessages(currentObj, roomId){
  // query messages in DynamoDB queue
  // need to update new query with correct filter of to field

  const roomFilter = {
    filter: {roomId: {contains: roomId}}
  };
  // console.log("loading messages from DynamoDB queue:");

  // load messages in waiting in DynamoDB queue
  // const messagesFromQueue = await API.graphql(graphqlOperation(listMessages, roomFilter ));
  // console.log(messagesFromQueue);

  // todo filter messages ONLY from other users to display
  // displayIncomingMessages(messagesFromQueue, currentObj);

}


/*=====================================================*/
// ChatScreen Component
/*=====================================================*/

class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    var username = getAuthObject(); // get username from userToken
    const {navigation} = this.props;
    this.state = {
      textColor: "",
      backgroundColor: "",
      messages: [],
      loadEarlier: true,
      isLoadingEarlier: false,
      typingText: null,
      isTyping: false,
      appIsReady: false,

      name: this.props.navigation.getParam('name'),
      id: this.props.navigation.getParam('id'),
      members: this.props.navigation.getParam('members'),
      username: "temp",
    }
  }


  // Displays Room name and settings gear
  static navigationOptions = ({navigation}) => ({
      title: (navigation.state.params || {}).name || "Chat!",
      id: (navigation.state.params || {}).id || 0,
      headerRight:
          <Icon
          style={{ paddingRight: 10 }}
          onPress={() => navigation.navigate('RoomSettings', { "id": (navigation.state.params || {}).id})}
          name="settings"
          size={30}
        />
  });

  // this currently brings in name  and id of room
  get user() {
      return{
          name: this.props.navigation.getParam('name'),
          id: this.props.navigation.getParam('id'),
      };
  }

  componentDidMount() {
      this._isMounted = true,

    this.setState({
      messages: []
    })
    this.loadMessages(this.state.id);
    this.loadSettings(this.state.id);
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.loadSettings(this.state.id);
      this.loadMessages(this.state.id);
    });
    this.loadUsername();
  }


  componentWillUnmount() {
      this._isMounted = false;
      this.subscription.unsubscribe();
  }

  onSend(messages = []) {
    console.log("send message:" + JSON.stringify(messages));
    const room = this.user;

    console.log("Room name:" + room.name);
    console.log("username :" + this.state.username);

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    console.log(this.state.id)
    AsyncStorage.setItem(this.state.id, JSON.stringify(GiftedChat.append(this.state.messages, messages)));
    createNewChatMessage(this.state, messages);
  }

  loadUsername = async () => {
    var username = await getAuthObject();
    this.setState({"username": username})
    console.log("user: "+this.state.username)
    this.subscription = API.graphql(
      graphqlOperation(OnCreateMessageByRecipient, {to: this.state.username})
      ).subscribe({
      error: err => console.log("______________ERROR__________", err),
      next: event => {

          var messageId = event.value.data.onCreateMessageByRecipient.id
          let recpt = deleteMessageAfterRead(messageId)
          // console.log("delete: ", recpt)
          const newMessage = JSON.stringify(event.value.data, null, 2);
          console.log("New Message on ChatScreen: " + newMessage);
          this.onReceive(event.value.data);

      }
      });
  }

  //load messages from local storage and display
  loadMessages = async (key) => {
    const messageItems = this;
    var result = await AsyncStorage.getItem(key);
    console.log("load messages from local storage:" + result);
    if(result != null && result.length){
      result = JSON.parse(result);
      // result.sort((a,b) => b.createdAt - a.createdAt);
      console.log("not null");
      this.setState({messages: result});
    }
    else{
      this.setState({
        messages: []
      })
    }


    try{
      getNewMessages(this, this.state.id);
    } catch (err){
      console.log(err);
    }

    var rooms = await AsyncStorage.getItem("rooms");
    rooms = JSON.parse(rooms);
    for (var i = 0; i < rooms.length; i++){
      var roomItem = rooms[i];
      if (roomItem.id == key){
        rooms[i].unreadCount = 0;
        await AsyncStorage.setItem("rooms", JSON.stringify(rooms));
    }
  }
      // map to gifted chat and display
      // save to local storage
  }

  //load settings from local storage and update state
  loadSettings = async (key) => {
    var result = await AsyncStorage.getItem(key+"settings")
    console.log("load settings from local storage:")
    if(result != null){
      console.log("not null");
      var parsed = JSON.parse(result)
      console.log(parsed.name)
      this.setState({name: parsed.name, bubbleColor: parsed.bubbleColor, textColor: parsed.textColor})
      this.props.navigation.state.params.name = this.state.name;

    }
    else{
      console.log("ERROR: settings are null")
    }
  }

////////////////////
//Message handling//
////////////////////


  //change name----UNTESTED
  changeName = async (id, newName) => {
    //change room name in the room list
    var rooms = await AsyncStorage.getItem("rooms");
    console.log("load rooms from local storage")

    if(rooms != null){

      var parsed = await JSON.parse(rooms);
      var idx = -1
      for (let i = 0; i < parsed.length; i++){
        if (parsed[i].id == id){
          idx = i;
          break;
        }
      }

      if(idx != -1){
        var room = parsed[idx]
        room.name = newName;
        parsed[idx] = room;
        AsyncStorage.setItem("rooms", JSON.stringify(parsed));
      }
      else{
        console.log("room with that ID was not found")
        //Make room with that id?
      }
    }
    else{
      console.log("rooms null");
      //TODO: make rooms list?
    }

    //change room name in room settings
    var settings = JSON.parse(await AsyncStorage.getItem(id+"settings"))
    if(settings != null){
      settings.name = newName;
      AsyncStorage.setItem(id+"settings", JSON.stringify(settings))
      console.log("rooms updated");
    }
    else{
      console.log("room with that ID does not exist")
      //TODO: make room with that ID?
    }
  }

  renderBubble = props => {
    return(
      <Bubble
        {...props}
        textStyle={{
          left: {
            color: this.state.textColor || 'white'
          },
          right: {
            color: this.state.textColor || 'white'
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: this.state.bubbleColor || '#0084ff'
          },
          right: {
            backgroundColor: this.state.bubbleColor || '#0084ff'
          },
        }}
      />
    )
  }

  onReceive = async(messageObject) => {
    
    try{
      
      // parse incomingMessageItem payload and save into new variable
      var messageObj = messageObject.onCreateMessageByRecipient;
      var payload = messageObj.payload;
      payload = JSON.parse(payload);
      //console.log("payload after parse  " + JSON.stringify(payload )); 
         //If the roommember is the sender
         if(payload.box){

          //Acquire sender public key
          var sender_public_key= await getPublicKey(messageObj.from);
             
          //Acquire recipient private key
          const myKeys = await AsyncStorage.getItem('keys');
          const keysObj = JSON.parse(myKeys);
          var recipient_private_key = nacl.util.decodeBase64(keysObj.secret);
          //console.log("recipient_ private key: "  + recipient_private_key); 

          //Make shared key
          // const recipientSharedKey = nacl.box.before(recipient_private_key, sender_public_key)
          const recipientSharedKey = nacl.box.before(sender_public_key, recipient_private_key); 
          //console.log("shared key: " + recipientSharedKey); 

          //Decoded payload
          const decoded_payload_message = nacl.util.decodeBase64(payload.payloadEncrypted)
          //console.log("decoded payload " + decoded_payload_message)

          const nonceDecrypted = nacl.util.decodeBase64(payload.nonce);
          //console.log("nonce decrypted: " + nonceDecrypted); 
          //Decrypt the payload with nonce and shared key
          const decoded_decrypted_payload = nacl.box.open.after(decoded_payload_message, nonceDecrypted, recipientSharedKey) 
          //console.log("decoded decrypted " + decoded_decrypted_payload); 
          //Encode back to UTF8. Final decrypted payload
          const decrypted_payload = nacl.util.encodeUTF8(decoded_decrypted_payload)
          //console.log("decrypted payload" + decrypted_payload);

          var final_decoded_message = JSON.parse(decrypted_payload);
          //console.log("final decrypted "+ final_decoded_message); 
      
        }else{
          console.log("using secret box"); 
          //Decode the provided key (in payload)
          const keyUint8Array = nacl.util.decodeBase64(payload.key);
  
          //decoded message to be decrypted
          const decoded_payload_message = nacl.util.decodeBase64(payload.payloadEncrypted);
          const nonceDecrypted = nacl.util.decodeBase64(payload.nonce);
          //console.log("nonce decrypted: " + nonceDecrypted); 
        
          const decrypted = nacl.secretbox.open(decoded_payload_message, nonceDecrypted, keyUint8Array);
        
          if (!decrypted) {
            throw new Error("Could not decrypt message");
          }
        
          const base64DecryptedMessage = nacl.util.encodeUTF8(decrypted);
          // return JSON.parse(base64DecryptedMessage);
          var final_decoded_message = JSON.parse(base64DecryptedMessage);
          //console.log("final decrypted "+ JSON.stringify(final_decoded_message)); 
      
        }


      payload = final_decoded_message;
      /*
      const decrypted = decrypt(payload, messageObj.key);
      */
      

      // var nonce = payload.nonce; 
      // var key = payload.key; 
      // var encryptedPayload = payload.payload;

      // sort message into correct room
      var roomObj = await AsyncStorage.getItem(payload.roomId);
      //make room if room does not exist locally
      if(roomObj == null){
        await this.makeRoom(payload);
        roomObj = await AsyncStorage.getItem(payload.roomId);
      }

      console.log("payload: " + JSON.stringify(payload));
      console.log("action type" + payload.actionType);
      switch(payload.actionType){
        //Incoming text message
        case ActionType.TEXT_MESSAGE:{
          if (payload.roomId == this.state.id){
            displayOneMessage(messageObj, payload, this);
          }
          break;
        }
        //settings change
        case ActionType.SETTINGS_CHANGE:{
          await settingsChange(payload);
          this.loadSettings(this.state.id);
          console.log("TODO: Implement settings change");
          break;
        }
        //Backup Requested
        case ActionType.BACKUP:{
          AsyncStorage.setItem(payload.roomId,payload.textContent);
          break;
        }
        //id collision fix?
        case 6:{
          console.log("TODO: ? ") ;
          break;
        }
        //Case not recognized (version not up to date or )
        default:
          console.log("Message id not recognized");
      }
    }
    catch(err){
      console.log("message receive error: " + err)
    }



  }



  render() {
    return (
      <GiftedChat
        title
        messages={this.state.messages}
        scrollToBottom
        renderBubble = {this.renderBubble}
        loadEarlier = {this.state.loadEarlier}
        isLoadingEarlier = {this.state.isLoadingEarlier}
        onLongPressAvatar = {user => alert(JSON.stringify(user))}
        onPressAvatar = {() => alert('short press')}
        keyboardShouldPersistTaps = 'never'
        isTyping={this.state.isTyping}
        onSend={messages => this.onSend(messages)}
        alwaysShowSend = {true}
        renderUsernameOnMessage = {true}
        showAvatarForEveryMessage = {true}
        user={{
          _id: 1,
        }}

      />
    )
  }
}

export default ChatScreen;
