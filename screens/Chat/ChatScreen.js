import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import {AsyncStorage} from "react-native";
import {Icon} from 'react-native-elements';

import API, { graphqlOperation } from '@aws-amplify/api';
import {createMessage} from '../../src/graphql/mutations';
import {onCreateMessage} from '../../src/graphql/subscriptions'; 
import {listMessages} from '../../src/graphql/queries'; 

/*=====================================================*/
// ASYNC FUNCTIONS 
/*=====================================================*/

async function getAuthObject() {
  // obtains userToken and parses it to access username
  var user = await AsyncStorage.getItem("userToken"); 
  var userTokenParsed = JSON.parse(user); 
  var username = userTokenParsed.user.signInUserSession.accessToken.payload.username; 
  return username; // returns a promise
}

async function createNewChatMessage(messages, room, username) {
  const roomId_ = room;
  // obtained username, not sure where to save it in message
  console.log("username in create new message"); 
  console.log(username); 
  const message_ = {
        content: messages[0].text,
        when: messages[0].createdAt,
        roomId: roomId_,

  };
  const resp = await API.graphql(graphqlOperation(createMessage, { input: message_ }));
  console.log(resp);
}

function displayOneMessage(incomingMessageItem, currentObj){
  // displays one message at a time on gifted chat and stores in AsyncStorage
  var addMessage = {
    _id: incomingMessageItem.id, 
    text: incomingMessageItem.content, 
    user: {_id:2, name: "user2"} // todo update with other user name
    // when
  };
  currentObj.setState(previousState => ({
    messages: GiftedChat.append(previousState.messages, [addMessage]),
  }));

  // todo make sure only new messages stored, check if message already stored
  AsyncStorage.setItem(currentObj.state.id, JSON.stringify(GiftedChat.append(currentObj.state.messages, [addMessage])));
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

async function getNewMessages(currentObj, room){
  // query messages in DynamoDB queue
 
  const roomFilter = {
    filter: {roomId: {contains: room}}
  };
  console.log("loading messages from DynamoDB queue:"); 
  
  // load messages in waiting in DynamoDB queue
  const messagesFromQueue = await API.graphql(graphqlOperation(listMessages, roomFilter )); 
  console.log(messagesFromQueue); 
  
  // todo filter messages ONLY from other users to display
  displayIncomingMessages(messagesFromQueue, currentObj); 
 
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
      messages: [],
      loadEarlier: true,
      isLoadingEarlier: false,
      typingText: null,
      isTyping: false,
      appIsReady: false,
      title: this.props.navigation.getParam('name'),
      id: this.props.navigation.getParam('id'),
      username: username
    }
  }


  // should display user name from other user - currently shows sign in username
  static navigationOptions = ({navigation}) => ({
      title: (navigation.state.params || {}).name || 'Chat!',
      id: (navigation.state.params || {}).id || 0,
      headerRight:
          <Icon
          style={{ paddingRight: 10 }}
          onPress={() => navigation.navigate('RoomSettings', (navigation.state.params || {}).id)}
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
    this.subscription = API.graphql(
      graphqlOperation(onCreateMessage)
      ).subscribe({
      next: event => {
          // console.log("Chat screen Subscription: " + JSON.stringify(event.value.data, null, 2));
          const newMessage = JSON.stringify(event.value.data, null, 2); 
          this.onReceive(event.value.data);
         
        
      }
      });
  }


  componentWillUnmount() {
      this._isMounted = false
  }

  onSend(messages = []) {
    console.log("send message:");
    console.log(messages);
    const room = this.user;

    console.log("Room name:");
    console.log(room.name);
    console.log("username :"); 
    console.log(this.state.username._55);

    try{
      console.log ("sending message to AWS... ");

      createNewChatMessage(messages, room.name, this.state.username._55);

      console.log("AWS store success!");
    }catch (err){
      console.log('error: ', err);
    }

    console.log("message in gifted chat:");
    console.log(messages);
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    AsyncStorage.setItem(this.state.id, JSON.stringify(GiftedChat.append(this.state.messages, messages)));
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
      getNewMessages(this, this.state.title); 
    } catch (err){
      console.log(err);
    }

  }

  onReceive = ( messageObject) => {
    displayOneMessage(messageObject.onCreateMessage, this); 
  }


  render() {
    return (
      <GiftedChat
        title
        messages={this.state.messages}
        scrollToBottom
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
