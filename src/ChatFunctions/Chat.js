import React, { Component } from 'react';
import { GiftedChat } from 'react-web-gifted-chat';

const MESSAGES = [
    {id: 2, content: "That's it. That's all there is.", owner: "me"},
    {id: 1, content: "Six by nine. Forty two.", owner: "me"},
    {id: 0, content: "What's the angle of the red light that refracts through a water surface to create a 🌈?", owner: "anonymous"},
]

class Chat extends Component {
 
    onSend(messages = []) {}
    
    render() {
        return (
            <div style={styles.container}>
                <GiftedChat
                messages={MESSAGES.map(m => ({
                    id: m.id,
                    text: m.content,
                    user: {
                        id: m.owner,
                        name: m.owner
                    },
                }))}
                onSend={(messages) => this.onSend(messages)}
                user={{
                    id: 'me',
                }}
            />
            </div>
        );
    }
}

const styles = {
    container: {
      flex: 1,
      height: "100vh"
    },
  }

export default Chat;