var Store = {
  state: {
    name: '',
    rank: 0
  },
  setName: function(val) {
    this.state.name = val;
  },
  getName: function() {
    return this.state.name;
  },
  setRank: function(val) {
    this.state.rank = val;
  },
  getRank: function() {
    return this.state.rank;
  }
};

export default Store;
