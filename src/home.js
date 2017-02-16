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
    socket.on('join msg', (userName, playerNo, roomName, opponentName) => {
      console.log(12, userName, playerNo, roomName);

      if (userName == this.name && playerNo == 1) {
        console.log(userName + ' is waiting for another player at ' + roomName);
        this.waitScreen = true;
        this.playerNo = 1;
        this.timerCount();
      }
      else {
        this.waitScreen = true;
        this.playerNo = 2;
      }
    });

    // Trigger playroom mode
    socket.on('play begin', (wordsList, playerTwo, playerOne) => {
      console.log(wordsList);

      if (this.name == playerOne) Store.setOpponentName(playerTwo);
      else Store.setOpponentName(playerOne);

      this.waitScreen = false;
      this.gameScreen = true;
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
      // this.name = '';
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
    player: {
      name: '',
      score: 0,
      wordScore: 0,
      showScore: false,
      typedWord: '',
      matchedWord: '',
      lvZeroCount: 0,
      lvOneCount: 0,
      lvTwoCount: 0
    },
    opponent: {
      name: '',
      score: 0,
      typedWord: '',
      matchedWord: '',
      lvZeroCount: 0,
      lvOneCount: 0,
      lvTwoCount: 0
    },
    seconds: 30,
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
  computed: {
    computedWords: function() {
      return this.words.slice(0, 5);
    }
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
            // Push into mappedList
            mappedList.push({
              id: i.id,
              word: i.word,
              score: j[1],
              color: j[3],
              show: false
            });
          }
        });
      });
      play.words = mappedList;

      play.initGame();
    });

    // Socket #2 - Listen to other player's matched words
    socket.on('player matched word emit', (player, word, score) => {
      console.log(player, word);
      play.clearWord(word);
      if (player == this.opponent.name) this.opponent.score += score;
    });

    // Socket #3 - Listen to opponent left
    socket.on('opponent left', (msg) => {
      console.log(msg);
    });

  },
  methods: {
    initGame: function(e) {
      this.gameScreen = true;
      this.timerCount();
      this.player.name = Store.getUserName();
      this.opponent.name = Store.getOpponentName();

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
      var typedWord = this.player.typedWord.toLowerCase();
      var recognisedWord = this.recognisedWord.toLowerCase();

      // Submit Word Match Check
      this.words.forEach((i, el) => {
        var checkedWord = i.word.toLowerCase();
        if (typedWord == checkedWord || recognisedWord == checkedWord) {

          // update this player game state
          this.player.matchedWord = checkedWord;
          this.addScore(i.score);
          this.showScore(i.score);

          // remove from words array
          this.words.splice(el, 1);

          // Notify opponent
          socket.emit('player matched word', checkedWord, +i.score);
        }
      });

      this.player.typedWord = '';

      // End game if no more words
      if (this.words.length == 0) alert('No more words left! Round 2 begins!');
    },
    timerCount: function() {
      this.seconds--;
      if (this.seconds == 0) return alert('Times up! Thanks for playing.');
      setTimeout(function() {
        play.timerCount();
      }, 1000);
    },
    showScore: function(score) {
      this.player.wordScore = score;
      this.player.showScore = true;
      setTimeout(function() {
        play.player.showScore = false;
      }, 1000);
    },
    addScore: function(score) {
      var oldScore = this.player.score;
      var newScore = oldScore + score;
      var animationFrame;

      function animate(time) {
        TWEEN.update(time)
        animationFrame = requestAnimationFrame(animate)
      }
      new TWEEN.Tween({
          tweeningNumber: oldScore
        })
        .easing(TWEEN.Easing.Quadratic.Out)
        .to({
          tweeningNumber: newScore
        }, 500)
        .onUpdate(function() {
          play.player.score = +this.tweeningNumber.toFixed(0)
        })
        .onComplete(function() {
          cancelAnimationFrame(animationFrame)
        })
        .start();
      animationFrame = requestAnimationFrame(animate)
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
