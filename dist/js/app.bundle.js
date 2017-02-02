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

	__webpack_require__(1);
	__webpack_require__(4);
	module.exports = __webpack_require__(5);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ripple = __webpack_require__(2);

	var _store = __webpack_require__(3);

	var _store2 = _interopRequireDefault(_store);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _ref;

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var circle1 = new mojs.Shape({
	  fill: 'none',
	  radius: 25,
	  strokeWidth: { 50: 0 },
	  scale: { 0: 1 },
	  angle: { 'rand(-35, -70)': 0 },
	  duration: 500,
	  left: 0, top: 0,
	  easing: 'cubic.out',
	  // unique props
	  stroke: 'cyan'
	});

	var circle2 = new mojs.Shape((_ref = {
	  fill: 'none',
	  radius: 25,
	  strokeWidth: { 50: 0 },
	  scale: { 0: 1 },
	  angle: { 'rand(-35, -70)': 0 },
	  duration: 500,
	  left: 0, top: 0,
	  easing: 'cubic.out'
	}, _defineProperty(_ref, 'radius', { 0: 15 }), _defineProperty(_ref, 'strokeWidth', { 30: 0 }), _defineProperty(_ref, 'stroke', 'magenta'), _defineProperty(_ref, 'delay', 'rand(75, 150)'), _ref));

	exports.circle1 = circle1;
	exports.circle2 = circle2;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Store = {
	  state: {
	    name: '',
	    rank: 0
	  },
	  setName: function setName(val) {
	    this.state.name = val;
	  },
	  getName: function getName() {
	    return this.state.name;
	  },
	  setRank: function setRank(val) {
	    this.state.rank = val;
	  },
	  getRank: function getRank() {
	    return this.state.rank;
	  }
	};

	exports.default = Store;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

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
	  mounted: function mounted() {
	    console.log('Home screen loaded!');
	  },
	  methods: {
	    submitName: function submitName(e) {
	      var _this = this;

	      if (this.name == '') {
	        this.isShake = true;
	        setTimeout(function () {
	          return _this.isShake = false;
	        }, 1000);
	        return;
	      }
	      socket.emit('join', this.name);
	      sessionStorage.setItem('name', this.name);
	      this.name = '';
	      // location.href = location.href + 'play';
	    },
	    timerCount: function timerCount() {
	      this.seconds--;
	      if (this.seconds == 0) return console.log('game start!');
	      setTimeout(function () {
	        home.timerCount();
	      }, 1000);
	    }
	  }
	});

	if (document.getElementById('home') != null) {
	  console.log('Home screen is present');
	  home.$mount('#home');

	  var socket = io('/');

	  socket.on('join msg', function (name, count) {
	    console.log(12, name, count);
	    if (count == 1) {
	      console.log(name + ' is waiting for another player..');
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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _webSpeech = __webpack_require__(6);

	var _webSpeech2 = _interopRequireDefault(_webSpeech);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var play = new Vue({
	  data: {
	    currentUser: '',
	    name: '',
	    message: '',
	    isShake: false,
	    recognition: {},
	    recognised: false,
	    recognisedWord: '',
	    wordApi: {
	      url: 'http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=10&limit=' + 10 + '&api_key=' + 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
	    },
	    words: []
	  },
	  mounted: function mounted() {
	    var _this = this;

	    console.log('Play screen mounted!');
	    this.name = sessionStorage.getItem('name');

	    axios.get(this.wordApi.url).then(function (res) {
	      console.log(res);
	      _this.words = res.data;
	    }).catch(function (err) {
	      return console.log(err);
	    });

	    this.recognition = _webSpeech2.default.init();
	    this.recognition.start();
	  },
	  methods: {
	    submitMsg: function submitMsg(e) {
	      var _this2 = this;

	      // if (this.message == '') {
	      //   this.isShake = true;
	      //   setTimeout(() => this.isShake = false, 1000);
	      //   return;
	      // }
	      // socket.emit('chat message', this.message);


	      // NOTE: Placeholdercheck for input
	      var wordMatched = this.words.forEach(function (i, el) {
	        if (_this2.message == i.word || _this2.recognisedWord == i.word) {
	          // remove from words array
	          _this2.words.splice(el, 1);
	        }
	      });

	      // TODO: Replace with Web Speech API

	      this.message = '';
	    }
	  }
	});

	if (document.getElementById('play') != null) {
	  console.log('Play screen is present');

	  var socket = io('/playroom');

	  socket.on('play msg', function (words) {
	    console.log(15, words);
	  });

	  socket.on('chat message', function (msg, name) {
	    console.log(20, msg, name);
	    // var li = document.createElement('li');
	    // li.innerHTML = name + ' said: ' + msg;
	    // document.getElementById('messages').appendChild(li);
	  });

	  socket.on('user left', function (user) {
	    console.log(27, user + ' has left');
	    // var li = document.createElement('li');
	    // li.innerHTML = user + ' has left...';
	    // document.getElementById('messages').appendChild(li);
	  });

	  play.$mount('#play');

	  play.recognition.onstart = function (ev) {
	    console.log('Web speech recognition started...');
	  };

	  play.recognition.onresult = function (ev) {
	    console.log('Web speech recognition result returned...');
	    play.recognised = true;
	    var lastIndex = ev.results.length - 1;
	    var word = ev.results[lastIndex][0].transcript;
	    console.log(89, word);
	    play.recognisedWord = word;
	    play.submitMsg();
	  };

	  play.recognition.onspeechend = function (ev) {
	    console.log('Web speech recognition stopped...');
	    play.recognised = false;
	    play.recognisedWord = '';
	    play.recognition.stop();
	    setTimeout(function () {
	      play.recognition.start();
	    }, 1000);
	  };

	  // recognition.onerror = function(e) {
	  //   console.log('Web speech recognition result error...');
	  //   console.log(e);
	  // }
	  //
	  // recognition.onend = function(ev) {
	  //   console.log('Web speech recognition ended...');
	  //   console.log(ev);
	  // }
	}

/***/ },
/* 6 */
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

/***/ }
/******/ ]);