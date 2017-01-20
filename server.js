var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('dist/'));

app.get('/', (req, res) => {
  // res.send('<h1>Hello world</h1>');
  res.sendFile(__dirname + '/views/index.html');
});

const userIds = [];
io.on('connection', (socket) => {

  console.log('a user connected');
  // console.log('socket info: ' + Object.keys(socket));
  // console.log(socket);
  userIds.push(socket.id);
  console.log(19, userIds);


  socket.on('chat message', (msgObj) => {
    console.log('message: ' + msgObj.name + msgObj.message);
    io.emit('chat message', msgObj);
  });

  socket.on('disconnect', () => {
    console.log(socket.id + ' user disconnected');
    var i = userIds.indexOf(socket.id);
    userIds.splice(i, 1);
    io.emit('user left', socket.id);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
  console.log(__dirname);
  console.log(process.env.PORT || 3000);
});
