var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var redis = require("redis"),
  rc = redis.createClient();

app.set('view engine', 'jade');
app.set('view options', {
  layout: true
});
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/static')); //why app.use('/static', express.static(__dirname + '/static'));?

var msgs = [];

var sendChat = function(socket, json) {
 
  var obj = JSON.parse(json);
  //console.log(obj);
  socket.emit('chat', obj);
};

var reloadVideos = function(socket) {
  rc.zcard('vine:link:realtime', function(err, count) {
    rc.zrange('vine:link:realtime', count - 20, count - 1, function(err, replies) {
      for (var i = 0; i < replies.length - 1; i++) {

        rc.get(replies[i], function(err, replies2) {
          msgs.push(replies2);
          console.log(msgs.length);
        });
      }

      rc.get(replies[replies.length - 1], function(err, replies2) {
        sendChat(socket, replies2);
      });
    });
  });
}

io.sockets.on('connection', function(socket) {

  reloadVideos(socket);

  socket.on('chat', function(data) {

    if (msgs.length != 0) {
      console.log(msgs.length);
      msg = msgs.pop()
      sendChat(socket, msg);
    } else {
      reloadVideos(socket);
    }
  });
});

app.get('/random', function(req, res, next) {
  res.render('index');
});

app.get('/?', function(req, res) {
  res.render('index');
});

var port = 9000;
server.listen(port);
console.log('Listening on port ' + port);
