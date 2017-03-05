import tingle from 'tingle.js';

// instanciate new modal
var inputNameModal = new tingle.modal({
    footer: true,
    stickyFooter: false,
    closeLabel: "Close",
    cssClass: ['center'],
    onOpen: function() {
        console.log('inputName modal open');
    },
    onClose: function() {
        console.log('inputName modal closed');
    },
    beforeClose: function() {
        // here's goes some logic
        // e.g. save content before closing the modal
        return true; // close the modal
    	return false; // nothing happens
    }
});

var inputNameModalContent = function(msg) {
  var a = `<h4>${msg}</h4>`;
  return a;
}

export {inputNameModal, inputNameModalContent};
