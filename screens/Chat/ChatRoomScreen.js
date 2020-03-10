
import React, { Component } from 'react';
import { View, Text, ActivityIndicator, Button, FlatList, TouchableOpacity, Alert , AsyncStorage} from "react-native";



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

// Abby - still working on retrieving only rooms that user is in
// listRooms returns all rooms and prints in console log
async function retrieveRooms(){
  console.log("attempting to retrieve rooms"); 
  // const user_ = {}
  const resp = await API.graphql(graphqlOperation(listRooms));
  console.log("retrieved rooms");
  console.log(resp); 
  const data = JSON.parse(resp);
  console.log(data);
  // these don't work:
  // const list = data.listRooms[1];
  // console.log("room list");
  // console.log(list);
  // console.log("end of list");
  return resp;
}
export default class ChatRoom extends Component {
  constructor(props) {
    super(props);

    // const {navigation} = this.props;
    // this.username = navigation.getParam("username");
    // AsyncStorage.removeItem("abc");
    this.roomsKey = "rooms";
    this.loadRooms(this.roomsKey);
    this.state = {
      rooms: [],
    };
  }

  renderRoom = ({ item }) => {
    return (
      <View style={styles.list_item}>
        <Text style={styles.list_item_text}>{item.name}</Text>
        <Button title="Enter" color="#0064e1" onPress={() => this.props.navigation.navigate('ChatPage',{ "name": item.name.toString(), "id": item.id.toString()  }) } />
      </View>
    );
  }


  render() {
    const {rooms} = this.state;
    return (
      <View>
        <Button
          title="Populate"
          color="#0064e1"
          onPress={() => this.populate()}
        />

        <Button
          title="MakeRoom"
          color="#0064e1"
          onPress={() => this.makeRoom()}
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



    makeRoom = async () => {

      var newRooms = this.state.rooms;
      this.maxid++;
      newRooms.push({id:this.maxid, name:"Room"+this.maxid, createdAt: new Date().toDateString()});
      // this.setState({rooms:newRooms});
      this.storeRooms(this.roomsKey, JSON.stringify(newRooms));

      // create room to send to AWS Amplify via API
      // not recognizing input/condition
      const room = {
          id: this.maxid,
          messages: []
      };

      try {
        console.log(room);
        console.log("About to create toDo");

        createNewTodo(this.maxid);

        console.log("Just created a toDo");

        console.log("AWS store success");

      } catch (err){
        console.log('error: ', err);
      }
      // update state of rooms
      this.setState({rooms:newRooms});

    }
    newid = async () =>{
      this.maxid++;
      return this.maxid;
    }

    loadRooms = async (key) => {
      var result = await AsyncStorage.getItem(key);
      console.log(result);
      if(result != null && result.length){
        // console.log("not null");
        // console.log(JSON.parse(result));
        this.maxid = JSON.parse(result).length;
        this.setState({rooms: JSON.parse(result)});
      }
      else{
        this.maxid = 0;
        // alert("result is null");
      }
    }
    storeRooms = async (key, stringified) => {
      await AsyncStorage.setItem(key, stringified).then(successMessage =>{console.log("Async store success")}).catch(fail => {console.log("fail")});
      console.log(stringified);
      this.maxid = JSON.parse(stringified).length;
      this.loadRooms(key);
    }

    populate = async() => {
      try{
        const roomObject = retrieveRooms(); 
      } catch (err) {
        console.log(err); 
      }
     
      
      // todo: cycle through rooms object and add to list display

      this.data = [
        {id:1, name: "Christmas Room 🎄", createdAt: new Date().toDateString()},
        {id:2, name: "Room for cool people 🔥", createdAt: new Date().toDateString()}
      ];
      this.data2 = JSON.stringify(this.data);
      this.storeRooms(this.roomsKey, this.data2);

     
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