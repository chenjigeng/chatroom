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
  		allUsers.push(data.nickname);
  		callback({result: true, allUsers: allUsers});
      socket.nickname=data.nickname;
      sockets[data.nickname] = socket;
  		socket.broadcast.emit("Message", {message: "有新用户进入聊天室", nickname: data.nickname, allUsers: allUsers});
  }});
 
  socket.on('addMessage',function(data){ //有用户发送新消息
  	socket.broadcast.emit("Message", data);
  });
   
  socket.on('disconnect', function () { //有用户退出聊天室
  	socket.broadcast.emit("userRemoved", {
      nickname: socket.nickname
    })
    for (var i = 0; i < allUsers.length; i++)
      if (allUsers[i] == socket.nickname) {
        allUsers.splice(i, 1);
        break;
      }
    delete sockets[socket.nickname]
  });
});
 
http.listen(3002, function () {
  console.log('listening on *:3002');
});