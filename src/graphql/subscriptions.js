/* eslint-disable */
// this is an auto generated file. This will be overwritten
export const OnCreateMessageByRecipient = /* GraphQL */ `
  subscription OnCreateMessageByRecipient($to: String!) {
    onCreateMessageByRecipient(to: $to) {
      id
      to
      from
      payload
    }
  }
`;
export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage {
    onCreateMessage {
      id
      to
      from
      payload
    }
  }
`;
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage {
    onUpdateMessage {
      id
      to
      from
      payload
    }
  }
`;
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage {
    onDeleteMessage {
      id
      to
      from
      payload
    }
  }
`;
