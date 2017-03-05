// Declare external modules
var socket = io('/');
import Vue from 'vue';
import moment from 'moment';
import TWEEN from 'tween.js';
import tingle from 'tingle.js';

import WebSpeech from './js/webSpeech';
import Store from './js/store';
import Elo from './js/elo';
import {scoreBoardModal, scoreBoardModalContent} from './js/scoreBoardModal';
import {gameEndModal,gameEndModalContent} from './js/gameEndModal';
import {inputNameModal, inputNameModalContent} from './js/inputNameModal';

// Declare home View
var home = new Vue({
  data: {
    // Players Data
    player: {
      name: '',
      rating: 1600,
      showScore: false
    },
    // Home Data
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
    // set scoreboard modal content
    scoreBoardModal.setContent(scoreBoardModalContent);

    // set input name modal content
    inputNameModal.setContent(inputNameModalContent('Yo, enter a name to play!'));
    inputNameModal.addFooterBtn('Got it', 'tingle-btn tingle-btn--primary', function() {
        inputNameModal.close();
      });

    // Trigger play action
    socket.on('join msg', (userName, playerNo, roomName, opponentName) => {
      console.log(12, userName, playerNo, roomName);

      if (userName == this.player.name && playerNo == 1) {
        console.log(userName + ' is waiting for another player at ' + roomName);
        this.waitScreen = true;
        this.playerNo = 1;
        this.timerCount();
      } else {
        this.waitScreen = true;
        this.playerNo = 2;
        this.timerCount();
      }
    });

    // Trigger playroom mode
    socket.on('play begin', (wordsList, playerTwo, playerOne) => {
      console.log(56, this.player.name, playerTwo, playerOne);
      if (this.player.name == playerOne) {
        Store.setOpponentName(playerTwo);
      } else Store.setOpponentName(playerOne);

      this.waitScreen = false;
      this.gameScreen = true;
    });
  },
  methods: {
    submitName: function(e) {
      if (this.player.name == '') {
        return inputNameModal.open();
      }
      socket.emit('join', this.player.name);
      // sessionStorage.setItem('name', this.name);
      Store.setUserName(this.player.name);
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
      scoreBoardModal.open();
    }
  }
});


var play = new Vue({
  data: {

    // Players Data
    player: {
      name: '',
      score: 0,
      rating: 1600,
      wordScore: 0,
      showScore: false,
      typedWord: '',
      bonusWords: 0,
      bonusPercent: 0,
      lvlZeroCount: 0,
      lvlOneCount: 0,
      lvlTwoCount: 0,
      isLvlZeroTile: false,
      isLvlOneTile: false,
      isLvlTwoTile: false,
      isWon: false
    },
    opponent: {
      name: '',
      score: 0,
      rating: 1800,
      wordScore: 0,
      showScore: false,
      typedWord: '',
      bonusWords: 0,
      bonusPercent: 0,
      lvlZeroCount: 0,
      lvlOneCount: 0,
      lvlTwoCount: 0,
      isLvlZeroTile: false,
      isLvlOneTile: false,
      isLvlTwoTile: false,
      isWon: false
    },

    // General Gameplay Data
    rounds: {
      stage: 1, // 1 - 3
      class: 'round-one', // 'round-two', 'round-three'
    },
    seconds: 60,
    isShake: false,
    gameScreen: false,
    wordApiUrl: Store.getWordsApiUrl(),
    words: [],

    // Web Speech API Data
    recognition: WebSpeech.init(),
    recognisedWord: '',
    speechResult: false,
    speechStopped: false,
    speechError: false
  },
  computed: {
    roundOne: function() {
      return this.words.slice(0, 10);
    },
    roundTwo: function() {
      return this.words.slice(0, 20);
    },
    roundThree: function() {
      return this.words.slice(0, this.words.length - 1);
    }
  },
  mounted: function() {
    console.log('Play screen mounted!');
    console.log(144, document.getElementsByTagName('body'));
    console.log(145, document.getElementsByTagName('body')[0].style.backgroundImage)

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
    socket.on('player matched word emit', (player, words, score, wordLvls, wordCount) => {
      console.log(player, words, score, wordLvls, wordCount);
      play.clearWord(words);
      if (player == this.opponent.name) {

        if (wordCount > 1) this.showStreak(wordCount, score, this.opponent);
        this.addScoreTiles(wordLvls, this.opponent);
        this.addScore(score, this.opponent);
        this.showScore(score, this.opponent);
      }
    });

    // Socket #3 - Listen to opponent left
    socket.on('opponent left', (msg) => {
      console.log(msg);
    });

    // Socket #4 - Listen to countdown timer
    socket.on('game timer', (time) => {
      console.log(time);
      this.seconds = time;
    });

    // Socket #5 - Listen to game end
    socket.on('game end', (msg) => {
      console.log(msg);
      this.endGame();
    });

  },
  methods: {
    initGame: function(e) {
      this.gameScreen = true;
      this.timerCount();
      this.player.name = Store.getUserName();
      this.opponent.name = Store.getOpponentName();
      console.log(188, this.opponent.name);

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

        if (!play.speechError || !play.speechStopped) {
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
        if (!play.speechStopped || !play.speechError) {
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
      var typedWordArr = typedWord.split(' ');
      console.log(245, typedWordArr);

      // local variables
      var recognisedWord = this.recognisedWord.toLowerCase();
      var cumulateScore = 0;
      var wordCount = 0;
      var matchedWords = [];
      var matchedLvls = [];

      // Submit Word Match Check
      var index = this.words.length;
      while (index--) {
        this.words.forEach((i, el) => {
          var checkedWord = i.word.toLowerCase();
          typedWordArr.forEach((j, el2) => {
            if (j == checkedWord || recognisedWord == checkedWord) {

              // store in arr for emit to other player
              matchedWords.push(checkedWord);
              matchedLvls.push(i.level);

              // update this player game state
              cumulateScore += i.score;
              wordCount++;

              // remove from words array
              this.words.splice(el, 1);
            }
          });
        });
      }

      this.player.typedWord = '';
      if (matchedWords.length == 0) return console.log(' no word matched!');

      // Enable Streak if word match for tile > multiples of 5
      var processedScore = cumulateScore;
      if (wordCount > 1) processedScore = this.showStreak(wordCount, cumulateScore, this.player);
      this.addScoreTiles(matchedLvls, this.player);
      this.addScore(processedScore, this.player);
      this.showScore(processedScore, this.player);

      // Notify opponent
      socket.emit('player matched word', matchedWords, processedScore, matchedLvls, wordCount);

      // End game if no more words
      if (this.words.length == 0) return this.endGame();
    },
    timerCount: function() {
      var bg = document.getElementsByTagName('body')[0].style;
      if (this.seconds == 20) {
        console.log('2nd round begins!');
        this.rounds.stage = 2;
        this.rounds.class = 'round-two';
        // bg.backgroundColor = 'aliceblue';
        bg.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;
      }
      if (this.seconds == 10) {
        console.log('Final round begins!');
        this.rounds.stage = 3;
        // bg.backgroundColor = 'lightcyan';
        bg.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='96' viewBox='0 0 60 96'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 10a6 6 0 0 1 12 0v12a6 6 0 0 1-6 6 6 6 0 0 0-6 6 6 6 0 0 1-12 0 6 6 0 0 0-6-6 6 6 0 0 1-6-6V10a6 6 0 1 1 12 0 6 6 0 0 0 12 0zm24 78a6 6 0 0 1-6-6 6 6 0 0 0-6-6 6 6 0 0 1-6-6V58a6 6 0 1 1 12 0 6 6 0 0 0 6 6v24zM0 88V64a6 6 0 0 0 6-6 6 6 0 0 1 12 0v12a6 6 0 0 1-6 6 6 6 0 0 0-6 6 6 6 0 0 1-6 6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;
      }
      if (this.seconds == 0) {
        bg.backgroundColor = '#DFDBE5';
      }
      setTimeout(function() {
        play.timerCount();
      }, 1000);
    },
    endGame: function() {
      console.log('endgame init..');

      // Determine end game results
      if (this.player.score > this.opponent.score) this.player.isWon = true;
      else this.opponent.isWon = true;

      // Calculate elo for 2 players
      var elo = Elo();
      var expectedA = elo.getExpected(this.player.rating, this.opponent.rating);
      var expectedB = elo.getExpected(this.opponent.rating, this.player.rating);
      this.player.rating = elo.updateRating(expectedA, this.player.isWon, this.player.rating);
      this.opponent.rating = elo.updateRating(expectedB, this.opponent.isWon, this.opponent.rating);

      // Setup game end scoreboard to 2 players
      gameEndModal.setContent(gameEndModalContent(this.player, this.opponent));
      gameEndModal.addFooterBtn('Back to Home', 'tingle-btn tingle-btn--primary', function() {
        location.href = '/';
        gameEndModal.close();
      });

      // Open Game end modal
      gameEndModal.open();

    },
    showStreak: function(count, score, thisPlayer) {
      setTimeout(() => {
        thisPlayer.bonusWords = 0;
      }, 1000);

      if (count == 2) {
        thisPlayer.bonusWords = 2;
        thisPlayer.bonusPercent = 20;
        return (+score * 1.2);
      }
      if (count == 3) {
        thisPlayer.bonusWords = 3;
        thisPlayer.bonusPercent = 30;
        return (+score * 1.3);
      }
      if (count == 4) {
        thisPlayer.bonusWords = 4;
        thisPlayer.bonusPercent = 40;
        return (+score * 1.4);
      }
      if (count > 4) {
        thisPlayer.bonusWords = 5;
        thisPlayer.bonusPercent = 50;
        return (+score * 1.5);
      }
    },
    showScore: function(score, thisPlayer) {
      thisPlayer.wordScore = score;
      thisPlayer.showScore = true;
      setTimeout(function() {
        thisPlayer.showScore = false;
      }, 1000);
    },
    addScore: function(score, thisPlayer) {
      var oldScore = thisPlayer.score;
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
          thisPlayer.score = +this.tweeningNumber.toFixed(0)
        })
        .onComplete(function() {
          cancelAnimationFrame(animationFrame)
        })
        .start();
      animationFrame = requestAnimationFrame(animate)
    },
    addScoreTiles: function(wordLvls, thisPlayer) {
      wordLvls.forEach((i, el) => {
        if (i == 0) {
          thisPlayer.lvlZeroCount++;
          thisPlayer.isLvlZeroTile = true;
          setTimeout(() => {
            thisPlayer.isLvlZeroTile = false;
          }, 1000);
        }
        if (i == 1) {
          thisPlayer.lvlOneCount++;
          thisPlayer.isLvlOneTile = true;
          setTimeout(() => {
            thisPlayer.isLvlOneTile = false;
          }, 1000);
        }
        if (i == 2) {
          thisPlayer.lvlTwoCount++;
          thisPlayer.isLvlTwoTile = true;
          setTimeout(() => {
            thisPlayer.isLvlTwoTile = false;
          }, 1000);
        }
      });
    },
    clearWord: function(returnedWords) {
      returnedWords.forEach((i, el) => {
        var a = i.toLowerCase();
        this.words.forEach((j, el2) => {
          var b = j.word.toLowerCase();
          if (a == b) {
            this.words.splice(el2, 1);
          }
        });
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
