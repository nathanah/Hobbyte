const express = require("express");
const { generateVirgilJwt } = require('./api/virgilToken');
const app = express();
const cors = require('cors');
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 3000;

app.use(express.json());


io.on("connection", socket => {
  console.log("a user has connected.");
  app.get('/virgil-jwt', requireAuthHeader, generateVirgilJwt);
  app.use(express.static('./public/'));
  module.exports = app;
});



server.listen(port, () => console.log("server running on port:" + port));

