export const ActionType = {
    TEXT_MESSAGE: 1,
    SETTINGS_CHANGE: 2,
    BACKUP: 3

}

export class Payload{
    constructor(actionType,
                roomId,
                roomName,
                roomMembers,
                sender,
                created,
                joiningMember,
                leavingMember,
                textContent,
                newRoomName) {

      this.actionType = actionType;
      this.roomId = roomId;
      this.roomName = roomName;
      this.roomMembers = roomMembers;
      this.sender = sender;
      this.created = created;
      this.joiningMember = joiningMember;
      this.leavingMember = leavingMember;
      this.textContent = textContent;
      this.newRoomName = newRoomName;
    }
    validPayload(){
        switch(this.actionType){
            case ActionType.TEXT_MESSAGE: {
                if(this.textContent === null){
                    return false;
                }
                return true;
            }
            case ActionType.SETTINGS_CHANGE: {
                return true;
            }
            case ActionType.MEMBER_LEFT: {
                if(this.leavingMember === null) {
                    return false;
                }
                return true;
            }
            case ActionType.MEMBER_JOINED: {
                if(this.joiningMember === null) {
                    return false;
                }
                return true;
            }
            case ActionType.BACKUP: {
                return true;
            }
            default: {
                return false;
            }
        }
    }

    get(){
        console.log("validatepayload: ", this.validPayload())
        if(this.validPayload()) {
            return {
                actionType: this.actionType,
                roomId: this.roomId,
                roomName: this.roomName,
                roomMembers: this.roomMembers,
                sender: this.sender,
                created: this.created,
                joiningMember: this.joiningMember,
                leavingMember: this.leavingMember,
                textContent: this.textContent,
                newRoomName: this.newRoomName
            };
         } else {
           return null;
         }
    }
  }

//   let pl1 = new Payload(actionType=ActionType.TEXT_MESSAGE,
//                        roomId=12234,
//                         roomName="fun room",
//                          roomMembers=['bpb', 'din','dsin'],
//                           sender ='john',
//                            joiningMember=null,
//                             leavingMember=null,
//                             textContent="This is some text",
//                              newRoomName=null).get()
// let pl2 = new Payload(actionType=ActionType.TEXT_MESSAGE,
//                         roomId=12234,
//                         roomName="fun room",
//                         roomMembers=['bpb', 'din','dsin'],
//                         sender ='john',
//                         joiningMember=null,
//                         leavingMember=null,
//                         textContent=null,
//                         newRoomName=null).get()

// console.log(pl1)
// console.log(pl2)


// pl1 = new Payload(actionType=ActionType.ROOM_NAME_CHANGE,
//     roomId=12234,
//      roomName="fun room",
//       roomMembers=['bpb', 'din','dsin'],
//        sender ='john',
//         joiningMember=null,
//          leavingMember=null,
//          textContent=null,
//           newRoomName="More fun room").get()
// pl2 = new Payload(actionType=ActionType.ROOM_NAME_CHANGE,
//     roomId=12234,
//      roomName="fun room",
//       roomMembers=['bpb', 'din','dsin'],
//        sender ='john',
//         joiningMember=null,
//          leavingMember=null,
//          textContent=null,
//           newRoomName=null).get()


// console.log(pl1)
// console.log(pl2)


// pl1 = new Payload(actionType=ActionType.MEMBER_LEFT,
//     roomId=12234,
//      roomName="fun room",
//       roomMembers=['bpb', 'din','dsin'],
//        sender ='john',
//         joiningMember=null,
//          leavingMember="Sam",
//          textContent=null,
//           newRoomName="More fun room").get()
// pl2 = new Payload(actionType=ActionType.MEMBER_LEFT,
//     roomId=12234,
//      roomName="fun room",
//       roomMembers=['bpb', 'din','dsin'],
//        sender ='john',
//         joiningMember=null,
//          leavingMember=null,
//          textContent=null,
//           newRoomName=null).get()


// console.log(pl1)
// console.log(pl2)


// pl1 = new Payload(actionType=ActionType.MEMBER_JOINED,
//     roomId=12234,
//      roomName="fun room",
//       roomMembers=['bpb', 'din','dsin'],
//        sender ='john',
//         joiningMember="John",
//          leavingMember="Sam",
//          textContent=null,
//           newRoomName="More fun room").get()
// pl2 = new Payload(actionType=ActionType.MEMBER_JOINED,
//     roomId=12234,
//      roomName="fun room",
//       roomMembers=['bpb', 'din','dsin'],
//        sender ='john',
//         joiningMember=null,
//          leavingMember=null,
//          textContent=null,
//           newRoomName=null).get()


// console.log(pl1)
// console.log(pl2)



// pl1 = new Payload(actionType=ActionType.BACKUP_REQUEST,
//     roomId=12234,
//      roomName="fun room",
//       roomMembers=['bpb', 'din','dsin'],
//        sender ='john',
//         joiningMember="John",
//          leavingMember="Sam",
//          textContent=null,
//           newRoomName="More fun room").get()

// console.log(pl1)

// pl1 = new Payload(actionType=6,
//     roomId=12234,
//      roomName="fun room",
//       roomMembers=['bpb', 'din','dsin'],
//        sender ='john',
//         joiningMember="John",
//          leavingMember="Sam",
//          textContent=null,
//           newRoomName="More fun room").get()

// console.log(pl1)
