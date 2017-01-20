import dataSource from './js/store';
require('./scss/globals.scss');

var socket = io();

socket.on('chat message', function(msg) {
  var li = document.createElement('li');
  li.innerHTML = msg.name + ' said: ' + msg.message;
  document.getElementById('messages').appendChild(li);
});

socket.on('user left', function(user) {
  console.log(user + ' has left');
  var li = document.createElement('li');
  li.innerHTML = user + ' has left...';
  document.getElementById('messages').appendChild(li);
});

var app = new Vue({
  el: '#test',
  data: {
    message: 'type your msg..'
  },
  methods: {
    clear: function() {
      this.message = '';
    },
    submit2: function(e) {
      if (this.message == '') return;
      console.log(this.message);
      var msgObj = {
        id: Date.now(),
        message: app.message
      }
      socket.emit('chat message', msgObj);
      this.message = '';
    }
  }
});
