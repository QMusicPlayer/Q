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
console.log('listening on port...', port)
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


// io.configure(function () {  
// });

io.on('connection', function (socket) {
  // console.log(socket);

  // This line needed only for Heroku, comment it out if serving locally
  // io.set("transports", ["polling"]); 

  // User.getQueue(function(queue) {
  //   socket.emit('getQueue', queue);
  // });

  socket.on("join room", function(roomname){
    console.log(roomname);
    socket.join(roomname);
    io.to(roomname).emit('hello', roomname);

  });

  socket.on('newGuest', function() {
    User.getQueue(function(queue) {
      socket.emit('getQueue', queue);
    });
  });

  socket.on('addSong', function (newSong) {
    User.addSong(newSong, function() {
      socket.emit('newSong', newSong);
      socket.broadcast.emit('newSong', newSong);
      // User.getQueue(function(queue) {
      // });
    });
  });

  socket.on('deleteSong', function (target) {
    User.deleteSong(target.song, function() {
      socket.emit('deleteSong', target);
      socket.broadcast.emit('deleteSong', target);
    });
  });

  socket.on('progress', function (data) {
    console.log(data);
  });

  socket.on('currentlyPlaying', function (data) {
    socket.emit('currentlyPlaying', data);
    socket.broadcast.emit('currentlyPlaying', data);
  });

  socket.on('currentTrackPosition', function (data) {
    socket.emit('currentTrackPosition', data);
    socket.broadcast.emit('currentTrackPosition', data);
  });

  socket.on('currentTrackDuration', function (data) {
    socket.emit('currentTrackDuration', data);
    socket.broadcast.emit('currentTrackDuration', data);
  });

  socket.on('isPlaying', function (data) {
    socket.emit('isPlaying', data);
    socket.broadcast.emit('isPlaying', data);
  });
});
