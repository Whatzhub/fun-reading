// instantiate new modal
var gameEndModal = new tingle.modal({
    footer: true,
    stickyFooter: false,
    closeLabel: "Close",
    cssClass: ['center'],
    onOpen: function() {
        console.log('scoreboard modal open');
    },
    onClose: function() {
        console.log('scoreboard modal closed');
    },
    beforeClose: function() {
        // here's goes some logic
        // e.g. save content before closing the modal
        // return true; // close the modal
    	return false; // nothing happens
    }
});

var gameEndModalContent = function(player, opponent) {
  var playerName = player.name || 'YOU';
  var playerScore = player.score;
  var playerRating = player.rating || 1600;
  var playerLvlZeroCount = player.lvlZeroCount;
  var playerLvlOneCount = player.lvlOneCount;
  var playerLvlTwoCount = player.lvlTwoCount;
  var playerIsWon = player.isWon;

  var opponentName = opponent.name || 'Opponent';
  var opponentScore = opponent.score;
  var opponentRating = opponent.rating || 1600;
  var opponentLvlZeroCount = opponent.lvlZeroCount;
  var opponentLvlOneCount = opponent.lvlOneCount;
  var opponentLvlTwoCount = opponent.lvlTwoCount;
  var opponentIsWon = opponent.isWon;

  var playerResult;
  var opponentResult;
  if (playerIsWon) {
    playerResult = 'Won';
    opponentResult = 'Lost';
  }
  else {
    playerResult = 'Lost';
    opponentResult = 'Won';
  }

  var a = `
  <h1>Scoreboard</h1>
  <table>
    <thead>
      <tr>
        <th><i class="fa fa-user-circle fa-2x"></i> ${playerName}</th>
        <th><i class="fa fa-user-circle fa-2x"></i> ${opponentName}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><i class="fa fa-star fa-2x"></i> ${playerScore} pts</td>
        <td><i class="fa fa-star fa-2x"></i> ${opponentScore} pts</td>
      </tr>
      <tr>
        <td>x Easy <i class="fa fa-square fa-2x limegreen"></i>: ${playerLvlZeroCount}</td>
        <td>x Easy <i class="fa fa-square fa-2x limegreen"></i>: ${opponentLvlZeroCount}</td>
      </tr>
      <tr>
        <td>x Med <i class="fa fa-square fa-2x chocolate"></i>: ${playerLvlOneCount}</td>
        <td>x Med <i class="fa fa-square fa-2x chocolate"></i>: ${opponentLvlOneCount}</td>
      </tr>
      <tr>
        <td>x Hard <i class="fa fa-square fa-2x indigo"></i>: ${playerLvlTwoCount}</td>
        <td>x Hard <i class="fa fa-square fa-2x indigo"></i>: ${opponentLvlTwoCount}</td>
      </tr>
      <tr>
        <td><h5>You ${playerResult}!</h5></td>
        <td><h5>You ${opponentResult}!</h5></td>
      </tr>
      <tr>
      <td><i class="fa fa-trophy fa-3x gold"></i> ${playerRating}</td>
      <td><i class="fa fa-trophy fa-3x gold"></i> ${opponentRating}</td>
      </tr>
    </tbody>
  </table>`;
  return a;
};

export {gameEndModal, gameEndModalContent};
