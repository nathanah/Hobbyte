
# Sanctuary Chat

<div style="text-align:center" >
 <p style="color:blue"> <b>UC Davis Senior Design Project 2020: 
     <br>Secure and Private Social Media App </b></p>

    
<b>Client</b>
    Justin Jia
    <br>
    <b>Team Hobbyte</b> 
    Abigail Lee, Nathan Hoffman, 
    Viswaas Prabunathan, John Paulus Francia
</div>


## Preface
Many contemporary social media platforms do not offer users with complete freedom and transparency on where user's metadata is stored nor with whom it is shared. Sanctuary is an open source, cross platform social media app that features two-factor authentication and end-to-end encryption, thereby providing users with optimal security and privacy. Sanctuary also strives to be transparent about data storage and collects minimal user information. 


## Table of Contents
- [Overview of the Product](#overview-of-the-product) 
- [Installation or Distribution](#installation-or-distribution)
- [Sign Up, Login, and User Information Changes](#sign-up-login-and-user-information-changes)
- [Local Storage](#local-storage)
- [Room List and Room Creation](#room-list-and-room-creation)
- [Chat](#chat)
- [Message Queue](#message-queue)
- [Room Settings](#room-settings)
- [Encryption](#encryption)
  - [Personal conversations](#personal-conversations)
  - [Group conversations](#group-conversations)
- [Troubleshooting](#troubleshooting)
- [Frequently Asked Questions](#frequently-asked-questions)
- [Contact Information](#contact-information)
- [Glossary](#glossary)


## Overview of the Product



## Installation or Distribution



## Sign Up, Login, and User Information Changes

Sign up requires the user to provide:

- Username 
- Password - must be longer than 8 characters
- Email 
- Phone Number
- Consent to Terms and Conditions

The goal of Sanctuary have minimal user information on record. This information is stored on AWS Cognito which has customizable multi-factor authentication steps. In Sanctuary, the following two-factor authentication policies were set up to maintain optimal security for the user:

- **Sign up** - After submitting the above account information, they must verify their account by entering a temporary pass code that they receive via text message to complete the signup process. 

(Note: If the user tries to login with an account that has not been verified by entering the one time pass code, they will be redirected to the page where they can complete the account verification process, instead of being logged in.)
- **Login** - User must enter username and password as well as a temporary code texted to their verified phone number.
- **Changing email** - A temporary code is sent to the user's new email to verify it. 
- **Changing phone number** - A temporary code is sent to the new phone to verify it.
- **Changing password** - A temporary code is sent to the verified phone number. 


## Local Storage

Sanctuarty uses [AsyncStorage](https://reactnative.dev/docs/asyncstorage) to store files on device.
Five pieces of information are stored as the following key-value pairs:
1. **"User"** - User token for signin
2. **"keys"** - the User's private key used for encryption
3. **"rooms"** - List of all rooms with basic info.
4. **roomId** - message history for each room based on the rooms' ids
5. **roomId+"settings"** - settings for each room based on the rooms' ids

## Room List and Room Creation

The room list screen provides navigation to each chat room, creation of new chat rooms, and navigation to user settings. Room summaries are stored under the "rooms" key in async storage and displayed as a flatlist. Each item contains the room id, room name, and an unread message count. 

Room creation requires a list of members (not including yourself) as a comma separated list and optionally a custom name for the chat room. The default room name will be "Chat!" if no other name is entered.

## Chat

Our chat interface utilizes "[Gifted Chat](https://github.com/FaridSafi/react-native-gifted-chat) by FaridSafi". It's behavior and layout is similar to Apple's iMessage. It allows the user to enter a message in a discrete text box at the bottom of the screen and then send it. The sender's messages appear on the right and other member's messages appear on the left with a corresponding avatar and username.

User's can scroll up to see previous messsages. 

On the Rooms list screen, the user will see an unread number count next to the room which updates when an incoming message arrives in that room. 

Extra customization in Chat is handled in Room Settings.




##  Message Queue 

To maintain user privacy, the AWS Dynamo database as used as a message queue and channel. 

- **Message storage** - Messages are only temporarily stored on the database if the other user is offline. 
- **Message retrieval** - When recipient is online or comes online, messages are retrieved and stored on the user's local storage then deleted from the database. 
- **Outstanding messages** - Any messages that are not read or retrieved are only allowed to stay on the database for a week and then they are deleted. 
- **Encryption Key Storage** - Public encryption keys are stored indefinitely on the database and are updated everytime the user signs into their account.

Public keys are stored and maintained in this message queue so that they're accessible by any user who would like to start a conversation. 

AWS AppSync API was used to create this message queue communication. AppSync uses GraphQL schemas to route data from user's account to the AWS Dynamo database. In this project, GraphQL queries and mutations were used to create, delete, and query messages as well as public encryption keys from the database. User information, content, and settings are encapsulated in GraphQL requests which are JSON objects. 


## Room Settings

The room settings page provides customizable room name and text or bubble colors. It also allows for the adding/removing of members and sending of the full message history (like a forced backup) to other users. Setting changes and backups are a different message type so that they are handled appropriately.


## Encryption

To ensure messages are protected from MITM (Man in the Middle) attacks, we utitlize [TweetNaCl](https://github.com/dchest/tweetnacl-js) for encrypting texts.

#### Peronsal conversations

Conversations between two are end to end encrypted with TweetNaCl's box method. Each of the two participants create a distant key pair, comprising of a *private* and *public* key.

The partipants share their *public* keys with each other. Using the Diffie Hellman key exchange, the *public* keys (of the other participants) are combined with the local *private* key to sign and encrypt data.

- **Encryption** -The sender signs the outgoing message with their local *private* key and encrypts with the recipients *public* key. 

- **Decryption** -The recipient verifies the signature with the sender’s *public* key and decrypts the message with their local *private* key. 

#### Group conversations
Group messages are encrypted symmetrically and are only visible to the participants of the group. 

The sender of a message encrypts it with a random unique key which is in turn used by the recipients to decrypt it.


## Troubleshooting

### > Sanctuary Chat
**Trouble Signing Up on Sanctuary Chat**

- Ensure the phone number is in the following format **+18885551234** exactly with the '+' and no spaces or characters between the numbers. 
- Email must be a valid format following these guidelines:
"mysite@ourearth.com
my.ownsite@ourearth.org
mysite@you.me.net "
(Source: https://www.w3resource.com/javascript/form/email-validation.php)

- Password must be 8 characters long in our code. We did not make it a requirement to have special characters, capital letters, or numbers. 



### > Expo 

**Debugging on Expo**

If the app crashes, some ways to troubleshoot:
- Expo App crashes on start up 
    - The app's cache and local storage needs to be deleted. Uninstall Expo app and reinstall. If garbage data is retrieved from AWS, it can damage local storage for when one tries to open the app in the future. 
    - Check Console Log and Expo log for warnings and stack trace

If the app is not loading,
- Expo takes roughly 2-5 minutes to first build Javascript bundle and then load app on the first try depending on Wifi connection and device being used. We found that on UCDavis campus, the app took closer to 4-5 minutes to load on the first try and we found it easier to run the app on cellular or hot spot. Debugging over our home Wifi was much faster. 
- Use 'Tunnel' or 'LAN' to run app on phone.

**Expo App not receiving incoming messages**

- Stop Expo process running on computer and reload entire app. 
- A successful received message should display the following logs:
```
New Message: {
  "onCreateMessageByRecipient": {
    "id": "cc3dfe4b-030d-4771-b1db-b89db49d855e",
    "to": "abby",
    "from": "AWS",
    "payload": "{\"nonce\":\"bqVdVZg7cu/kXNl15OTdhIIo2+1Z7frq\",\"key\":\"\",\"payloadEncrypted\":\"ARA6ZA5fs2FrrfMIXnoDU3ZiRkL383DyNossvrlT1JOXcTCfrbp1TZAUD9rDyfZMCMbbhv5ZhrM8vUob3i/dC3wnFibTvWEmqXD6DqrvnYcV+ssFHMMGZbR5c+s0yzYFdCG3/evskZlXOOMWQo1ZY6EF4hUt+yuoMfXGeSCByxwgW7W8MbOdZkxd2C3XD9iHAIIcfTcaJ1bfgCC21EYkQCda7aEIs2lcBHYm1A2n22X7kEn73Ccwf3Jkvs6ONMx4sGxm7YcD5I+ofHBZAyvi/jRxothdpHxR+QEtPB4Pu1WnRyr57UedVmWiKz6crmNHZzibQA==\",\"box\":true}"   
  }
}
```
- Check sender's console logs to ensure message has been sent successfully. A successful message sent should display the following logs:
```
AWS Success - Create Message
Object {
  "data": Object {
    "createMessage": Object {
      "from": "abby",
      "id": "5fbce67e-6600-4557-bece-48a341de9344",
      "payload": "{\"nonce\":\"bqVdVZg7cu/kXNl15OTdhIIo2+1Z7frq\",\"key\":\"\",\"payloadEncrypted\":\"ARA6ZA5fs2FrrfMIXnoDU3ZiRkL383DyNossvrlT1JOXcTCfrbp1TZAUD9rDyfZMCMbbhv5ZhrM8vUob3i/dC3wnFibTvWEmqXD6DqrvnYcV+ssFHMMGZbR5c+s0yzYFdCG3/evskZlXOOMWQo1ZY6EF4hUt+yuoMfXGeSCByxwgW7W8MbOdZkxd2C3XD9iHAIIcfTcaJ1bfgCC21EYkQCda7aEIs2lcBHYm1A2n22X7kEn73Ccwf3Jkvs6ONMx4sGxm7YcD5I+ofHBZAyvi/jRxothdpHxR+QEtPB4Pu1WnRyr57UedVmWiKz6crmNHZzibQA==\",\"box\":true}",      "to": "viswaas",
    },
  },
}
```
This log is triggered when the subscription set up is notified of any additions to the database concerning the user.

**Expo App not sending messages**

If the app is not sending messags, check for 'AWS Success - Create Message' log. If it is not displayed, 
- resend message
- delete room and create a new one
- Check if correct username was entered 
- Reload app
- Check Wifi connection
- Check for Expo logs and warnings
- Reinstall Expo

### > Amazon Web Services

**AWS Dynamo Warning:** - GraphQLError: Request failed with status code 401

When sending messages, if the following error appears: 
```
Possible Unhandled Promise Rejection (id: 5):
Object {
  "data": Object {},
  "errors": Array [
    [GraphQLError: Request failed with status code 401],
  ],
}
```
The API key needs to be updated. To do this, it navigate to the AWS AppSync Settings tab. Copy the "Primary auth mode - API KEY" listed and paste it in the 'aws-exports.js' file in the Sanctuary Chat project. 


The following [tutorial](https://aws-amplify.github.io/amplify-js/api/globals.html#graphqloperation) step 4 - GraphQL API Operations details the placement of API keys and how they are required for any mutation, query, or subscription requests to the AWS Dynamo database. When creating the API at the beginning, the APIkey's lifetime can be set so it doesn't expire every 7 days per default.




**Stopped Receiving SMS codes**
The AWS spending budget needs to be increased if the SMS text codes for authentication have stopped working. The following [tutorial](https://aws.amazon.com/premiumsupport/knowledge-center/sns-sms-spending-limit-increase/) outlines the process. 



**Testing locally using AWS Query Tab**
The AWS AppSync Queries tab can be used to send test messages to the app. It is recommended that the programmer first send a test message from app to database, then copy the payload into the query. Then swap the usernames in the 'to' and 'from' fields. 
An example of mutation:

```
// Used for creating text message, changing room settings, removing or adding members
mutation CreateMessage {
      createMessage(
        input:{
        to: "user1", 
          from: "AWS",
            payload:"INSERT PAYLOAD STRING HERE"
        }
      ) {
              	id
                to
    	        from
               payload 
      }
    }


// Used to check for public key for a certain user
query checkForPublicKey{
  listMessages(filter:{
    to:{eq:"key"}, 
    from:{eq:"user"},
  }){
    items {
      to 
      from  
      id 
      payload 
      
    }
  }
}


```

Payload format - also avalailable (/src/payload.js): 
```
{
    actionType: int 
    roomId: int 
    roomName: String
    roomMembers: [String]
    sender: String
    created: Date
    joiningMember: String
    leavingMember: String
    textContent: String
    newRoomName: String
}
```

## Frequently Asked Questions

**"What if I lost my phone?"**

Other member(s) in the chat room can send a back up copy of the room's chat history by going to the room's Settings page and pressing the "Send Back Up" button at the bototm of the screen. 

Logging into account does not recover all previous conversations otherwise and usernames of other members are remembered.


**How to create a group chat?**
To create a group chat, add the usernames separated by **commas** in the Recipients field of the Create Chat Room screen. 
ex. 
```
user1, user2, user3
```

**How do I leave a chat room?**
[need to finish]



## Contact Information

#### LinkedIn Profiles
- **John Paulus Francia** - https://www.linkedin.com/in/john-paulus-francia/
- **Nathan Hoffman** - https://www.linkedin.com/in/nathan-hoffman/
- **Abigail Lee** - https://www.linkedin.com/in/abigail133/ 
- **Viswaas L Prabunathan** - https://www.linkedin.com/in/viswaasprabunathan





## Glossary



