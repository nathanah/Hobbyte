import React from 'react'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import {AsyncStorage} from "react-native";
import {Icon} from 'react-native-elements';

import API, { graphqlOperation } from '@aws-amplify/api';
import {createMessage, deleteMessage} from '../../src/graphql/mutations';
import {OnCreateMessageByRecipient} from '../../src/graphql/subscriptions';
import {listMessages} from '../../src/graphql/queries';
import {ActionType, Payload} from "../../src/payload"

/*=====================================================*/
// ASYNC FUNCTIONS
/*=====================================================*/
async function deleteMessageAfterRead(messageId) {
  return await API.graphql(graphqlOperation(deleteMessage, { input: { id: messageId }}))
}
async function getAuthObject() {
  // obtains userToken and parses it to access username
  var user = await AsyncStorage.getItem("userToken");
  var userTokenParsed = JSON.parse(user);
  var username = userTokenParsed.user.signInUserSession.accessToken.payload.username;
  return username; // returns a promise
}

async function createNewChatMessage(messages, room, username) {
  const message_ = new Payload(
                              actionType=ActionType.TEXT_MESSAGE,
                              roomId=this.id,
                              roomName=this.title,
                              roomMembers=['bpb', 'din','dsin'],
                              from =this.username, 
                              joiningMember=null,
                              leavingMember=null,
                              textContent=message[0].text,
                              newRoomName=null
                              ).get()

  // ---Old version of message
  // const roomId_ = room;
  // const message_ = {
  //       actionType: 1,
  //       from: username,
  //       users: username + "need to add other users here, alphabetical",
  //       content: messages[0].text,
  //       roomName: roomId_,
  //       when: messages[0].createdAt,

  // };

  let stringMessage = JSON.stringify(message_);
  //var otherUsers = JSON.parse(room.id);
  // use this.user.name
  //console.log("type  " +  otherUsers.typeof);
  for (var i = 0; i < otherUsers.length -1; i++){
    console.log("other users: " + otherUsers[i]);
    const package_ = {
      to: otherUsers[i],
      payload: stringMessage,
    };
    console.log("package: " + JSON.stringify(package_));
    const resp = await API.graphql(graphqlOperation(createMessage, { input: package_ }));
    console.log(resp);
  }

}

function displayOneMessage(fullPackage, incomingMessageItem, currentObj){
  // displays one message at a time on gifted chat and stores in AsyncStorage

  // todo then match to addMessage:
  var addMessage = {
    _id: fullPackage.id,
    text: incomingMessageItem.content,
    user: {_id:2, name: incomingMessageItem.from}, // todo update with other user name
    createdAt: incomingMessageItem.when,
  };
  currentObj.setState(previousState => ({
    messages: GiftedChat.append(previousState.messages, [addMessage]),
  }));

  // todo make sure only new messages stored, check if message already stored
  // console.log(currentObj.state.id)
  // AsyncStorage.setItem(currentObj.state.id, JSON.stringify(GiftedChat.append(currentObj.state.messages, [addMessage])));

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
      
      title: this.props.navigation.getParam('name'),
      id: this.props.navigation.getParam('id'),
      username: "temp",


      roomName: null,
      roomId: null,
      roomMembers: []

    }
  }


  // should display user name from other user - currently shows sign in username
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
    const publicKeys = await eThree.findUsers(roomMembers);
    const encryptedText = await eThree.authEncrypt(messages, publicKeys);
    console.log("send message:");
    console.log(messages);
    const room = this.user;

    console.log("Room name:");
    console.log(room.name);
    console.log("username :");
    console.log(this.state.username._55);

    try{
      console.log ("sending message to AWS... ");

      createNewChatMessage(encryptedText, room, this.state.username._55);

      console.log("AWS store success!");
    }catch (err){
      console.log('error: ', err);
    }

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    console.log(this.state.id)
    AsyncStorage.setItem(this.state.id, JSON.stringify(GiftedChat.append(this.state.messages, messages)));
 
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

  loadSettings = async (key) => {
    var result = await AsyncStorage.getItem(key+"settings")
    console.log("load settings from local storage:")
    if(result != null){
      console.log("not null");
      var parsed = JSON.parse(result)
      console.log(parsed.title)
      this.setState({title: parsed.title, bubbleColor: parsed.bubbleColor, textColor: parsed.textColor})
      this.props.navigation.state.params.name = this.state.title;

    }
    else{

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
    /*
    const publicKey = await eThree.findUsers(sender);

    // Decrypt text and ensure it was written by sender
    const decryptedText = await eThree.authDecrypt(encryptedText, publicKey);
    */
      console.log("TODO: Implement decrypt");


    // parse incomingMessageItem payload and save into new variable
    var incomingPackage = messageObject.onCreateMessageByRecipient;
    var parsedPayload = JSON.parse(incomingPackage.payload);

    

      switch(parsedPayload.actionType){
        //Incoming text message
        case ActionType.TEXT_MESSAGE:{
          displayOneMessage(incomingPackage, parsedPayload, this);
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
        //
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
