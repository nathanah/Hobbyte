/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const OnCreateMessageByRecipient = /* GraphQL */ `
  subscription OnCreateMessageByRecipient($to: String!) {
    onCreateMessageByRecipient(to: $to) {
      id
      to
      payload
    }
  }
`;

export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage {
    onCreateMessage {
      id
      to
      payload
    }
  }
`;

export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage {
    onUpdateMessage {
      id
      to
      payload
    }
  }
`;
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage {
    onDeleteMessage {
      id
      to
      payload
    }
  }
`;
