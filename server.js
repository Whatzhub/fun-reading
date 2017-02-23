var express = require('express');
var app = express();
var Helpers = require('./modules/helpers');
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('dist/'));

// Express Api Paths
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/log', (req, res) => {
  res.sendFile(__dirname + '/views/log.html');
});


// Web Sockets Paths
const wordnikApiKey = 'c61946c3146a862c213773d7a1a0a0aa8991e1324a5e34738';
const wordsApiUrl = 'http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&minCorpusCount=' + 100000 + '&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=2&maxLength=16&limit=' + 50 + '&api_key=' + wordnikApiKey;
const Users = [];
const words = [];
var playerNo = 0;
var roomNo = 0;
var roomName = '';

var home = io.of('/');
home.on('connection', (socket) => {
  console.log('a user with socket id ' + socket.id + ' has landed on the homepage');

  // Socket #1 - Players input name and pressed play
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
        roomName: roomName,
        pending: true,
        playing: false,
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
        roomName: roomName,
        pending: false,
        playing: true,
      });

      // Set Player 1 to gameplay mode
      var playerOneOpponent;
      var playerTwoOpponent;
      Users.forEach((i, el) => {
        if (i.roomName == roomName && i.playerNo == 1) {
          i.pending = false;
          i.playing = true;
          playerTwoOpponent = i.userName;
        }
        if (i.roomName == roomName && i.playerNo == 2) {
          playerOneOpponent = i.userName;
        }
      });

      // Broadcast to pending players for this playroom
      io.in(roomName).emit('join msg', userName, playerNo, roomName);

      Helpers.download(wordsApiUrl)
        .then((data) => {
          console.log(16, data);
          var wordsList = data;
          console.log(playerOneOpponent, playerTwoOpponent);
          io.in(roomName).emit('play begin', wordsList, playerOneOpponent, playerTwoOpponent);

          // Reset playroom counter for new pending players
          playerNo = 0;
          roomNo++;
          console.log('Updated Current Users: ' + JSON.stringify(Users, null, '  '));
          console.log('Rooms: ' + JSON.stringify(io.sockets.adapter.rooms, null, '  '));

        })
        .catch((err) => console.log(err));


    }
  });

  // Socket #2 - Player matched word successfully
  socket.on('player matched word', (word, score, level) => {
    Users.forEach((i, el) => {
      if (i.userId == socket.id) {
        io.in(i.roomName).emit('player matched word emit', i.userName, word, score, level)
        console.log(i.userName, word, score, level);
      }
    })

  });

  // Socket #3 - Detect user disconnection
  socket.on('disconnect', (msg) => {
    try {
      var result = 'not playing';
      Users.forEach((i, el) => {
        // Case 1: User left when pending game
        if (i.userId == socket.id && i.pending == true) {
          Users.splice(el, 1);
          playerNo = 0;
          result = 'pending game';
        }
        // Case 2: User left from playroom
        if (i.userId == socket.id && i.playing == true) {
          io.in(i.roomName).emit('opponent left', i.userName + ' has left ' + i.roomName);
          Users.splice(el, 1);
          result = 'playing game';
        }
      });
      console.log(115, result);

      if (result == 'pending game') return console.log('A user has left prior to game start');
      else if (result == 'playing game') return console.log('A user has left the gameroom');
      else return console.log('A user has left the homepage.');

    } catch (err) {
      console.log(119, err);
    }

  });

});


server.listen(3000, () => {
  console.log('listening on *:3000');
  console.log(__dirname);
  console.log(process.env.PORT || 3000);
});
