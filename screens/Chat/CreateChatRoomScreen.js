
import React, { Component } from 'react';
import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, Keyboard, ScrollView, AsyncStorage } from 'react-native';

import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';
import { createRoom} from '../../src/graphql/mutations';
import awsconfig from '../../aws-exports';

API.configure(awsconfig);
PubSub.configure(awsconfig);


//????
async function createNewTodo(roomId) {
  // need to make this unique with receiver and sender usernames
    // forward to chatScreen
  const room_ = {id:roomId}
  await API.graphql(graphqlOperation(createRoom, { input: room_ }));
}
/*=====================================================*/
/*            Create Room Screen                       */
/*=====================================================*/
export default class CreateChatRoomScreen extends React.Component {

  constructor(props) {
    super(props);

    // const {navigation} = this.props;
    this.loadRooms(this.roomsKey);
    this.state = {
      username: this.props.navigation.getParam("username"),  //sorted into roomMembers
      roomsKey: this.props.navigation.getParam("roomsKey"),
      rooms: this.props.navigation.getParam("rooms"),
      roomMembers: "",  //used as room ID
      roomName: '',
    };
  }


  render() {
    return (
      <View style={{backgroundColor: "#d0e0f1", flex: 1}}>
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <ScrollView keyboardShouldPersistTaps='never'>

          <TextInput
            placeholder="Recipient"
            style={styles.formBox}
            placeholderTextColor = "#2e4257"
            returnKeyType = "next"
            autoFocus={true}
            onSubmitEditing = {() => {this.roomName.focus();}}
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.roomMembers}
            onChange ={event => this.setState({roomMembers:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />

          <TextInput
            placeholder="Room Name (Optional)"
            style={styles.formBox}
            placeholderTextColor = "#2e4257"
            returnKeyType = "next"
            onSubmitEditing = {() => {this.makeRoom}}
            autoCapitalize='none'
            autoCorrect={false}
            ref = {(input) => {this.roomName = input;}}
            value={this.state.roomName}
            onChange ={event => this.setState({roomName:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />




        <TouchableOpacity style={styles.loginContainer}>
                <Text style={styles.buttonText}
                  onPress={this.makeRoom}>Create Room</Text>
        </TouchableOpacity>

          </ScrollView>

      </KeyboardAvoidingView>
      </View>

    );
  }



  /*--------------------Async------------------------*/
  makeRoom = async () => {

    await this.loadRooms(this.state.roomsKey);
    var newRooms = this.state.rooms;

    //order roomMembers (comma separated list)
    this.members = this.state.roomMembers.split(",").map(function(item) {
      return item.trim();
    })
    console.log("before");
    console.log(this.members);
    this.members.push(this.state.username);
    this.members.sort();

    console.log("after");
    console.log(this.members)
    this.membersString = JSON.stringify(this.members)
    if(await this.roomDoesNotExist(newRooms,this.membersString)){
      newRooms.push({id:this.membersString, name:this.state.roomName, createdAt: new Date().toDateString()});
      // this.setState({rooms:newRooms});
      await this.storeRooms(this.state.roomsKey, JSON.stringify(newRooms));

      // create room to send to AWS Amplify via API
      // not recognizing input/condition
      const room = {
          id: this.membersString,
          messages: []
      };

      try {
        console.log(room);
        console.log("About to create toDo");

        createNewTodo(this.membersString);

        console.log("Just created a toDo");

        console.log("AWS store success");

      } catch (err){
        console.log('error: ', err);
      }
      // navigate to room
      this.props.navigation.navigate('ChatPage',{ "name": this.state.roomName, "id": this.membersString  });
    }
    else{

    }
  };

  //sets state.rooms from local
  loadRooms = async (key) => {
    var result = await AsyncStorage.getItem(key);
    console.log(result);
    if(result != null && result.length){
      // console.log("not null");
      // console.log(JSON.parse(result));
      this.setState({rooms: JSON.parse(result)});
    }
    else{
      // alert("result is null");
    }
  };

  //stores ALL rooms locally
  storeRooms = async (key, stringified) => {
    await AsyncStorage.setItem(key, stringified).then(successMessage =>{console.log("Async store success")}).catch(fail => {console.log("fail")});
    console.log(stringified);
    // this.maxid = JSON.parse(stringified).length;
    this.loadRooms(key);
  };

  //Checks if there exists a room in the list with specified id(members)
  roomDoesNotExist = async (roomList, members) => {
    roomList.forEach( room => {
      console.log(room.id)
      console.log("vs")
      console.log(members)
      if(room.id == members){
        console.log(members + " exists already");
        // alert(members + " exists already");
        this.props.navigation.navigate('ChatPage',{ "name": room.name, "id": this.membersString  })
        return false;
      }
    }
    )
    console.log(members + " does not exist yet");
    // alert("ok" + members);
    return true;
  }
}


const styles = StyleSheet.create({
  container:{
      padding:20,
  },

  formBox:{
      height: 45,
      backgroundColor: '#FFF',
      marginBottom: 15,
      paddingHorizontal: 20,

  },

  loginContainer:{

      paddingVertical: 10,

  },

  resetContainer:{

    paddingVertical: 5,
    backgroundColor: '#d0e0f1',
},

  buttonText:{
      textAlign:'center',
      color:'#FFF',
      fontWeight: "600",
      backgroundColor:'#db8a75',
      padding:10

  },

  logo: {
    width: 100,
    height:200,
    marginBottom:30

  }

});
