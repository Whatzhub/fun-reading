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
});

const Users = [];
const words = [];
var playerNo = 0;
var roomNo = 0;
var roomName = '';

var home = io.of('/');
home.on('connection', (socket) => {
  console.log('a user with socket id ' + socket.id + ' has landed on the homepage');

  // Socket #1 - Players trigger 'play' socket
  socket.on('join', (userName) => {
    playerNo++;

    if (playerNo == 1) {
      roomName = 'playroom' + roomNo;
      socket.join(roomName);
      console.log('1st player pending game: ' + userName);
      Users.push({
        userId: socket.id,
        userName: userName,
        playerNo: playerNo,
        roomName: roomName
      });
      io.in(roomName).emit('join msg', userName, playerNo, roomName);
      console.log('Updated Current Users: ' + JSON.stringify(Users, null, '  '));
      console.log('Rooms: ' + JSON.stringify(io.sockets.adapter.rooms, null, '  '));
    }

    if (playerNo == 2) {
      socket.join(roomName);
      Users.push({
        userId: socket.id,
        userName: userName,
        playerNo: playerNo,
        roomName: roomName
      });

      // Broadcast to pending players for this playroom
      io.in(roomName).emit('join msg', userName, playerNo, roomName);

      //

      Helpers.download('http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&minCorpusCount=' + 1000000 + '&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=16&limit=' + 10 + '&api_key=' + 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5')
        .then((data) => {
          console.log(16, data);
          var wordsList = data;
          io.in(roomName).emit('play begin', wordsList);

          // Reset playroom counter for new pending players
          playerNo = 0;
          roomNo++;
          console.log('Updated Current Users: ' + JSON.stringify(Users, null, '  '));
          console.log('Rooms: ' + JSON.stringify(io.sockets.adapter.rooms, null, '  '));

        })
        .catch((err) => console.log(err));


    }
  });

  // Socket #2 - Players trigger 1-on-1 playroom gameplay
  socket.on('play', (thisRoomName) => {
    console.log('Users ready to play at ' + thisRoomName);
  });

  // Socket #3 - Detect user disconnection
  socket.on('disconnect', (msg) => {
    var inPlay = false;
    try {
      Users.forEach((i, el) => {
        if (i.userId == socket.id) {
          io.in(i.roomName).emit('opponent left', i.userName + ' has left ' + i.roomName);
          inPlay = true;
        }
      });
      if (inPlay) return console.log('A user has left the gameroom');
    } catch (err) {
      console.log(89, err);
    }
    return console.log('A user has left the homepage.');

  });

});


var playroom = io.of('/player');
playroom.on('connection', (socket) => {

  console.log('a user connected to playroom');
  playroom.emit('a user has connected to playroom');
  // console.log('socket info: ' + Object.keys(socket));
  // console.log(socket);
  // userIds.push(socket.id);
  // console.log(19, Users);

  // TODO: close playroom if all user left


  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    Users.forEach((i, el) => {
      if (socket.id == i.userId) {
        playroom.emit('chat message', msg, i.userName);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log(socket.id + ' user disconnected');

    // Remove disconnected Users from chatroom
    Users.forEach((i, el) => {
      if (socket.id == i.userId) {
        playroom.emit('user left', i.userName);
        Users.splice(i, 1);
      }
    });

    console.log('Updated Current Users: ' + JSON.stringify(Users, null, '  '));
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
  console.log(__dirname);
  console.log(process.env.PORT || 3000);
});
