const dataSource = {
  message: 'Send'
};

console.log('store js loaded');

var socket = io();

var app = new Vue({
  el: '#test',
  data: dataSource
});
