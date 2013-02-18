var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var redis = require("redis"),
        rc = redis.createClient();
var catchPhrases = [];
rc.smembers("vine:link", function (err, replies) {
        console.log(replies.length + " replies:");
        catchPhrases = replies;
        rc.quit();
    });

app.set('view engine', 'jade');
app.set('view options', { layout: true });
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/static')); //why app.use('/static', express.static(__dirname + '/static'));?
console.log(__dirname + '/static');

app.get('/random', function(req, res, next) {
  res.render('video');
});

io.sockets.on('connection', function(socket) {
  var sendChat = function( title, link ) {
    socket.emit('chat', {
      title: title,
      link: link
    });
  };

  var randomIndex = Math.floor(Math.random()*catchPhrases.length)
  sendChat('current', catchPhrases[randomIndex]);
  socket.on('chat', function(data){
    var randomIndex = Math.floor(Math.random()*catchPhrases.length)
    sendChat('current', catchPhrases[randomIndex]);
  });
});

app.get('/?', function(req, res){
  res.render('index');
});

var port = 9000;
server.listen(port);
console.log('Listening on port ' + port);
