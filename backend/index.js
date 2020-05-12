
'use strict';
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { initCrypto, VirgilCrypto, VirgilAccessTokenSigner} = require('virgil-crypto')
const {JwtGenerator} = require ('virgil-sdk');
const interval = 1000;

// import {APP_ID, APP_KEY_ID, APP_KEY} from '../.env'; 
// const process = require('../.env'); 
const process = require('../.env').config(); 
// const appkeyid = require('../.env').APP_KEY_ID; 
// const appkey = require('../.env').APP_KEY; 



async function getJwtGenerator() {
  await initCrypto();

  const virgilCrypto = new VirgilCrypto();

  // initialize JWT generator with App ID and App Key ID found in .env file. 
  //appId, apiKeyId and apiKey is already stored locally in .env in Hobbyte directory.
console.log("App id:" +process.APP_ID);
console.log("App key id:" +process.APP_KEY_ID);
console.log("App id:" +process.APP_KEY);
console.log("hi");
console.log("App id:" + appid);
// console.log("App key id:" +appkeyid);
// console.log("App id:" +appkey);
  // return new JwtGenerator({
  //   appId: process.env.APP_ID,
  //   apiKeyId: process.env.APP_KEY_ID,
  //   apiKey: virgilCrypto.importPrivateKey(process.env.APP_KEY),
  //   // appId: keys.APP_ID,
  //   // apiKeyId: keys.APP_KEY_ID,
  //   // apiKey: virgilCrypto.importPrivateKey(keys.APP_KEY),
  //   // initialize accessTokenSigner that signs users JWTs
  //   accessTokenSigner: new VirgilAccessTokenSigner(virgilCrypto),
  //   // JWT lifetime - 20 minutes (default)
  //   millisecondsToLive:  20 * 60 * 1000
  // });
}

const generatorPromise = getJwtGenerator();

var token = {};

io.on('connect', function(socket){
  console.log('someone connected from: ' + socket.handshake.address);
  const generator = generatorPromise;
  socket.on('pass data to server', function(info){
    
    const virgilJwtToken = generator.generateToken(info.username); // Generated Virgil Token based on username
    console.log('console log: send data to anybody', info);
    
    token.json({ virgilToken: virgilJwtToken.toString() });    // Convert the token into JSON object
   
    socket.emit ('dataFromServer', token);     //Parse the token to user.
    io.emit('io emit: send data to anybody', info);
  });
});

http.listen(3006, function(){
    console.log('listening on *:3006');
});