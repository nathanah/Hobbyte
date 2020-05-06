import React from 'react'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import {AsyncStorage} from "react-native";
import {Icon} from 'react-native-elements';

import API, { graphqlOperation } from '@aws-amplify/api';
import {createMessage, deleteMessage} from '../../src/graphql/mutations';
import {OnCreateMessageByRecipient} from '../../src/graphql/subscriptions';
import {listMessages} from '../../src/graphql/queries';
import {ActionType, Payload} from '../../src/payload';

/*=====================================================*/
// ASYNC FUNCTIONS
/*=====================================================*/
async function deleteMessageAfterRead(messageId) {
  return await API.graphql(graphqlOperation(deleteMessage, { input: { id: messageId }}))
}

/*
Requires a payload object as defined in payload.js.
TODO: add encrypion, add from field once schema is updated
Sends stringafied adn encrypted message object to database.
*/
async function sendMessage(payload) {
  console.log("in send message")
  roomMembers = payload.roomMembers;
  console.log("roomMembers: ", roomMembers)
  //Look up public keys of all room members in room
  //const publicKeys = await eThree.findUsers(roomMembers);

  
  sender = payload.sender;

  let payloadStr = JSON.stringify(payload);
  //encrypt the stringified payload. The sender signs with with their private key.
  //The reciepient's public key is used to encrypt the data.
  //const encryptedText = await eThree.authEncrypt(payloadStr, publicKeys);



  for (var i = 0; i < roomMembers.length -1; i++){
    console.log("other users: " + roomMembers[i]);
    const package_ = {
      to: roomMembers[i],
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
                      actionType=ActionType.TEXT_MESSAGE,
                      roomId=room.id,
                      roomName=room.name,
                      roomMembers=room.members,
                      from =room.username,
                      created = date,
                      joiningMember=null,
                      leavingMember=null,
                      textContent= messageText,
                      newRoomName=null
                      ).get()
  console.log("in createNewChatMessage: ", payload );
  console.log("created payload");
  sendMessage(payload);
}

function displayOneMessage(messageObj, payload, room){
  // displays one message at a time on gifted chat and stores in AsyncStorage
  console.log("date: " +messageObj.created);
  let from = payload.from;
  var addMessage = {
    _id: messageObj.id,
    text: payload.textContent,
    user: {_id:from, name: from},
    createdAt: payload.created, // createdAt is generated by AWS
  };
  room.setState(previousState => ({
    messages: GiftedChat.append(previousState.messages, [addMessage]),
  }));

  // todo this is not working, printing previous and duplicate messages
  // console.log(currentObj.state.id)
  // AsyncStorage.setItem(room.state.id, JSON.stringify(GiftedChat.append(room.state.messages, [addMessage])));

  //todo call delete mutation
  // var messageID = fullPackage.id;
  // const messageID = {
  //   filter: {id: {eq: fullPackage.id}}
  // };
  // const deleteresp = await API.graphql(graphqlOperation(deleteMessage, messageID ));
  // console.log(messagesFromQueue);


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
  console.log("loading messages from DynamoDB queue:");

  // load messages in waiting in DynamoDB queue
  // const messagesFromQueue = await API.graphql(graphqlOperation(listMessages, roomFilter ));
  // console.log(messagesFromQueue);

  // todo filter messages ONLY from other users to display
  // displayIncomingMessages(messagesFromQueue, currentObj);

}

let parsMembersString = (membersString) => {
  console.log("membersString: ",membersString)
  return JSON.parse(membersString)
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
    });
    this.loadUsername();
  }


  componentWillUnmount() {
      this._isMounted = false
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

          messageId = event.value.data.onCreateMessageByRecipient.id
          let recpt = deleteMessageAfterRead(messageId)
          // console.log("delete: ", recpt)
          const newMessage = JSON.stringify(event.value.data, null, 2);
          console.log("New Message: " + newMessage);
          this.onReceive(event.value.data);

      }
      });
  }

  //load messages from local storage and display
  loadMessages = async (key) => {
    const messageItems = this;
    var result = await AsyncStorage.getItem(key);
    console.log("load messages from local storage:")
    console.log(result);
    if(result != null && result.length){
      console.log("not null");
      this.setState({messages: JSON.parse(result)});
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
      console.log("title: " + parsed.name)
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

  onReceive = (messageObject) => {
    try{
      //Decrypt
      console.log("TODO: Implement decrypt");


    // parse incomingMessageItem payload and save into new variable
    var messageObj = messageObject.onCreateMessageByRecipient;
    console.log("message Obj: " + messageObj);
    // console.log("message Obj after parse: " + JSON.stringify(messageObj));
    
    //const publicKey = await eThree.findUsers(messageObj.from);

    //const decrypted_payload = await eThree.authDecrypt(messageObj.payload, publicKey);
    
    payload = JSON.parse(messageObj.payload);

    

    console.log("payload " + payload);
      console.log("action type" + payload.actionType);
      switch(payload.actionType){
        //Incoming text message
        case ActionType.TEXT_MESSAGE:{
          displayOneMessage(messageObj, payload, this);
          break;
        }
        //name change
        case ActionType.ROOM_NAME_CHANGE:{
          console.log("TODO: Implement name change");
          break;
        }
        //User left room
        case ActionType.MEMBER_LEFT:{
          console.log("TODO: Implement user left the room");
          break;
        }
        //User added to room
        case ActionType.MEMBER_JOINED:{
          console.log("TODO: Implement User addeed to the room");
          break;
        }
        //Backup Requested
        case ActionType.BACKUP_REQUEST:{
          console.log("TODO: Implement backup requested");
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
        user={{
          _id: 1,
        }}

      />
    )
  }
}

export default ChatScreen;