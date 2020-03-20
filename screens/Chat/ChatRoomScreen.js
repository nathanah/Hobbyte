
import React, { Component } from 'react';
import { View, Text, ActivityIndicator, Button, FlatList, TouchableOpacity, Alert , AsyncStorage, TouchableHighlight} from "react-native";

import Swipeout from 'react-native-swipeout';

import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';
import { createRoom} from '../../src/graphql/mutations';
import {listRooms} from '../../src/graphql/queries';
import awsconfig from '../../aws-exports';



API.configure(awsconfig);
PubSub.configure(awsconfig);

async function createNewTodo(roomId) {
  // need to make this unique with receiver and sender usernames
    // forward to chatScreen
  const room_ = {id:roomId}
  await API.graphql(graphqlOperation(createRoom, { input: room_ }));
}

async function retrieveRooms(currentRooms){
  const resp = await API.graphql(graphqlOperation(listRooms));
  console.log("retrieved rooms");
  const roomItems = resp.data.listRooms.items;
  console.log("Room Items");
  console.log(roomItems);


  const numRooms = roomItems.length; 
  for (i = 0; i < numRooms; i++){
    // add filter to get only rooms with user in it 
    // parse room name from id
    const roomItem = {id: roomItems[i].id, name: roomItems[i].id};
    console.log("new room");
    console.log(roomItem);
    currentRooms.data.push(roomItem); 

  }

  currentRooms.data2 = JSON.stringify(currentRooms.data);
  currentRooms.storeRooms(currentRooms.roomsKey, currentRooms.data2);

  return roomItems;
}
export default class ChatRoom extends Component {
  constructor(props) {
    super(props);

    // const {navigation} = this.props;
    this.username = this.props.navigation.getParam("username");
    this.roomsKey = "rooms";
    this.loadRooms(this.roomsKey);
    this.state = {
      rooms: [],
    };
  }

  renderRoom = ({ item }) => {
    let swipeBtns = [{
      text: 'Delete',
      backgroundColor: 'red',
      onPress: () => { this.removeRoom(item.id.toString()) }
    }];

    return (
      <Swipeout right={swipeBtns}
        // autoClose='true'
        backgroundColor= 'transparent'>
        <TouchableHighlight>

          <View style={styles.list_item}>
            <Text style={styles.list_item_text}>{item.name}</Text>
            <Button title="Enter" color="#0064e1" onPress={() => this.props.navigation.navigate('ChatPage',{ "name": item.name.toString(), "id": item.id.toString()  }) } />
          </View>

          </TouchableHighlight>
      </Swipeout>
    );
  }


  render() {
    const {rooms} = this.state;
    return (
      <View>
        <Button
          title="Refresh"
          color="#0064e1"
          onPress={() => this.loadRooms(this.roomsKey)}
        />

        <Button
          title="MakeRoom"
          color="#0064e1"
          onPress={() => this.props.navigation.navigate('makeRoom',
              {
                "roomsKey": this.roomsKey,
                "rooms": this.state.rooms,
                "username": this.username
              }
            )
          }
        />


        {
          rooms &&
          <FlatList
            keyExtractor={(item) => item.id.toString()}
            data={rooms}
            renderItem={this.renderRoom}
            ListEmptyComponent = {<View style={styles.list_item}>
              <Text style={styles.list_item_text}>{"No Current Conversations"}</Text>
              </View>}
          />
        }
      </View>
    );
  }


    loadRooms = async (key) => {
      var result = await AsyncStorage.getItem(key);
      // console.log(result);
      if(result != null && result.length){
        // console.log("not null");
        // console.log(JSON.parse(result));
        this.setState({rooms: JSON.parse(result)});
      }
      else{
        // alert("result is null");
      }
    };

    storeRooms = async (key, stringified) => {
      await AsyncStorage.setItem(key, stringified).then(successMessage =>{console.log("Async store success")}).catch(fail => {console.log("fail")});
      console.log(stringified);
      await this.loadRooms(key);
    };

    populate = async() => {

      
      this.data = [
        {id:1, name: "Christmas Room 🎄", createdAt: new Date().toDateString()},
        {id:2, name: "Room for cool people 🔥", createdAt: new Date().toDateString()}
      ];
<<<<<<< HEAD
   
      
      try{
        const roomObject = retrieveRooms(this);
         
      } catch (err) {
        console.log(err); 
      }
    
=======
      this.data2 = JSON.stringify(this.data);
      await AsyncStorage.clear();
      this.storeRooms(this.roomsKey, this.data2);
>>>>>>> d5666e7bc6399f67baf07c8f394affc707fd9598
    }

    removeRoom = async(roomId) => {
      console.log(roomId)
      await this.loadRooms(this.roomsKey);

      var newRooms = this.state.rooms;
      console.log("prefilter");
      newRooms = newRooms.filter(function( room ) {
        return room.id.toString() !== roomId;
      });
      console.log("postfilter");
      console.log(newRooms);

      AsyncStorage.removeItem(roomId);

      await this.storeRooms(this.roomsKey, JSON.stringify(newRooms));
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
