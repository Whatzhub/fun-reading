// Declare external modules
import WebSpeech from './js/webSpeech';
import Store from './js/store';
import Modal from './js/modal';
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
    minutes: 0,
    seconds: 0,
    milliseconds: 72000,
    playerNo: 0
  },
  mounted: function() {
    console.log('Home screen loaded!');

    // set content
    Modal.setContent('<h1>here\'s some content</h1>');
    Modal.addFooterBtn('Button label', 'tingle-btn tingle-btn--primary', function() {
      Modal.close();
    });
    Modal.addFooterBtn('Dangerous action !', 'tingle-btn tingle-btn--danger', function() {
      Modal.close();
    });

    // Trigger play action
    socket.on('join msg', (userName, playerNo, roomName, opponentName) => {
      console.log(12, userName, playerNo, roomName);

      if (userName == this.name && playerNo == 1) {
        console.log(userName + ' is waiting for another player at ' + roomName);
        this.waitScreen = true;
        this.playerNo = 1;
        this.timerCount();
      } else {
        this.waitScreen = true;
        this.playerNo = 2;
      }
    });

    // Trigger playroom mode
    socket.on('play begin', (wordsList, playerTwo, playerOne) => {
      console.log(56, this.name, playerTwo, playerOne);
      if (this.name == playerOne) {
        Store.setOpponentName(playerTwo);
      }
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
    },
    timerCount: function() {
      this.milliseconds -= 1000;
      if (home.gameScreen || this.milliseconds == 0) return console.log('game start!');

      this.minutes = moment.duration(home.milliseconds).minutes();
      this.seconds = moment.duration(home.milliseconds).seconds();
      setTimeout(() => {
        home.timerCount();
      }, 1000);
    },
    openScoreboard: function() {
      Modal.open();
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
      lvlZeroCount: 0,
      lvlOneCount: 0,
      lvlTwoCount: 0
    },
    opponent: {
      name: '',
      score: 0,
      typedWord: '',
      matchedWord: '',
      lvlZeroCount: 0,
      lvlOneCount: 0,
      lvlTwoCount: 0
    },
    seconds: 30,
    isShake: false,
    gameScreen: false,
    rounds: {
      stage: 1, // 1 - 3
      class: 'round-one', // 'round-two', 'round-three'
      bgClass: 'round-one-bg', // 'round-two-bg', 'round-three-bg'
    },
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
    roundOne: function() {
      return this.words.slice(0, 5);
    },
    roundTwo: function() {
      return this.words.slice(0, 10);
    },
    roundThree: function() {
      return this.words.slice(0, 20);
    }
  },
  mounted: function() {
    console.log('Play screen mounted!');
    console.log(144, document.getElementsByTagName('body'));

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
              level: j[2],
              color: j[3]
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
      console.log(188, this.opponent.name);

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
          this.addScoreTiles(i.level);

          // remove from words array
          this.words.splice(el, 1);

          // Notify opponent
          socket.emit('player matched word', checkedWord, +i.score, +i.level);
        }
      });

      this.player.typedWord = '';

      // End game if no more words
      if (this.words.length == 0) console.log('No more words left! Game ends.');
    },
    timerCount: function() {
      this.seconds--;
      var bg = document.getElementsByTagName('body')[0].style;
      if (this.seconds == 20) {
        console.log('2nd round begins!');
        this.rounds.stage = 2;
        this.rounds.class = 'round-two';
        bg.backgroundColor = 'aliceblue';
      }
      if (this.seconds == 10) {
        console.log('Final round begins!');
        this.rounds.stage = 3;
        bg.backgroundColor = 'lightcyan';
      }
      if (this.seconds == 0) {
        bg.backgroundColor = '#DFDBE5';
        return console.log('Times up! Thanks for playing.');
      }
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
    addScoreTiles: function(scoreTile) {
      if (scoreTile == 0) this.player.lvlZeroCount++;
      if (scoreTile == 1) this.player.lvlOneCount++;
      if (scoreTile == 2) this.player.lvlTwoCount++;
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
