var express = require('express');
var app = express();

app.use("/", express.static(__dirname + "/build"));

app.get('/page1', function(req, res){
  res.send('This is page 1');
});

app.get('/page2', function(req, res){
  res.send('This is page 2');
});

app.get('/page3', function(req, res){
  res.send('This is page 3');
});

app.get('/page4', function(req, res){
  res.send('This is page 4');
});

app.listen(3000);