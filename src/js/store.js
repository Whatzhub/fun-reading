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
        [1, 1], // {wordLength, wordScore}
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5],
        [6, 6],
        [7, 7],
        [8, 8],
        [9, 9],
        [10, 10],
        [11, 11],
        [12, 12],
        [13, 13],
        [14, 14],
        [15, 15],
        [16, 16]
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

  // Get API
  getUserName: function() {
    return this.state.user.name;
  },
  getUserRank: function() {
    return this.state.user.rank;
  },
  getWordsScoreMap: function() {
    return this.state.words.scoresMap;
  },
  getWordsApiUrl: function() {
    return this.state.words.apiUrl;
  }
};

export default Store;
