import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'


class ChatScreen extends React.Component {
  state = {
    messages: [],
    loadEarlier: true, 
    isLoadingEarlier: false, 
    typingText: null, 
    isTyping: false, 
    appIsReady: false,
    title: 'Chat',
  }

  // should display user name from other user - currently shows sign in username
  static navigationOptions = ({navigation}) => ({
      title: (navigation.state.params || {}).name || 'Chat!',
  });

  get user() {
      return{
          name: this.props.navigation.getParam('name'), 
        //   _id: 
      };
  }


  // mounts test messages and sets it as a state
  // This example has quick replies setting demonstrated with buttons in hardcoded section
  componentDidMount() {
      this._isMounted = true,

      // This is for retrieving messages from AWS 
    //   this.setState ({
    //       messages:messagesDataAWS, 
    //       appIsReady: true, 
    //       isTyping: false,
    // 
          
    //   })

    // Hardcoded message example ---- 
    this.setState({
      messages: [
        {
            _id: 1,
            text: 'This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT',
            createdAt: new Date(),
            quickReplies: {
              type: 'radio', // or 'checkbox',
              keepIt: true,
              values: [
                {
                  title: '😋 Yes',
                  value: 'yes',
                },
                {
                  title: '📷 Yes, let me show you with a picture!',
                  value: 'yes_picture',
                },
                {
                  title: '😞 Nope. What?',
                  value: 'no',
                },
              ],
            },
            user: {
              _id: 2,
              name: 'React Native',
            },
          },
          {
            _id: 2,
            text: 'This is a quick reply. Do you love Gifted Chat? (checkbox)',
            createdAt: new Date(),
            quickReplies: {
              type: 'checkbox', // or 'radio',
              values: [
                {
                  title: 'Yes',
                  value: 'yes',
                },
                {
                  title: 'Yes, let me show you with a picture!',
                  value: 'yes_picture',
                },
                {
                  title: 'Nope. What?',
                  value: 'no',
                },
              ],
            },
            user: {
              _id: 2,
              name: 'React Native',
            },
          }

      ],

      // end of hardcoded message example --- 
    })
  }


  componentWillUnmount() {
      this._isMounted = false
  }

  
  // User's send Async function
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

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