import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import {AsyncStorage} from "react-native";
import {Icon} from 'react-native-elements';

import API, { graphqlOperation } from '@aws-amplify/api';
import {createMessage} from '../../src/graphql/mutations';
import {onCreateMessage} from '../../src/graphql/subscriptions'; 
import {listMessages} from '../../src/graphql/queries'; 

async function createNewChatMessage(messages, room) {
  // need to keep roomId's consistent and get this from roomId created in ChatRoomScreen
  const roomId_ = id + room;
  const message_ = {
        content: messages[0].text,
        when: messages[0].createdAt,
        roomId: roomId_,
        // room {}


  };
  const resp = await API.graphql(graphqlOperation(createMessage, { input: message_ }));
  console.log(resp);
}

// todo update with other user information
function displayIncomingMessages(messagesFromQueue, currentObj){
  // Function: Takes AWS object returned from DynamoDB and adds it to Gifted Chat display
  const newMessages = messagesFromQueue.data.listMessages; 
  const numMessages = newMessages.items.length;
  var k; 
  for (k = 0; k < numMessages; k++){
    const messageItem = {
      _id: newMessages.items[k].id, 
      text: newMessages.items[k].content, 
      user: {_id:2, name: "user2"} // todo update with other user name
    };
    currentObj.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [messageItem]),
    }));

  }
}

async function getNewMessages(currentObj, room){

  // replace contains with otherUser+room
  console.log("room name:");
  console.log(room);
  const roomId = 
   {data:{
      roomId: 
        {'eq': "subscriptionRoom"} // need to update with room name. 
   }
    };
    console.log(listMessages); 
  console.log("loading messages from DynamoDB queue:"); 
// load messages in waiting in DynamoDB queue
  const messagesFromQueue = await API.graphql(graphqlOperation(listMessages, roomId )); 
  console.log(messagesFromQueue); 
  
  displayIncomingMessages(messagesFromQueue, currentObj); 
 
  // todo finish attaching subscriber object and handle incoming messages by
    // calling displayIncomingMessages 

  // console.log("set up subscriber:"); 
  // // this sets up subscriber for new incoming messages
  // const subscription = await API.graphql(graphqlOperation(onCreateMessage )).subscribe({
  //   next: eventData  => console.log(eventData),
  // });

  // console.log(subscription);

  // need to unsubscribe once user leaves app or back button or signs out? 
  // subscription.unsubscribe(); // move this to a different function


}

class ChatScreen extends React.Component {
  constructor(props) {
    super(props);

    const {navigation} = this.props;
    // this.username = navigation.getParam("username");
    // AsyncStorage.removeItem("abc");
    this.state = {
      messages: [],
      loadEarlier: true,
      isLoadingEarlier: false,
      typingText: null,
      isTyping: false,
      appIsReady: false,
      title: this.props.navigation.getParam('name'),
      id: this.props.navigation.getParam('id'),
    }
    // AsyncStorage.removeItem(this.state.id);
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


  // mounts test messages and sets it as a state
  // This example has quick replies setting demonstrated with buttons in hardcoded section
  componentDidMount() {
      this._isMounted = true,

    this.setState({
      messages: []
    })
    this.loadMessages(this.state.id);

  }


  componentWillUnmount() {
      this._isMounted = false
  }




  // User's send Async function
  onSend(messages = []) {
    console.log("send message:");
    console.log(messages);
    console.log("message text:");
    console.log(messages[0].text);
    const room = this.user;

    console.log("Room name:");
    console.log(room.name);

    try{
      console.log ("sending message to AWS... ");

      createNewChatMessage(messages, room.name);

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
      // console.log(JSON.parse(result));
      this.setState({messages: JSON.parse(result)});
    }
    else{
      this.setState({
        messages: []
      })
    }

    // messageItems.setState({_id: 1000, text: "This is a manually hardcoded message", createdAt: "3/15/2020", user: { _id: 2, name:'React Native', avatar: 'https://placeimg.com/140/140/any'}});
    console.log("here");    
    // query messages in DynamoDB queue
    try{
      getNewMessages(this, this.state.title); 
    } catch (err){
      console.log(err);
    }
    

      // map to gifted chat and display 
      // save to local storage


  }

  // we need to restructure this to retrieve any messages
  // waiting in queue in Dynamo and existing from local

  // currently onReceive doesn't work:
  // onReceive = (text: string) => {
  //   this.setState((previousState: any) => {
  //     return {
  //       messages: GiftedChat.append(
  //         previousState.messages as any,
  //         [
  //           {
  //             _id: Math.round(Math.random() * 1000000),
  //             text,
  //             createdAt: new Date(),
  //             user: otherUser,
  //           },
  //         ],
  //         Platform.OS !== 'web',
  //       ),
  //     }
  //   })
  // }


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
