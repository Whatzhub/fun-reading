var express = require('express');
var app = express();
var Helpers = require('./modules/helpers');
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('dist/'));

app.get('/', (req, res) => {
  // res.send('<h1>Hello world</h1>');
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/log', (req, res) => {
  res.sendFile(__dirname + '/views/log.html');
});

app.get('/play', (req, res) => {
  res.sendFile(__dirname + '/views/play.html');
  var words;
  Helpers.download('http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=10&limit=' + 10 + '&api_key=' +'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5')
    .then((data) => {
      console.log(16, data);
      words = data;
      io.emit('play msg', words);
    });
});

const users = [];
const words = [];
var playerNo = 0;
var roomNo = 0;
var roomName = '';

var home = io.of('/');
home.on('connection', (socket) => {

  socket.on('join', (userName) => {
    playerNo++;

    if (playerNo == 1) {
      roomName = 'playroom' + roomNo;
      socket.join(roomName);
      console.log('1st player pending game: ' + userName);
      users.push({
        userId: socket.id,
        userName: userName,
        playerNo: playerNo,
        roomName: roomName
      });
      io.in(roomName).emit('join msg', userName, roomName);
      console.log('Updated Current Users: ' + JSON.stringify(users, null, '  '));
      console.log('Rooms: ' + JSON.stringify(io.sockets.adapter.rooms, null, '  '));
    }

    if (playerNo == 2) {
      socket.join(roomName);
      // TODO: Emit
      io.in(roomName).emit('join msg', userName, roomName);
      // TODO: Broadcast to all playroom1 players to start game
      playerNo = 0;
      roomNo++;
      console.log('Updated Current Users: ' + JSON.stringify(users, null, '  '));
      console.log('Rooms: ' + JSON.stringify(io.sockets.adapter.rooms, null, '  '));
    }
  });


  io.in('playroom1').on('leave', () => {
    console.log(socket.id + 'has left playroom1');
  });
});

var playroom = io.of('/playroom');
playroom.on('connection', (socket) => {

  console.log('a user connected to playroom');
  playroom.emit('a user has connected to playroom');
  // console.log('socket info: ' + Object.keys(socket));
  // console.log(socket);
  // userIds.push(socket.id);
  // console.log(19, users);

  // TODO: close playroom if all user left


  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    users.forEach((i,el) => {
      if (socket.id == i.userId) {
        playroom.emit('chat message', msg, i.userName);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log(socket.id + ' user disconnected');

    // Remove disconnected users from chatroom
    users.forEach((i,el) => {
      if (socket.id == i.userId) {
        playroom.emit('user left', i.userName);
        users.splice(i, 1);
      }
    });

    console.log('Updated Current Users: ' + JSON.stringify(users, null, '  '));
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
  console.log(__dirname);
  console.log(process.env.PORT || 3000);
});
