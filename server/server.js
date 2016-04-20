var express = require('express');
var app = express();
var http = require('http')
var server = http.createServer(app);
var morgan = require('morgan');
var response = require('response');
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var SC = require('node-soundcloud');
var db = require('./db/dbConfig');
var User = require('./db/userController');
var Room = require('./db/roomController');
var userModel = require('./db/userModel');
var Sentencer = require('sentencer');
var roomFinder = require('./roomFinder');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
require('./routes.js')(app, express);
app.use(express.static(__dirname + '/../client/www'));



var port = process.env.PORT || 3000;
server.listen(port);
console.log('listening on port...', port)

io.on('connection', function (socket) {
  console.log('connected', socket.rooms)
  socket.on("create_room", function(roomName){
    socket.emit('enter_new_room', roomName);
    
    // io.sockets.in(roomName).emit('userCount', userCount);
    // var random_roomname = Sentencer.make("{{ adjective }} {{ noun }}");
    // User.addUser(socket.id, random_roomname, function(err,result){
    //   if(err){
    //     // console.log(err);
    //     // socket.emit('roomcreated', random_roomname);
    //     console.log('error adding user to db: ', err)
    //   } else {
    //     console.log('user addition/update success', result)
        
    //     socket.room = random_roomname;
    //   }

      //  else {
      //   var c = io.engine.clientsCount;
      //   User.updateRoomCount(random_roomname, 'add', function(err, userCount){
      //     console.log('create room room count', userCount)

  
      //     // console.log('room created on socket.rom:', socket.room)
      //     io.sockets.in(roomname).emit('userCount', userCount);
      //     io.sockets.in(roomname).emit('roomcreated', socket.room);

      //   });
      
      // }
    // });

    // Room.createRoom(random_roomname, socket.id, function(err, result){
    //   if (err) {
    //     console.log('error creating room in database:', err)
    //   } else {
    //     console.log('room creation successful', result);
    //     socket.emit('roomcreated', random_roomname);
    //   }
    // });


  });
  
  socket.on("join_room", function(roomName){
    console.log('joining room', roomName)
    socket.join(roomName);
    console.log('rooms', socket)
    console.log('attempting to get queue from room', roomName)
    Room.getQueue(roomName, function(err, queue) {
      if(err) {
        console.log('error getting queue', err);
      }
      console.log('got queue', queue.map(function(element){
        return element.title;
      }))
      io.to(socket.id).emit('getQueue', queue);
    });
      

    // console.log(roomName)
    // if(typeof roomname === 'object'){
    //   var host = roomname.q_host; 
    //   var roomname = roomname.q_room;  
    // }    

    // Room.getRoom(roomName, function(err, result){
    //   if(err){
    //     console.log(err)
    //   } else {
    //     console.log('found room from db: ', result)
    //     socket.join(result.name);
    //     io.to(socket.id).emit('roomjoined', result.name);
    //   }

    // })
    // console.log('id', socket.id);

    // User.getRoom(roomname, function(err, result){
    //   if(err || result === null){
    //     console.log(err, result);
    //     console.log("no room");
    //     socket.emit('roomjoined', null);
    //   } else {
    //     console.log(' socket room:', socket.room)
    //     socket.leave(socket.room);
    //     socket.join(roomname);
    //     socket.room = roomname;
    //     console.log(socket.room);
    //     console.log("room joined");
        
    //     //adding user count
    //     User.updateRoomCount(roomname, 'add', function(err, userCount){
    //       console.log('join room room count', userCount)
    //       io.sockets.in(roomname).emit('userCount', userCount);
    //     })

    //     //check if session continuation
    //     if (host === roomname) {
    //       io.to(socket.id).emit('roomjoined', socket.room, host);
    //     } else {
    //       io.to(socket.id).emit('roomjoined', socket.room);
          
    //     }

    //   }
    // });

  });

  socket.on('newGuest', function() {
    console.log("newGuest", socket.room);
    Room.getQueue(socket.room, function(err, queue) {
      socket.emit('getQueue', queue);
    });
  });

  socket.on('addSong', function (newSong) {
    console.log(socket.rooms)
    Room.addSong(roomFinder(socket), newSong, function() {
      // socket.emit('newSong', newSong);
      // socket.broadcast.emit('newSong', newSong);
      io.to(roomFinder(socket)).emit('newSong', newSong);
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

    console.log('disconnecting')
    User.updateRoomCount(socket.room, 'subtract', function(err, userCount){  
      console.log('disconnting socket', userCount);
      io.sockets.in(socket.room).emit('userCount', userCount);
      socket.leave(socket.room);
    });
      

  });


});
