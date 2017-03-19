function Player() {
  this.name = '';
  this.rating = 1600;
  this.showScore = false;
  this.score = 0,
  this.wordScore = 0,
  this.typedWord = '',
  this.bonusWords = 0,
  this.bonusPercent = 0,
  this.lvlZeroCount = 0,
  this.lvlOneCount = 0,
  this.lvlTwoCount = 0,
  this.isLvlZeroTile = false,
  this.isLvlOneTile = false,
  this.isLvlTwoTile = false,
  this.isWon = false
  return this;
}

function Opponent() {
  this.name = '';
  this.rating = 1600;
  this.showScore = false;
  this.score = 0,
  this.wordScore = 0,
  this.typedWord = '',
  this.bonusWords = 0,
  this.bonusPercent = 0,
  this.lvlZeroCount = 0,
  this.lvlOneCount = 0,
  this.lvlTwoCount = 0,
  this.isLvlZeroTile = false,
  this.isLvlOneTile = false,
  this.isLvlTwoTile = false,
  this.isWon = false
  return this;
}

export {Player, Opponent};
