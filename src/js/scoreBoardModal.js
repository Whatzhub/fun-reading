import tingle from 'tingle.js';

// instanciate new modal
var scoreBoardModal = new tingle.modal({
    footer: true,
    stickyFooter: false,
    closeLabel: "Close",
    cssClass: ['custom-class-1', 'custom-class-2'],
    onOpen: function() {
        console.log('scoreboard modal open');
    },
    onClose: function() {
        console.log('scoreboard modal closed');
    },
    beforeClose: function() {
        // here's goes some logic
        // e.g. save content before closing the modal
        return true; // close the modal
    	return false; // nothing happens
    }
});

var scoreBoardModalContent = function(players) {
  var data = players;
  var a = `
  <h1 class="center">Top 25 Players</h1>
  <table class="center">
    <thead>
      <tr>
        <th>Players</th>
        <th>Rating</th>
      </tr>
    </thead>
    <tbody>
      ${data.map(p => {
        return `<tr>
          <td>${p.name}</td>
          <td>${p.rating}</td>
        </tr>`
      })}
    </tbody>
  </table>`;
  return a;
};

export {scoreBoardModal, scoreBoardModalContent};
