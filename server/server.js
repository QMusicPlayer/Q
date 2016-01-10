var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var SC = require('node-soundcloud');
var db = require('./db/dbConfig');
var User = require('./db/userController');
var userModel = require('./db/userModel');

require('./routes.js')(app, express);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client/www'));

var port = process.env.PORT || 8000;
server.listen(port);

// This empties the database and seeds the database with one user with an empty queue (no multi-user functionality yet)
userModel.remove({}, function() {
  new userModel({
    //to check with Harun and Spener
    queue: []
  }).save(function(err) {
    if (err) console.error("error seeding database", err);
    else {
      console.log('saved new user');
    }
  });
});


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/test.html');
});

io.on('connection', function (socket) {
  User.getQueue(function(queue) {
    socket.emit('getQueue', queue);
  });

  socket.on('addSong', function (newSong) {
    User.addSong(newSong, function() {
      User.getQueue(function(queue) {
        socket.emit('getQueue', queue);
        socket.broadcast.emit('getQueue', queue);
      });
    });
  });
});