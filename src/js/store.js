var Store = {
  state: {
    user: {
      name: '',
      rank: 0
    },
    opponent: {
      name: '',
      rank: ''
    }
  },
  setUserName: function(val) {
    this.state.user.name = val;
  },
  getUserName: function() {
    return this.state.user.name;
  },
  setUserRank: function(val) {
    this.state.user.rank = val;
  },
  getUserRank: function() {
    return this.state.user.rank;
  }
};

export default Store;
