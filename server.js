var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var redis = require("redis"),
        rc = redis.createClient();


app.set('view engine', 'jade');
app.set('view options', { layout: true });
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/static')); //why app.use('/static', express.static(__dirname + '/static'));?

var msgs = [];

io.sockets.on('connection', function(socket) {

  var sendChat = function(created_at, link, text ) {
    socket.emit('chat', {
      text : text,
      created_at : created_at,
      link : link
    });
  };
  
  var reloadVideos = function() {
    rc.zcard("vine:link:realtime", function (err, count) {
      rc.zrange("vine:link:realtime", count - 20, count - 1, function (err, replies) {
        for (var i = 0; i < replies.length - 1; i++) {
          
          rc.hvals(replies[i], function (err, replies2) {
            var msg = [];
            for (var j = 0; j < replies2.length; j++) {
              msg.push(replies2[j]);
            }
            msgs.push(msg);
            console.log(msgs.length);
            
          });
          
        }

        rc.hvals(replies[replies.length - 1], function (err, replies2) {
          var msg = [];
          for (var j = 0; j < replies2.length; j++) {
            msg.push(replies2[j]);
          }
          
          sendChat(msg[0], msg[1], msg[2]);
        });
      });
    });
  }
  
  reloadVideos();

  socket.on('chat', function(data){
  
      if (msgs.length != 0) {
        console.log(msgs.length);
          msg = msgs.pop()
          sendChat(msg[0], msg[1], msg[2]);
      } else {
        rc.zcard("vine:link:realtime", function (err, count) {
          rc.zrange("vine:link:realtime", count - 20, count - 1, function (err, replies) {
            for (var i = 0; i < replies.length - 1; i++) {
              
              rc.hvals(replies[i], function (err, replies2) {
                var msg = [];
                for (var j = 0; j < replies2.length; j++) {
                  msg.push(replies2[j]);
                }
                msgs.push(msg);
                console.log(msgs.length);
                
              });
              
            }

            rc.hvals(replies[replies.length - 1], function (err, replies2) {
              var msg = [];
              for (var j = 0; j < replies2.length; j++) {
                msg.push(replies2[j]);
              }
              
              sendChat(msg[0], msg[1], msg[2]);
            });
          });
        });
      }
  });
});

app.get('/random', function(req, res, next) {
  res.render('video');
});

app.get('/?', function(req, res){
  res.render('index');
});

var port = 80;
server.listen(port);
console.log('Listening on port ' + port);
