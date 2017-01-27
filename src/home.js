var socket = io();
socket.connect('localhost:3000/play');

var home = new Vue({
  data: {
    name: '',
    rating: 0,
    isShake: false,
    waitScreen: false,
    seconds: 60,
    usersNum: 0
  },
  mounted: function() {
    console.log('Home screen loaded!');
  },
  computed: {
    timer: function() {
      setInterval(function() {
        return home.seconds--;
      }, 1000);
    }
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
    }
  }
});

if (document.getElementById('home') != null) {
  console.log('Home screen is present');
  home.$mount('#home');

  var socket = io('/');

  socket.on('join msg', (name, count) => {
    // var li = document.createElement('li');
    // li.innerHTML = name + ' has just joined.';
    // document.getElementById('messages').appendChild(li);
    console.log(12, name, count);
    if (count == 1) {
      console.log(name + 'is waiting for another player..' );
      home.waitScreen = true;
      home.usersNum = 1;
    }
    if (count == 2) {
      console.log(name + ' let us play!');
      home.waitScreen = true;
      home.usersNum = 2;
      location.href = location.href + 'play';
    }
  });
}
