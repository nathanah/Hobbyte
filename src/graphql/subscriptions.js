/* eslint-disable */
// this is an auto generated file. This will be overwritten
export const onCreateMessageByRecipient = /* GraphQL */ `
  subscription OnCreateMessageByRecipient($to: String!) {
    onCreateMessageByRecipient(to: $to) {
      id
      actionType
      roomID
      roomName
      textContent
      when
      from
      to
    }
  }
`;
export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage {
    onCreateMessage {
      id
      actionType
      roomID
      from
      to
      joiningMember
      leavingMember
      roomName
      textContent
    }
  }
`;
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage {
    onUpdateMessage {
      id
      actionType
      roomID
      from
      to
      joiningMember
      leavingMember
      roomName
      textContent
    }
  }
`;
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage {
    onDeleteMessage {
      id
      actionType
      roomID
      from
      to
      joiningMember
      leavingMember
      roomName
      textContent
    }
  }
`;
