import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import {AsyncStorage} from "react-native";
import {Icon} from 'react-native-elements';

import API, { graphqlOperation } from '@aws-amplify/api';
import {createMessage} from '../../src/graphql/mutations';

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
      title: 'Chat',
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

    console.log
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    AsyncStorage.setItem(this.state.id, JSON.stringify(GiftedChat.append(this.state.messages, messages)));
  }

  loadMessages = async (key) => {
    var result = await AsyncStorage.getItem(key);
    console.log("load messages:")
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

  }

  // we need to restructure this to retrieve any messages
  // waiting in queue in Dynamo and existing from local

  // currently onReceive doesn't work:
//   onReceive = (text: string) => {
//     this.setState((previousState: any) => {
//       return {
//         messages: GiftedChat.append(
//           previousState.messages as any,
//           [
//             {
//               _id: Math.round(Math.random() * 1000000),
//               text,
//               createdAt: new Date(),
//               user: otherUser,
//             },
//           ],
//           Platform.OS !== 'web',
//         ),
//       }
//     })
//   }


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
