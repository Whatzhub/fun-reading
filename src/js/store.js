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
      scoresMap: [
        [1, 10], // {wordLength, wordScore}
        [2, 20],
        [3, 30],
        [4, 40],
        [5, 50],
        [6, 60],
        [7, 70],
        [8, 80],
        [9, 90],
        [10, 100],
        [11, 110],
        [12, 120],
        [13, 130],
        [14, 140],
        [15, 150],
        [16, 160]
      ]
    }
  },
  // Set API
  setUserName: function(val) {
    this.state.user.name = val;
  },
  setUserRank: function(val) {
    this.state.user.rank = val;
  },
  setOpponentName: function(val) {
    this.state.opponent.name = val;
  },

  // Get API
  getUserName: function() {
    return this.state.user.name;
  },
  getUserRank: function() {
    return this.state.user.rank;
  },
  getOpponentName: function() {
    return this.state.opponent.name;
  },
  getWordsScoreMap: function() {
    return this.state.words.scoresMap;
  },
  getWordsApiUrl: function() {
    return this.state.words.apiUrl;
  }
};

export default Store;
