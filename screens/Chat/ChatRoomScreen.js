
import React, { Component } from 'react';
// import ChatScreen from './ChatScreen';
import {createMemoryHistory} from 'history';
// import { Switch, Route, BrowserRouter as Router, ServerRouter } from 'react-router-dom';
// import { View, Text, ActivityIndicator, Button, FlatList, TouchableOpacity, Alert } from "react-native";
import { View, Text, ActivityIndicator, Button, FlatList, TouchableOpacity, Alert , AsyncStorage} from "react-native";
// import Rooms from './Rooms';
// import ChatScreen from './ChatScreen';
// import {createMemoryHistory} from 'history';
// import {Connect} from "aws-amplify-react";
import Amplify, {API, graphqlOperation} from "aws-amplify";
import * as mutations from '../../src/graphql/mutations';
import awsconfig from '../../aws-exports';
 
// Considering you have an existing aws-exports.js configuration file 
Amplify.configure(awsconfig);


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
   
      // const AddRoom = `
      // mutation ($id: String!, condition: $condition) {
      //   CreateRoom(input: {
      //     id: $id
      //   }) {
      //     id
      //   }
      // }
      // `;
      var newRooms = this.state.rooms;
      this.maxid++;
      newRooms.push({id:this.maxid, name:"Room"+this.maxid, createdAt: new Date().toDateString()});
      // this.setState({rooms:newRooms});
      this.storeRooms(this.roomsKey, JSON.stringify(newRooms));
    
      // create room to send to AWS Amplify via API
      // not recognizing input/condition
      const room = {
          id: this.maxid
        
      };

      try {
        console.log(room);
        await API.graphql(graphqlOperation(mutations.CreateRoom, room));
      //  await API.graphql(graphqlOperation(AddRoom, room)); 
        console.log("success"); 

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
      await AsyncStorage.setItem(key, stringified).then(successMessage =>{console.log("store success")}).catch(fail => {console.log("fail")});
      console.log(stringified);
      this.maxid = JSON.parse(stringified).length;
      this.loadRooms(key);
    }

    populate = async() => {
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
