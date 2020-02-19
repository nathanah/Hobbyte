// not working
import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router, ServerRouter } from 'react-router-dom';
import { View, Text, ActivityIndicator, Button, FlatList, TouchableOpacity, Alert } from "react-native";
import Rooms from './Rooms';
import ChatScreen from './ChatScreen';
import {createMemoryHistory} from 'history';


export default class ChatRoom extends Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.maxid = 2;
    // this.username = navigation.getParam("username");
    this.state = {
      rooms: [
          {id:1, name: "Christmas Room 🎄", createdAt: new Date().toDateString()},
          {id:2, name: "Room for cool people 🔥", createdAt: new Date().toDateString()},
      ]
    };
  }

  async componentDidMount() {
    try{
      // const response = await
      // const {rooms} = response.data;
      this.setState({
        rooms
      });
    } catch (get_rooms_err){
      console.log("error getting rooms:", get_rooms_err);
    }
  }
  renderRoom = ({ item }) => {
    return (
      <View style={styles.list_item}>
        <Text style={styles.list_item_text}>{item.name}</Text>
        <Button title="Enter" color="#0064e1" onPress={() => {
          this.enterChat(item);
        }} />
      </View>
    );
  }
  render() {
    const {rooms} = this.state;
    return (
      <View>
        <Button
          title="MakeRoom"
          color="#0064e1"
          onPress={() => this.makeRoom()}
        />
        {
          rooms &&
          <FlatList
            keyExtractor={(item)=> item.id.toString()}
            data={rooms}
            renderItem={this.renderRoom}
          />
        }
      </View>
    );
  }

    makeRoom = async () => {
      var newRooms = this.state.rooms;
      this.maxid++;
      newRooms.push({id:this.maxid, name:this.maxid, createdAt: new Date().toDateString()});
      this.setState({rooms:newRooms});
    }
    newid = async () =>{
      this.maxid++;
      return this.maxid;
    }
}

const styles = {
  container: {
      flex: 1
    },
    loader: {
      paddingTop: 20
    },

    header_right: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-around"
    },

    header_button_container: {
      marginRight: 10
    },
    header_button: {

    },
    header_button_text: {
      color: '#FFF'
    },

    sendLoader: {
      marginRight: 10,
      marginBottom: 10
    },
    customActionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between"
    },
    buttonContainer: {
      padding: 10
    },
    modal: {
      flex: 1,
      backgroundColor: '#FFF'
    },
    close: {
      alignSelf: 'flex-end',
      marginBottom: 10
    },
    modal_header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10
    },
    modal_header_text: {
      fontSize: 20,
      fontWeight: 'bold'
    },
    modal_body: {
      marginTop: 20,
      padding: 20
    },
    centered: {
      alignItems: 'center'
    },
    list_item_body: {
      flex: 1,
      padding: 10,
      flexDirection: "row",
      justifyContent: "space-between"
    },
    list_item: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    list_item_text: {
      marginLeft: 10,
      fontSize: 20,
    },
    status_indicator: {
      width: 10,
      height: 10,
      borderRadius: 10,
    },
    online: {
      backgroundColor: '#5bb90b'
    },
    offline: {
      backgroundColor: '#606060'
    },

    footerContainer: {
      marginTop: 5,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 10,
    },
    footerText: {
      fontSize: 14,
      color: '#aaa',
    }

}


//
// const history = createMemoryHistory();
//
//
// class ChatRoom extends Component {
//   render() {
//     return (
//       <Router history = {history}>
//         <Switch>
//           <Route path='/room/:roomId' component={ChatScreen} />
//           <Route path='/' component={Rooms} />
//         </Switch>
//       </Router>
//     );
//   }
// }
