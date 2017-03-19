var WebSpeech = {};

WebSpeech.init = function() {
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
  var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

  if (!SpeechRecognition || SpeechRecognition == 'undefined') return console.log('Pls upgrade to a browser that supports Web Speech!');
  // var grammar = '#JSGF V1.0;';

  var recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 1;

  return recognition;
}

export default WebSpeech;
