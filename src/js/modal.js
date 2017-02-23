// instanciate new modal
var Modal = new tingle.modal({
    footer: true,
    stickyFooter: false,
    closeLabel: "Close",
    cssClass: ['custom-class-1', 'custom-class-2'],
    onOpen: function() {
        console.log('modal open');
    },
    onClose: function() {
        console.log('modal closed');
    },
    beforeClose: function() {
        // here's goes some logic
        // e.g. save content before closing the modal
        return true; // close the modal
    	return false; // nothing happens
    }
});

var modalContent = `
<h1>Scoreboard</h1>
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Age</th>
      <th>Height</th>
      <th>Location</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Stephen Curry</td>
      <td>27</td>
      <td>1,91</td>
      <td>Akron, OH</td>
    </tr>
    <tr>
      <td>Klay Thompson</td>
      <td>25</td>
      <td>2,01</td>
      <td>Los Angeles, CA</td>
    </tr>
    <tr>
      <td>Klay Thompson</td>
      <td>25</td>
      <td>2,01</td>
      <td>Los Angeles, CA</td>
    </tr>
    <tr>
      <td>Klay Thompson</td>
      <td>25</td>
      <td>2,01</td>
      <td>Los Angeles, CA</td>
    </tr>
    <tr>
      <td>Klay Thompson</td>
      <td>25</td>
      <td>2,01</td>
      <td>Los Angeles, CA</td>
    </tr>
    <tr>
      <td>Klay Thompson</td>
      <td>25</td>
      <td>2,01</td>
      <td>Los Angeles, CA</td>
    </tr>
    <tr>
      <td>Klay Thompson</td>
      <td>25</td>
      <td>2,01</td>
      <td>Los Angeles, CA</td>
    </tr>
    <tr>
      <td>Klay Thompson</td>
      <td>25</td>
      <td>2,01</td>
      <td>Los Angeles, CA</td>
    </tr>
    <tr>
      <td>Klay Thompson</td>
      <td>25</td>
      <td>2,01</td>
      <td>Los Angeles, CA</td>
    </tr>
    <tr>
      <td>Klay Thompson</td>
      <td>25</td>
      <td>2,01</td>
      <td>Los Angeles, CA</td>
    </tr>
  </tbody>
</table>`;

export {Modal, modalContent};
