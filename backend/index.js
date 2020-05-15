// 'use strict';
// const express = require('express');
// const app = express();
// const http = require('http').Server(app);
// const io = require('socket.io')(http);
// const { initCrypto, VirgilCrypto, VirgilAccessTokenSigner} = require('virgil-crypto')
// const {JwtGenerator} = require ('virgil-sdk');
// const interval = 1000;

// require('dotenv').config({path: '.env'}); 

// async function getJwtGenerator() {
//   await initCrypto();

//   const virgilCrypto = new VirgilCrypto();

//   // initialize JWT generator with App ID and App Key ID found in .env file. 
//   //appId, apiKeyId and apiKey is already stored locally in .env in Hobbyte directory.
// console.log("App id:" +process.env.APP_ID);
// console.log("App key id:" +process.env.APP_KEY_ID);
// console.log("App id:" +process.env.APP_KEY);
//   return new JwtGenerator({
//     appId: process.env.APP_ID,
//     apiKeyId: process.env.APP_KEY_ID,
//     apiKey: virgilCrypto.importPrivateKey(process.env.APP_KEY),
//     // initialize accessTokenSigner that signs users JWTs
//     accessTokenSigner: new VirgilAccessTokenSigner(virgilCrypto),
//     // JWT lifetime - 20 minutes (default)
//     millisecondsToLive:  20 * 60 * 1000
//   });
// }

// const generatorPromise = getJwtGenerator();

// var token = {};

// io.on('connect', function(socket, res) {
//   console.log('someone connected from: ' + socket.handshake.address);
//   const generator = generatorPromise;
//   socket.on('pass data to server', function(info){
    
//     // const virgilJwtToken = generator.generateToken(info.username); // Generated Virgil Token based on username
//     console.log('console log: send data to anybody', info);
//     console.log("token: " + virgilJwtToken.toString());
//     socket.emit ('dataFromServer', virgilJwtToken.toString());     //Parse the token to user.
//     io.emit('io emit: send data to anybody', info);
//   });
// });
// http.listen(3006, function(){
//     console.log('listening on *:3006');
// });


'use strict';
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { initCrypto, VirgilCrypto, VirgilAccessTokenSigner} = require('virgil-crypto')
const {JwtGenerator} = require ('virgil-sdk');
const interval = 1000;

require('dotenv').config({path: '.env'}); 
console.log(process.env.APP_ID);



async function getJwtGenerator() {
  await initCrypto();

  const virgilCrypto = new VirgilCrypto();

  // initialize JWT generator with App ID and App Key ID found in .env file. 
  //appId, apiKeyId and apiKey is already stored locally in .env in Hobbyte directory.
console.log("App id:" +process.env.APP_ID);
console.log("App key id:" +process.env.APP_KEY_ID);
console.log("App id:" +process.env.APP_KEY);
console.log("hi");
  return new JwtGenerator({
    appId: process.env.APP_ID,
    apiKeyId: process.env.APP_KEY_ID,
    apiKey: virgilCrypto.importPrivateKey(process.env.APP_KEY),
    // initialize accessTokenSigner that signs users JWTs
    accessTokenSigner: new VirgilAccessTokenSigner(virgilCrypto),
    // JWT lifetime - 20 minutes (default)
    millisecondsToLive:  20 * 60 * 1000
  });
}

const generatorPromise = getJwtGenerator();

var token = {};

io.on('connect', async (socket, res) => {
  console.log('someone connected from: ' + socket.handshake.address);
  const generator = await generatorPromise;
  socket.on('pass data to server', function(info){
    
    const virgilJwtToken = generator.generateToken(info.username); // Generated Virgil Token based on username
    console.log('console log: send data to anybody', info);
    console.log("token: " + virgilJwtToken.toString());
    socket.emit ('dataFromServer', virgilJwtToken.toString());     //Parse the token to user.
    io.emit('io emit: send data to anybody', info);
  });
});
http.listen(3006, function(){
    console.log('listening on *:3006');
});