// Declare external modules
import WebSpeech from './js/webSpeech';
import Store from './js/store';
var socket = io('/');

// Declare home View
var home = new Vue({
  data: {
    // Home Data
    name: '',
    rating: 0,
    homeScreen: false,
    waitScreen: false,
    gameScreen: false,
    seconds: 10,
    playerNo: 0
  },
  mounted: function() {
    console.log('Home screen loaded!');

    // Trigger play action
    socket.on('join msg', (userName, playerNo, roomName) => {
      console.log(12, userName, playerNo, roomName);

      if (playerNo == 1) {
        console.log(userName + ' is waiting for another player at ' + roomName);
        home.waitScreen = true;
        home.playerNo = 1;
        home.timerCount();
      }
      if (playerNo == 2) {
        console.log(userName + ' let us play!');
        home.waitScreen = true;
        home.playerNo = 2;

        // Trigger play socket
        // socket.emit('play', roomName);

        // location.href = location.href + 'play';
      }
    });

    // Trigger playroom mode
    socket.on('play begin', (msg) => {
      console.log(msg);
      home.waitScreen = false;
      home.gameScreen = true;
    });
  },
  methods: {
    submitName: function(e) {
      if (this.name == '') {
        this.isShake = true;
        setTimeout(() => this.isShake = false, 1000);
        return;
      }
      socket.emit('join', this.name);
      // sessionStorage.setItem('name', this.name);
      Store.setUserName(this.name);
      this.name = '';
      // location.href = location.href + 'play';
    },
    timerCount: function() {
        this.seconds--;
        if (home.gameScreen || this.seconds == 0) return console.log('game start!');
        setTimeout(function() {
          home.timerCount();
        }, 1000);
    }
  }
});

var play = new Vue({
  data: {
    currentUser: '',
    name: '',
    typedWord: '',
    matchedWord: '',
    isShake: false,
    gameScreen: false,
    wordApiUrl: Store.getWordsApiUrl(),
    words: [],
    // Web Speech API Data
    recognition: {},
    recognisedWord: '',
    speechResult: false,
    speechStopped: false,
    speechError: false
  },
  mounted: function() {
    console.log('Play screen mounted!');

    // Socket #1 - Trigger playroom mode
    socket.on('play begin', (words) => {
      console.log(JSON.parse(words));
      var data = JSON.parse(words);
      var scoreMap = Store.getWordsScoreMap();
      console.log(97, data);

      var mappedList = [];
      data.forEach((i, el) => {
        var wordLen = i.word.length;
        scoreMap.forEach((j, el2) => {
          if (wordLen == j[0]) {
            mappedList.push({
              id: i.id,
              word: i.word,
              score: j[1]
            });
          }
        });
      });
      play.words = mappedList;

      play.initGame();
    });

    // Socket #2 - Listen to other player's matched words
    socket.on('player matched word emit', (player, word) => {
      console.log(player, word);
      play.clearWord(word);
    });

    // Socket #3 - Listen to opponent left
    socket.on('opponent left', (msg) => {
      console.log(msg);
    });

  },
  methods: {
    initGame: function(e) {
      play.gameScreen = true;
      this.name = Store.getUserName();

      // TODO: Single Player Mode
      // axios.get(this.wordApiUrl)
      //   .then((res) => {
      //     console.log(110, res);
      //     this.words = res.data;
      //   })
      //   .catch((err) => console.log(err));

      this.recognition = WebSpeech.init();
      this.recognition.start();

      this.recognition.onresult = function(ev) {
        play.speechResult = true;
        console.log('Web speech recognition result returned...');
        var lastIndex = ev.results.length - 1;
        var word = ev.results[lastIndex][0].transcript;
        play.recognisedWord = word;
        play.submitMsg();
      }

      this.recognition.onspeechend = function(ev) {
        play.speechResult = false;
        play.speechStopped = true;
        console.log('Web speech recognition stopped...');
        play.recognisedWord = '';
        play.recognition.stop();

        if (!play.speechError) {
          setTimeout(function() {
            play.recognition.start();
            play.speechStopped = false;
          }, 500);
        }
      }

      this.recognition.onerror = function(e) {
        play.speechError = true;
        console.log('Web speech recognition result error...');
        console.log(e);
        if (!play.speechStopped) {
          setTimeout(function() {
            play.recognition.start();
            play.speechError = false;
          }, 500);
        }

      }
    },
    submitMsg: function(e) {
      // NOTE: Including typed input for testing
      var typedWord = this.typedWord.toLowerCase();
      var recognisedWord = this.recognisedWord.toLowerCase();

      this.words.forEach((i, el) => {
        var checkedWord = i.word.toLowerCase();
        if (typedWord == checkedWord || recognisedWord == checkedWord) {
          // remove from words array
          this.matchedWord = checkedWord;
          this.words.splice(el, 1);
          // Notify opponent
          socket.emit('player matched word', checkedWord);
        }
      });
      this.typedWord = '';
    },
    clearWord: function(returnedWord) {
      var clear = returnedWord.toLowerCase();

      this.words.forEach((i, el) => {
        var check = i.word.toLowerCase();
        if (clear == check) {
          this.words.splice(el, 1);
        }
      });
    }
  }
});

// Initialise Home View
if (document.getElementById('home') != null) {
  console.log('Home screen is present');
  home.$mount('#home');
  play.$mount('#play');
}
