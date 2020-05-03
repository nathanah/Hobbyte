
import React, { Component } from 'react';
import {  View,
          Text,
          Button,
          FlatList,
          AsyncStorage,
          TouchableHighlight,
          TouchableOpacity

        } from "react-native";

import { SwipeListView } from 'react-native-swipe-list-view';
import {createMessage, deleteMessage} from '../../src/graphql/mutations';
import {OnCreateMessageByRecipient} from '../../src/graphql/subscriptions';
import API, { graphqlOperation } from '@aws-amplify/api';
import {ActionType, Payload} from '../../src/payload';
// import PubSub from '@aws-amplify/pubsub';
import {listMessages} from '../../src/graphql/queries';
import awsconfig from '../../aws-exports';
API.configure(awsconfig);


/*=====================================================*/
// Async Functions
/*=====================================================*/
async function deleteMessageAfterRead(messageId) {
  return await API.graphql(graphqlOperation(deleteMessage, { input: { id: messageId }}))
}

async function getAuthObject() {
  // obtains userToken and parses it to access username
  var user = await AsyncStorage.getItem("userToken");
  var userTokenParsed = JSON.parse(user);
  var username = userTokenParsed.user.signInUserSession.accessToken.payload.username;
  return username; // returns a promise
}


// todo add subscriber to onCreateMessage(filter)
// todo remove this function
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

async function storeIncomingMessage(messageObj, payload, room){
  var roomObj = await AsyncStorage.getItem(payload.roomId);
  var chatHistory = JSON.parse(roomObj); 
  console.log("Chat History: " + chatHistory);
  var message = {
    _id: messageObj.id,
    text: payload.textContent,
    user: {
      id: 2,
    },
    createdAt: payload.created

  } ;
  // message = JSON.stringify(message); 
  console.log("message to be added:"     + JSON.stringify(message)); 
  
  if (chatHistory != null ){
    chatHistory.push(message);
    chatHistory = chatHistory.sort((a,b)=> b.createdAt - a.createdAt);
    chatHistory = JSON.stringify(chatHistory); 
    var rooms = room.state.rooms; 
    for (var i = 0; i < rooms.length; i++){
        var roomItem = rooms[i];
      if (roomItem.id == payload.roomId){
        rooms[i].unreadCount++; 
        await AsyncStorage.setItem(payload.roomId, chatHistory).then(successMessage =>{console.log("Async store incoming message success")}).catch(fail => {console.log("fail")});
        await AsyncStorage.setItem("rooms", JSON.stringify(rooms));
        return; 
        
      }
    }
   
  } 
    chatHistory = JSON.stringify(chatHistory);
    await AsyncStorage.setItem(payload.roomId, chatHistory).then(successMessage =>{console.log("Async store success")}).catch(fail => {console.log("fail")});
  }



async function settingsChange(payload){
  AsyncStorage.setItem(payload.roomId+"settings",payload.textContent);

  var rooms = await AsyncStorage.getItem("rooms");

  if(rooms != null){
    var parsed = await JSON.parse(rooms);
    var idx = -1
    for (let i = 0; i < parsed.length; i++){
      if (parsed[i].id == payload.roomId){
        idx = i;
        break;
      }
    }

    if(idx != -1){
      var newRoom = parsed[idx]
      newRoom.name = JSON.parse(payload.textContent).name;
      parsed[idx] = newoom;

      AsyncStorage.setItem("rooms", JSON.stringify(parsed));
    }
    else{
      console.log("ERROR: room not found");
    }
  }
  else{
    console.log("ERROR: rooms null");
  }

}

/*=====================================================*/
// Chat Room List Component
/*=====================================================*/

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);

    this.username = this.props.navigation.getParam("username");
    this.roomsKey = "rooms";
    this.loadRooms(this.roomsKey);
    this.state = {
      rooms: [],
    };
  }

  componentDidMount(){
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.loadRooms(this.roomsKey);
    });
    this.asyncMountFunctions();
  }

  asyncMountFunctions = async () => {
    await this.loadUsername();
    this.checkForNewMessages();
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.subscription.unsubscribe();
}

////////////////////
//Obtain Username //
////////////////////

  loadUsername = async () => {
    var username = await getAuthObject();
    this.setState({"username": username})
    console.log("user: "+this.state.username)
    this.subscription = API.graphql(
      graphqlOperation(OnCreateMessageByRecipient, {to: this.state.username})
      ).subscribe({
      error: err => console.log("______________ERROR__________", err),
      next: event => {

          var messageId = event.value.data.onCreateMessageByRecipient.id;
          // turn on after querying works
          let recpt = deleteMessageAfterRead(messageId)
          console.log("delete: ", recpt)
          const newMessage = JSON.stringify(event.value.data, null, 2);
          console.log("New Message: " + newMessage);
          this.onReceive(event.value.data);

      }
      });
    }


    checkForNewMessages = async() => {

      
      console.log("Querying for offline messages to: " + this.state.username);
      const messagesFromQueue = await API.graphql(graphqlOperation(listMessages, {filter: {to:{eq: this.state.username}}} ));
      console.log("Queried messages: " + JSON.stringify(messagesFromQueue));

      var allMessages = messagesFromQueue.data.listMessages.items; 
      const nextToken = messagesFromQueue.data.listMessages.nextToken; 
      
      while (nextToken != null){
        const moreMessages = await API.graphql(graphqlOperation(listMessages), nextToken );
        console.log("More messages: " + JSON.stringify(moreMessages)); 
        nextToken = moreMessages.data.listMessages.nextToken; 
        var moreMessagesArray = moreMessages.data.listMessages.items; 
        allMessages.concat(moreMessagesArray); 
      }
      var numberOfMessages = allMessages.length;


      // cycle through new messages and send through switch pipeline
      for (var i = 0; i < numberOfMessages; i ++ ){
        var item = allMessages[i];

        var message = {
          "onCreateMessageByRecipient": item,
        };
        console.log("new message: "+ JSON.stringify(message));
        await this.onReceive(message);
      }
    };

///////////////////
//Sub room components//
////////////////////


  renderRoom = ({ item }) => {
    return (
      <TouchableHighlight>

        <View style={styles.list_item}>
          <Text style={styles.list_item_text}>{item.unreadCount}     {item.name}</Text>
          <Button title="Enter" color="#0064e1" onPress={
            () => {
              // console.log( "membersString: ", item.membersString )
              this.props.navigation.navigate('ChatPage',{ "name": item.name.toString(),
                                                              "id": item.id,
                                                              "membersString": item.members  }
                                                              )
            }
            } />
        </View>

        </TouchableHighlight>
    );
  }


  renderDeleteRoom = ({ item }) => {
    return (
      <View style={styles.rowBack}>
            <TouchableOpacity
              style={styles.delete}
              onPress={() =>this.removeRoom(item.id.toString())}
            >
                <Text>Delete</Text>
            </TouchableOpacity>
        </View>
    );
  }


  loadRooms = async (key) => {
    var result = await AsyncStorage.getItem(key);
    if(result != null && result.length){
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

  makeRoom = async (payload) => {
    console.log("Making New Room");
    console.log(payload);
    var newRooms = await AsyncStorage.getItem(this.roomsKey);
    newRooms = JSON.parse(newRooms);

    //parse payload
    var members = payload.roomMembers;
    var id = payload.roomId;
    var name = payload.roomName;


    if(await this.roomDoesNotExist(newRooms, members)){
      var newRoom = {"id": id, "name": name, "members": members};
      console.log(newRoom)
      newRooms.unshift(newRoom);
      await this.storeRooms(this.roomsKey, JSON.stringify(newRooms));
      await AsyncStorage.setItem(id, "[]");
      await AsyncStorage.setItem(this.membersString+"settings", JSON.stringify({"name": name, "members": members}));
      this.loadRooms();
    }
    else{

    }
  }

  //TODO: check if chat with same members exists. If so, send id update message.
  roomDoesNotExist = async (newRooms, members) => {
    return true;
  }

  populate = async() => {


    try{
      const roomObject = retrieveRooms(this);

    } catch (err) {
      console.log(err);
    }

    this.data2 = JSON.stringify(this.data);
    await AsyncStorage.clear();
    this.storeRooms(this.roomsKey, this.data2);
  }

  removeRoom = async(roomId) => {
    console.log(roomId)
    await this.loadRooms(this.roomsKey);

    var newRooms = this.state.rooms;
    // console.log("prefilter");
    newRooms = newRooms.filter(function( room ) {
      return room.id.toString() !== roomId;
    });
    // console.log("postfilter");
    console.log(newRooms);

    AsyncStorage.removeItem(roomId);
    AsyncStorage.removeItem(roomId+"settings");

    await this.storeRooms(this.roomsKey, JSON.stringify(newRooms));
  }

//////////////////////////
//Main render compoennt //
//////////////////////////


  render() {
    const {rooms} = this.state;
    return (
      <View>

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
          <SwipeListView
            keyExtractor={(item) => item.id.toString()}
            data={rooms}
            renderItem={this.renderRoom}
            renderHiddenItem={this.renderDeleteRoom}
            leftOpenValue={0}
            rightOpenValue={-75}
            ListEmptyComponent = {<View style={styles.list_item}>
              <Text style={styles.list_item_text}>{"No Current Conversations"}</Text>
              </View>}
          />
        }
      </View>
    );
  }

//////////////////////////
// Return Functions  //
//////////////////////////

  onReceive = async(messageObject) => {
    try{
      //Decrypt
      console.log("TODO: Implement decrypt");


      // parse incomingMessageItem payload and save into new variable
      var messageObj = messageObject.onCreateMessageByRecipient;
      var payload = messageObj.payload;
      payload = JSON.parse(payload);

      //sort message into correct room
      var roomObj = await AsyncStorage.getItem(payload.roomId);
      //make room if room does not exist locally
      if(roomObj == null){
        await this.makeRoom(payload);
        roomObj = await AsyncStorage.getItem(payload.roomId);
      }

      console.log("action type:  " + payload.actionType);
      console.log(payload);
      switch(payload.actionType){
        //Incoming text message
        case ActionType.TEXT_MESSAGE:{
          await storeIncomingMessage(messageObj, payload, this); 
          this.loadRooms("rooms"); 
          break;
        }
        //settings change
        case ActionType.SETTINGS_CHANGE:{
          await settingsChange(payload);
          this.loadRooms(this.roomsKey);
          console.log("TODO: Implement settings change");
          break;
        }
        //Backup Requested
        case ActionType.BACKUP:{
          AsyncStorage.setItem(payload.roomId,payload.textContent);
          break;
        }
        //id collision fix?
        case 6:{
          console.log("TODO: ? ") ;
          break;
        }
        //Case not recognized (version not up to date or )
        default:
          console.log("Message id not recognized");
      }

      //delete message from db after queried
      deleteMessageAfterRead(messageObj.id);
    }
    catch(err){
      console.log("message receive error: " + err)
    }



  }



}


/*=====================================================*/
// todo move styling to standard sheet
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
      backgroundColor: 'white',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    list_item_text: {
      marginLeft: 10,
      fontSize: 20,
    },
    rowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    delete: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: 75,
        backgroundColor: 'red',
        color: '#FFF',
        bottom: 0,
        top: 0,
        right: 0,
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
