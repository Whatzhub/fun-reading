import WebSpeech from './js/webSpeech';

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
  mounted: function() {
    console.log('Play screen mounted!');
    this.name = sessionStorage.getItem('name');

    axios.get(this.wordApi.url)
      .then((res) => {
        console.log(res);
        this.words = res.data;
      })
      .catch((err) => console.log(err));

    this.recognition = WebSpeech.init();
    this.recognition.start();
  },
  methods: {
    submitMsg: function(e) {
      // if (this.message == '') {
      //   this.isShake = true;
      //   setTimeout(() => this.isShake = false, 1000);
      //   return;
      // }
      // socket.emit('chat message', this.message);


      // NOTE: Placeholdercheck for input
      var wordMatched = this.words.forEach((i, el) => {
        if (this.message == i.word || this.recognisedWord == i.word) {
          // remove from words array
          this.words.splice(el, 1);
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

  socket.on('play msg', (words) => {
    console.log(15, words);
  });

  socket.on('chat message', function(msg, name) {
    console.log(20, msg, name);
    // var li = document.createElement('li');
    // li.innerHTML = name + ' said: ' + msg;
    // document.getElementById('messages').appendChild(li);
  });

  socket.on('user left', function(user) {
    console.log(27, user + ' has left');
    // var li = document.createElement('li');
    // li.innerHTML = user + ' has left...';
    // document.getElementById('messages').appendChild(li);
  });

  play.$mount('#play');

  play.recognition.onstart = function(ev) {
    console.log('Web speech recognition started...');
  }

  play.recognition.onresult = function(ev) {
    console.log('Web speech recognition result returned...');
    play.recognised = true;
    var lastIndex = ev.results.length - 1;
    var word = ev.results[lastIndex][0].transcript;
    console.log(89, word);
    play.recognisedWord = word;
    play.submitMsg();

  }

  play.recognition.onspeechend = function(ev) {
    console.log('Web speech recognition stopped...');
    play.recognised = false;
    play.recognisedWord = '';
    play.recognition.stop();
    setTimeout(function() {
      play.recognition.start();
    }, 1000);
  }

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
