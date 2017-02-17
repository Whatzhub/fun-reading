/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _webSpeech = __webpack_require__(2);

	var _webSpeech2 = _interopRequireDefault(_webSpeech);

	var _store = __webpack_require__(3);

	var _store2 = _interopRequireDefault(_store);

	var _modal = __webpack_require__(4);

	var _modal2 = _interopRequireDefault(_modal);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var socket = io('/');

	// Declare home View
	// Declare external modules
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
	  mounted: function mounted() {
	    var _this = this;

	    console.log('Home screen loaded!');

	    // set content
	    _modal2.default.setContent('<h1>here\'s some content</h1>');
	    _modal2.default.addFooterBtn('Button label', 'tingle-btn tingle-btn--primary', function () {
	      _modal2.default.close();
	    });
	    _modal2.default.addFooterBtn('Dangerous action !', 'tingle-btn tingle-btn--danger', function () {
	      _modal2.default.close();
	    });

	    // Trigger play action
	    socket.on('join msg', function (userName, playerNo, roomName, opponentName) {
	      console.log(12, userName, playerNo, roomName);

	      if (userName == _this.name && playerNo == 1) {
	        console.log(userName + ' is waiting for another player at ' + roomName);
	        _this.waitScreen = true;
	        _this.playerNo = 1;
	        _this.timerCount();
	      } else {
	        _this.waitScreen = true;
	        _this.playerNo = 2;
	      }
	    });

	    // Trigger playroom mode
	    socket.on('play begin', function (wordsList, playerTwo, playerOne) {
	      console.log(56, _this.name, playerTwo, playerOne);
	      if (_this.name == playerOne) {
	        _store2.default.setOpponentName(playerTwo);
	      } else _store2.default.setOpponentName(playerOne);

	      _this.waitScreen = false;
	      _this.gameScreen = true;
	    });
	  },
	  methods: {
	    submitName: function submitName(e) {
	      var _this2 = this;

	      if (this.name == '') {
	        this.isShake = true;
	        setTimeout(function () {
	          return _this2.isShake = false;
	        }, 1000);
	        return;
	      }
	      socket.emit('join', this.name);
	      // sessionStorage.setItem('name', this.name);
	      _store2.default.setUserName(this.name);
	    },
	    timerCount: function timerCount() {
	      this.milliseconds -= 1000;
	      if (home.gameScreen || this.milliseconds == 0) return console.log('game start!');

	      this.minutes = moment.duration(home.milliseconds).minutes();
	      this.seconds = moment.duration(home.milliseconds).seconds();
	      setTimeout(function () {
	        home.timerCount();
	      }, 1000);
	    },
	    openScoreboard: function openScoreboard() {
	      _modal2.default.open();
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
	      bgClass: 'round-one-bg' },
	    wordApiUrl: _store2.default.getWordsApiUrl(),
	    words: [],
	    // Web Speech API Data
	    recognition: {},
	    recognisedWord: '',
	    speechResult: false,
	    speechStopped: false,
	    speechError: false
	  },
	  computed: {
	    roundOne: function roundOne() {
	      return this.words.slice(0, 5);
	    },
	    roundTwo: function roundTwo() {
	      return this.words.slice(0, 10);
	    },
	    roundThree: function roundThree() {
	      return this.words.slice(0, 20);
	    }
	  },
	  mounted: function mounted() {
	    var _this3 = this;

	    console.log('Play screen mounted!');
	    console.log(144, document.getElementsByTagName('body'));

	    // Socket #1 - Trigger playroom mode
	    socket.on('play begin', function (words) {
	      console.log(JSON.parse(words));
	      var data = JSON.parse(words);
	      var scoreMap = _store2.default.getWordsScoreMap();
	      console.log(97, data);

	      var mappedList = [];
	      data.forEach(function (i, el) {
	        var wordLen = i.word.length;
	        scoreMap.forEach(function (j, el2) {
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
	    socket.on('player matched word emit', function (player, word, score) {
	      console.log(player, word);
	      play.clearWord(word);
	      if (player == _this3.opponent.name) _this3.opponent.score += score;
	    });

	    // Socket #3 - Listen to opponent left
	    socket.on('opponent left', function (msg) {
	      console.log(msg);
	    });
	  },
	  methods: {
	    initGame: function initGame(e) {
	      this.gameScreen = true;
	      this.timerCount();
	      this.player.name = _store2.default.getUserName();
	      this.opponent.name = _store2.default.getOpponentName();
	      console.log(188, this.opponent.name);

	      this.recognition = _webSpeech2.default.init();
	      this.recognition.start();

	      this.recognition.onresult = function (ev) {
	        play.speechResult = true;
	        console.log('Web speech recognition result returned...');
	        var lastIndex = ev.results.length - 1;
	        var word = ev.results[lastIndex][0].transcript;
	        play.recognisedWord = word;
	        play.submitMsg();
	      };

	      this.recognition.onspeechend = function (ev) {
	        play.speechResult = false;
	        play.speechStopped = true;
	        console.log('Web speech recognition stopped...');
	        play.recognisedWord = '';
	        play.recognition.stop();

	        if (!play.speechError) {
	          setTimeout(function () {
	            play.recognition.start();
	            play.speechStopped = false;
	          }, 500);
	        }
	      };

	      this.recognition.onerror = function (e) {
	        play.speechError = true;
	        console.log('Web speech recognition result error...');
	        console.log(e);
	        if (!play.speechStopped) {
	          setTimeout(function () {
	            play.recognition.start();
	            play.speechError = false;
	          }, 500);
	        }
	      };
	    },
	    submitMsg: function submitMsg(e) {
	      var _this4 = this;

	      // NOTE: Including typed input for testing
	      var typedWord = this.player.typedWord.toLowerCase();
	      var recognisedWord = this.recognisedWord.toLowerCase();

	      // Submit Word Match Check
	      this.words.forEach(function (i, el) {
	        var checkedWord = i.word.toLowerCase();
	        if (typedWord == checkedWord || recognisedWord == checkedWord) {

	          // update this player game state
	          _this4.player.matchedWord = checkedWord;
	          _this4.addScore(i.score);
	          _this4.showScore(i.score);
	          _this4.addScoreTiles(i.level);

	          // remove from words array
	          _this4.words.splice(el, 1);

	          // Notify opponent
	          socket.emit('player matched word', checkedWord, +i.score, +i.level);
	        }
	      });

	      this.player.typedWord = '';

	      // End game if no more words
	      if (this.words.length == 0) console.log('No more words left! Game ends.');
	    },
	    timerCount: function timerCount() {
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
	      setTimeout(function () {
	        play.timerCount();
	      }, 1000);
	    },
	    showScore: function showScore(score) {
	      this.player.wordScore = score;
	      this.player.showScore = true;
	      setTimeout(function () {
	        play.player.showScore = false;
	      }, 1000);
	    },
	    addScore: function addScore(score) {
	      var oldScore = this.player.score;
	      var newScore = oldScore + score;
	      var animationFrame;

	      function animate(time) {
	        TWEEN.update(time);
	        animationFrame = requestAnimationFrame(animate);
	      }
	      new TWEEN.Tween({
	        tweeningNumber: oldScore
	      }).easing(TWEEN.Easing.Quadratic.Out).to({
	        tweeningNumber: newScore
	      }, 500).onUpdate(function () {
	        play.player.score = +this.tweeningNumber.toFixed(0);
	      }).onComplete(function () {
	        cancelAnimationFrame(animationFrame);
	      }).start();
	      animationFrame = requestAnimationFrame(animate);
	    },
	    addScoreTiles: function addScoreTiles(scoreTile) {
	      if (scoreTile == 0) this.player.lvlZeroCount++;
	      if (scoreTile == 1) this.player.lvlOneCount++;
	      if (scoreTile == 2) this.player.lvlTwoCount++;
	    },
	    clearWord: function clearWord(returnedWord) {
	      var _this5 = this;

	      var clear = returnedWord.toLowerCase();

	      this.words.forEach(function (i, el) {
	        var check = i.word.toLowerCase();
	        if (clear == check) {
	          _this5.words.splice(el, 1);
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

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var WebSpeech = {};

	WebSpeech.init = function () {
	  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
	  var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
	  var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

	  if (!SpeechRecognition) return alert('Pls upgrade to a browser that supports Web Speech!');
	  // var grammar = '#JSGF V1.0;';

	  var recognition = new SpeechRecognition();
	  recognition.continuous = false;
	  recognition.interimResults = true;
	  recognition.lang = 'en-US';
	  recognition.maxAlternatives = 1;

	  return recognition;
	};

	exports.default = WebSpeech;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Store = {
	  state: {
	    user: {
	      name: '',
	      rank: 0
	    },
	    opponent: {
	      name: '',
	      rank: ''
	    },
	    words: {
	      apiUrl: 'http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&minCorpusCount=' + 1000000 + '&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=16&limit=' + 10 + '&api_key=' + 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
	      scoresMap: [[1, 10, 0, "limegreen"], // {wordLength, wordScore, level, wordColor}
	      [2, 20, 0, "limegreen"], [3, 30, 0, "limegreen"], [4, 40, 0, "limegreen"], [5, 50, 0, "limegreen"], [6, 60, 0, "limegreen"], [7, 70, 1, "chocolate"], [8, 80, 1, "chocolate"], [9, 90, 1, "chocolate"], [10, 100, 1, "chocolate"], [11, 110, 1, "chocolate"], [12, 120, 2, "indigo"], [13, 130, 2, "indigo"], [14, 140, 2, "indigo"], [15, 150, 2, "indigo"], [16, 160, 2, "indigo"]]
	    }
	  },
	  // Set API
	  setUserName: function setUserName(val) {
	    this.state.user.name = val;
	  },
	  setUserRank: function setUserRank(val) {
	    this.state.user.rank = val;
	  },
	  setOpponentName: function setOpponentName(val) {
	    this.state.opponent.name = val;
	  },

	  // Get API
	  getUserName: function getUserName() {
	    return this.state.user.name;
	  },
	  getUserRank: function getUserRank() {
	    return this.state.user.rank;
	  },
	  getOpponentName: function getOpponentName() {
	    return this.state.opponent.name;
	  },
	  getWordsScoreMap: function getWordsScoreMap() {
	    return this.state.words.scoresMap;
	  },
	  getWordsApiUrl: function getWordsApiUrl() {
	    return this.state.words.apiUrl;
	  }
	};

	exports.default = Store;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	// instanciate new modal
	var Modal = new tingle.modal({
	    footer: true,
	    stickyFooter: false,
	    closeLabel: "Close",
	    cssClass: ['custom-class-1', 'custom-class-2'],
	    onOpen: function onOpen() {
	        console.log('modal open');
	    },
	    onClose: function onClose() {
	        console.log('modal closed');
	    },
	    beforeClose: function beforeClose() {
	        // here's goes some logic
	        // e.g. save content before closing the modal
	        return true; // close the modal
	        return false; // nothing happens
	    }
	});

	exports.default = Modal;

/***/ }
/******/ ]);