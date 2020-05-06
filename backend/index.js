'use strict';
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const interval = 1000;

/*
io.on("connection", socket => {
  
    console.log("Hello! Connected to server")
    console
  
});

server.listen(port, () => console.log("server running on port:" + port)); 

*/

io.on('connect', function(socket){
  console.log('someone connected from: ' + socket.handshake.address);
  socket.on('pass data to server', function(info){
    console.log('console log: send data to anybody', info);
    socket.emit ('dataFromServer', 'Hi this is from server!'); 
    io.emit('io emit: send data to anybody', info);
  });
});

http.listen(3006, function(){
    console.log('listening on *:3006');
});