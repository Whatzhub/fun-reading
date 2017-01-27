var fs = require('fs');
var http = require('http');

var Helpers = {};

Helpers.getFileNames = function(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, fileNames) => {
      resolve(fileNames);
    })
  })
}

Helpers.read = function(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, content) => {
      resolve(content);
    })
  })
}

Helpers.writeFile = function(path, text) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, text, 'utf8', err => {
      if (err) reject(err);
      resolve();
    });
  })
}

Helpers.appendFile = function(path, text) {
  return new Promise((resolve, reject) => {
    fs.appendFile(path, text, 'utf8', err => {
      if (err) reject(err);
      resolve();
    })
  })
}

Helpers.download = function(url) {
  return new Promise((resolve, reject) => {
    http.get(url, function(response) {
        response.setEncoding('utf8');
        var data = '';
        response.on('data', function(chunk) {
          data += chunk;
        })
        response.on('end', function() {
          resolve(data);
        })
      })
      .on('error', function(err) {
        reject(err);
      })

  })
}

Helpers.downloadWithHeaders = function(host, url) {
  var options = {
    host: host,
    path: url,
    headers: {
      connection: 'keep-alive',
      'User-Agent': 'Mozilla/5.0',
    }
  };

  return new Promise((resolve, reject) => {
    http.get(options, function(res) {
      res.setEncoding('utf8');
      var data = '';
      res.on('data', function(chunk) {
        data += chunk;
      })
      res.on('end', function() {
          resolve(data);
        })
        .on('error', function(err) {
          reject(err);
        })
    });
  })
}

Helpers.sleep = function(millSec) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, millSec);
  })
}

Helpers.log = function() {
  console.log.apply(console, arguments);
}

Helpers.getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = Helpers;
