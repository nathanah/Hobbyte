import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router, ServerRouter } from 'react-router-dom';
import Rooms from './Rooms';
import ChatScreen from './ChatScreen';
import {createMemoryHistory} from 'history';
const history = createMemoryHistory(); 

class ChatRoom extends Component {
  render() {
    return (
      <Router history = {history}> 
        <Switch>
          <Route path='/room/:roomId' component={ChatScreen} />
          <Route path='/' component={Rooms} />
        </Switch>
      </Router>
    );
  }
}

export default ChatRoom;
