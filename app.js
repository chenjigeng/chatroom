var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
 
app.use(express.static(__dirname + '/public'));
 
 
app.get('/', function (req, res) {
  res.sendfile('index.html');
});
 
var sockets = {};
var allUsers = ["群聊"];
io.on('connection',function(socket){
  socket.on('addUser',function(data, callback){ //有新用户进入聊天室
  	if (sockets[data.nickname]) {
  		console.log("false");
  		callback({result: false})
  	}
  	else {
  		console.log("success");
  		sockets[data.nickname] = socket;
  		allUsers.push(data.nickname);
  		callback({result: true, allUsers: allUsers});
  		socket.broadcast.emit("Message", {message: "有新用户进入聊天室", nickname: data.nickname, allUsers: allUsers});
  }});
 
  socket.on('addMessage',function(data){ //有用户发送新消息
  	console.log("enter socket");
    if (data.received) {
      sockets[data.received].emit("Message", data);
    }
  	socket.broadcast.emit("Message", data);
  });
   
  socket.on('disconnect', function () { //有用户退出聊天室
  	console.log("leave");
  });
});
 
http.listen(3002, function () {
  console.log('listening on *:3002');
});