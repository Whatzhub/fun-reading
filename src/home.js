var socket = io();
socket.connect('localhost:3000/play');

var home = new Vue({
  data: {
    name: '',
    rating: 0,
    isShake: false,
    waitScreen: false,
    seconds: 10,
    usersNum: 0
  },
  mounted: function() {
    console.log('Home screen loaded!');
  },
  methods: {
    submitName: function(e) {
      if (this.name == '') {
        this.isShake = true;
        setTimeout(() => this.isShake = false, 1000);
        return;
      }
      socket.emit('join', this.name);
      sessionStorage.setItem('name', this.name);
      this.name = '';
      // location.href = location.href + 'play';
    },
    timerCount: function() {
        this.seconds--;
        if (this.seconds == 0) return console.log('game start!');
        setTimeout(function() {
          home.timerCount();
        }, 1000);
    }
  }
});

if (document.getElementById('home') != null) {
  console.log('Home screen is present');
  home.$mount('#home');

  var socket = io('/');

  socket.on('join msg', (name, count) => {
    console.log(12, name, count);
    if (count == 1) {
      console.log(name + ' is waiting for another player..' );
      home.waitScreen = true;
      home.usersNum = 1;
      home.timerCount();
    }
    if (count == 2) {
      console.log(name + ' let us play!');
      home.waitScreen = true;
      home.usersNum = 2;
      location.href = location.href + 'play';
    }
  });
}
