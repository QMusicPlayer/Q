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

var port = process.env.PORT || 3000;
server.listen(port);
console.log('listening on port...', port)
// This empties the database and seeds the database with one user with an empty queue (no multi-user functionality yet)

io.on('connection', function (socket) {
  // console.log(socket);

  // This line needed only for Heroku, comment it out if serving locally
  // io.set("transports", ["polling"]); 

  // User.getQueue(function(queue) {
  //   socket.emit('getQueue', queue);
  // });

  socket.on("create room", function(roomname){
    // console.log(roomname);
    User.addUser(roomname, function(err,result){
      if(err){
        // console.log(err);
        socket.emit('roomcreated', null);
      } else {
        // -----
        var c = io.engine.clientsCount;
        User.updateRoomCount(roomname, 'add', function(err, userCount){
          console.log('creat room room count', userCount)

          socket.join(roomname);
          socket.room = roomname;
          // console.log('room created on socket.rom:', socket.room)
          io.sockets.in(roomname).emit('userCount', userCount);
          io.sockets.in(roomname).emit('roomcreated', socket.room);

        });
      
      }
    });

  });
  socket.on("join room", function(roomname){
    if(typeof roomname === 'object'){
      var host = roomname.q_host; 
      var roomname = roomname.q_room;  
    } 

    console.log('roomname for joing room', roomname);
    // console.log('id', socket.id);

    User.getRoom(roomname, function(err, result){
      if(err || result === null){
        console.log(err, result);
        console.log("no room");
        socket.emit('roomjoined', null);
      } else {
        console.log(' socket room:', socket.room)
        socket.leave(socket.room);
        socket.join(roomname);
        socket.room = roomname;
        console.log(socket.room);
        console.log("room joined");
        
        //adding user count
        User.updateRoomCount(roomname, 'add', function(err, userCount){
          console.log('join room room count', userCount)
          io.sockets.in(roomname).emit('userCount', userCount);
        })

        //check if session continuation
        if (host === roomname) {
          io.to(socket.id).emit('roomjoined', socket.room, host);
        } else {
          io.to(socket.id).emit('roomjoined', socket.room);
          
        }

      }
    });

  });

  socket.on('newGuest', function() {
    console.log("newGuest", socket.room);
    User.getQueue(socket.room, function(err, queue) {
      socket.emit('getQueue', queue);
      console.log(queue);
    });
  });

  socket.on('addSong', function (newSong) {
    console.log('addsong: socket room', socket.room)
    User.addSong(socket.room, newSong, function() {

      // socket.emit('newSong', newSong);
      // socket.broadcast.emit('newSong', newSong);
      io.to(socket.room).emit('newSong', newSong);
      // User.getQueue(function(queue) {
      // });
    });
  });

  socket.on('updateVotes', function(songData) {
    User.updateVotes(socket.room, songData, function() {
      io.to(socket.room).emit('newVotes', songData);
    });
  });

  socket.on('deleteSong', function (target, roomname) {

    User.deleteSong(socket.room, target.song, function() {
      io.to(socket.room).emit('deleteSong', target);
    });
  });

  socket.on('progress', function (data) {
    console.log(data);
  });

  socket.on('currentlyPlaying', function (data) {
    // socket.emit('currentlyPlaying', data);
    // socket.broadcast.emit('currentlyPlaying', data);
    io.to(socket.room).emit('currentlyPlaying', data);
  });

  socket.on('currentTrackPosition', function (data) {
    // socket.emit('currentTrackPosition', data);
    io.to(socket.room).emit('currentTrackPosition', data);
  });

  socket.on('currentTrackDuration', function (data) {
    // socket.emit('currentTrackDuration', data);
    io.to(socket.room).emit('currentTrackDuration', data);
  });

  socket.on('isPlaying', function (data) {
    // socket.emit('isPlaying', data);
     io.to(socket.room).emit('isPlaying', data);
  });

  socket.on('disconnect', function(){
    
    User.updateRoomCount(socket.room, 'subtract', function(err, userCount){  
      console.log('disconnting socket', userCount);
      io.sockets.in(socket.room).emit('userCount', userCount);
      socket.leave(socket.room);
    });
    

  });


});
