
import React, { Component } from 'react';
import { Button,
        View,
        Text,
        TouchableOpacity,
        StyleSheet,
        KeyboardAvoidingView,
        TextInput,
        ScrollView,
        AsyncStorage
        } from 'react-native';


// todo is this needed anymore?
// import API from '@aws-amplify/api';
// import PubSub from '@aws-amplify/pubsub';
// import awsconfig from '../../aws-exports';

// API.configure(awsconfig);
// PubSub.configure(awsconfig);

/*=====================================================*/
/*            Create Room Screen                       */
/*=====================================================*/
export default class CreateChatRoomScreen extends React.Component {

  constructor(props) {
    super(props);

    this.loadRooms(this.roomsKey);
    this.state = {
      username: this.props.navigation.getParam("username"),  //sorted into roomMembers
      roomsKey: this.props.navigation.getParam("roomsKey"),
      rooms: this.props.navigation.getParam("rooms"),
      roomMembers: "",
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


// todo ROOM ID - change room id to be autogenerated Random number ID and not members

  /*--------------------Async------------------------*/

  makeRoom = async () => {

    await this.loadRooms(this.state.roomsKey);
    var newRooms = this.state.rooms;

    this.members = this.state.roomMembers.split(",").map(function(item) {
      return item.trim();
    })
    console.log("members:" + this.members);
    this.members.push(this.state.username);
    this.members.sort();

    console.log("after member added: " + this.members);
    this.membersString = JSON.stringify(this.members)
    if(await this.roomDoesNotExist(newRooms,this.membersString)){
      newRooms.push({id:this.membersString, name:this.state.roomName, createdAt: new Date().toDateString()});
      await this.storeRooms(this.state.roomsKey, JSON.stringify(newRooms));
      await AsyncStorage.setItem(this.membersString+"settings", JSON.stringify({"title": this.state.roomName}))
      // navigate to room
      this.props.navigation.navigate('ChatPage',{ "name": this.state.roomName, "id": this.membersString  });
    }
    else{

    }
  };

  //sets state.rooms from local
  loadRooms = async (key) => {
    var result = await AsyncStorage.getItem(key);
    console.log("Loaded Rooms: "+ result);
    if(result != null && result.length){
      this.setState({rooms: JSON.parse(result)});
    }
    else{
      // alert("result is null");
    }
  };

  //stores ALL rooms locally
  storeRooms = async (key, stringified) => {
    await AsyncStorage.setItem(key, stringified).then(successMessage =>{console.log("Room async store success")}).catch(fail => {console.log("Room async storage fail")});
    console.log("Room stored: " + stringified);
    this.loadRooms(key);
  };

  //Checks if there exists a room in the list with specified id(members)
  roomDoesNotExist = async (roomList, members) => {
    roomList.forEach( room => {

      // check for existing room with members
      console.log("other room with members:" + room.id)
      console.log("vs")
      console.log("new room: " + members)

      if(room.id == members){ // room found
        console.log(members + " exists already");
        this.props.navigation.navigate('ChatPage',{ "name": room.name, "id": this.membersString  })
        return false;
      }
    }
    )
    console.log(members + " does not exist yet");
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
