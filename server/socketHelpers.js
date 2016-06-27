var db = require('./db/dbConfig');
var User = require('./db/userController');
var Room = require('./db/roomController');
var userModel = require('./db/userModel');
var roomFinder = require('./roomFinder');

module.exports = function(io) {
	io.on('connection', function (socket) {
		//creates user in db
	  io.to(socket.id).emit('addUser');
	  // joins user to new room with an empty queue
	  socket.on("create_room", function(roomName){
	    socket.join(roomName)
	    io.to(socket.id).emit('getQueue', []);
	  });
	  // joins user to previously greated room and gets existing queue
	  socket.on("join_room", function(roomName){
	    console.log('joining room', roomName)
	    socket.join(roomName);
	    console.log('attempting to get queue from room', roomName)
	    Room.getQueue(roomName, function(err, queue) {
	      if(err) {
	        console.log('error getting queue', err);
	      }
	      console.log('got queue')
	      io.to(socket.id).emit('getQueue', queue);
	    });
	    io.to(roomName).emit('updateUserCount', null);
	  });

	  socket.on('leaveRoom', function(roomName) {
	  	socket.leave(roomName);
	  	io.to(roomName).emit('updateUserCount', null);
	  })

	  // adds song to room
	  socket.on('addSong', function (newSong) {
	    socket.broadcast.to(roomFinder(socket)).emit('newSong', newSong);
	  });

	  socket.on('castSkipVote', function(){
	  	io.to(socket.id).emit('updateSkipVotesInDb', null);
	  });

	  socket.on('votedToSkip', function(skipVote) {
	  	socket.broadcast.to(roomFinder(socket)).emit('updateSkipVote', skipVote);
	  })

	  socket.on('addSongToDb', function (newSong) {
	    Room.addSong(roomFinder(socket), newSong, function(queue) {
	      // io.to(roomFinder(socket)).emit('newSong', newSong);
	    });
	  });

	  socket.on('updateVotesToAllClients', function(songData) {
	      io.to(roomFinder(socket)).emit('newVotes', songData);
	  });

	  socket.on('votedForSong', function(songData) {
	    io.to(socket.id).emit('updateVotesInDb', songData);
	  });

	  socket.on('playedSong', function(){
	  	socket.broadcast.to(roomFinder(socket)).emit('playSong')
	  })

		socket.on('deleteSongFromDb', function(target) {
			console.log('in socket helpers', target)
			io.to(socket.id).emit('deleteSongFromQueue', target);
		})
	  socket.on('deleteSongsFromGuests', function (target) {
      socket.broadcast.to(roomFinder(socket)).emit('deleteSong', target);
	  });

	  socket.on('progress', function (data) {
	    console.log(data);
	  });

	  socket.on('currentlyPlayingToServer', function (data) {
	    // socket.emit('currentlyPlaying', data);
	    // socket.broadcast.emit('currentlyPlaying', data);
	    io.to(roomFinder(socket)).emit('currentlyPlaying', data);
	  });

	  socket.on('currentTrackPosition', function (data) {
	    // socket.emit('currentTrackPosition', data);
	    io.to(roomFinder(socket)).emit('currentTrackPosition', data);
	  });

	  socket.on('currentTrackDuration', function (data) {
	    // socket.emit('currentTrackDuration', data);
	    io.to(roomFinder(socket)).emit('currentTrackDuration', data);
	  });

	  socket.on('isPlaying', function (data) {
	    // socket.emit('isPlaying', data);
	     io.to(roomFinder(socket)).emit('isPlaying', data);
	  });

	  socket.on('disconnecting', function(){
	    console.log('disconnecting')
	    User.deleteUser(socket.id.split('/#')[1], function(userRoom) {
	    	io.to(userRoom.attributes.name).emit('updateUserCount');
	    })
	  });

	  socket.on('disconnect', function(){
	    console.log('disconnected')
	    
	  });
	});
}

