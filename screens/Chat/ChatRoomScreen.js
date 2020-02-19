// not working 
import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router, ServerRouter } from 'react-router-dom';
import Rooms from './Rooms';
import ChatScreen from './ChatScreen';
import {createMemoryHistory} from 'history';
// state = {
//   rooms: []
// // // }; 
// // constructor(props) {

// //   super(props); 
// //   const {navigation} = this.props; 
// //   this.username = navigation.getParam("username");
// // }

// async componentDidMount() {
//   try{
//     // const response = await 
//     const {rooms} = response.data;
//     this.setState({
//       rooms
//     });
//   } catch (get_rooms_err){
//     console.log("error getting rooms:", get_rooms_err); 
//   }
// }
//    renderRoom = ({ item }) => {
//     return (
//       <View style={styles.list_item}>
//         <Text style={styles.list_item_text}>{item.name}</Text>
//         <Button title="Enter" color="#0064e1" onPress={() => {
//           this.enterChat(item);
//         }} />
//       </View>
//     );
//   }
//   render() {
//     const {rooms} = this.state;
//     return (
//       <View >
//         {
//           rooms && 
//           <FlastList
//             keyExtractor={(item)=> item.id.toString()}
//             data={rooms}
//             renderItem={this.renderRoom}
//           />
//         }
//       </View>
//     );
    
 
  // }

  
//const history = createMemoryHistory(); 


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

// export default ChatRoom;
