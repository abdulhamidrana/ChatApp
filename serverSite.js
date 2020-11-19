var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname +'/public_files'));

var usernames = {};

io.sockets.on('connection', function (socket) {
	 socket.on('other file', function (data) {
        socket.broadcast.emit('otherformat', socket.username, data);
    });
	 
	 socket.on('user image', function (data) {
        socket.broadcast.emit('addimage', socket.username, data);
    });

	socket.on('sendchat', function (data) {
		io.sockets.emit('updatechat', socket.username, data);
	});

	socket.on('adduser', function(username){
		socket.username = username;
		usernames[username] = username;
		socket.emit('updatechat', 'SERVER', 'you have connected');
		socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
		io.sockets.emit('updateusers', usernames);
	});

	socket.on('disconnect', function(){
		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames);
		socket.broadcast.emit('updatechat', 'SERVER'
		, socket.username + ' has disconnected');
	});
});




app.get('/', function(req, res){
	res.sendFile(__dirname+'/public_files/interface.html');
});

var port = 8080;
server.listen(port);
console.log("localhost... "+port);