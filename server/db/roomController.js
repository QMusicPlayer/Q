var mongoose = require('mongoose');
var Room = require('./roomModel');
var Sentencer = require('sentencer');

module.exports = {
  createRoom: function(req, res, next) {

    var random_roomname = Sentencer.make("{{ adjective }} {{ noun }}");
    console.log('attempting to create room: ', random_roomname)
    var newRoom = new Room({
      name: random_roomname,
      host: req.body.host,
      userCount: 1,
      guests: [],
      queue: []
    });
    newRoom.save().then(function(){
      console.log('successfully created room', newRoom)
      res.json(newRoom);
    })
    .catch(function(error) {
      next(error)
    })
  },

  joinRoom: function(req, res, next){
    console.log("finding room", req.body.roomName);
    Room.findOne({name:req.body.roomName}).then(function(room){
      if(room) {
        console.log('successfully joined room');
        room.guests.push(req.body.socketId);
        res.json('successfully joined room');
      } else {
        res.json('room does not exist');
      }
    }).catch(function(error){
      next(error);
    });
        
  },

  addSong: function(room, data, callback) {
    console.log("addSong, room:", room);
    delete data['$$hashKey'];
    Room.findOne({name: room}, function(err, result) {
      console.log("addSong", result);
      if(!result) return;
      var alreadyAdded = false;
      result.queue.forEach(function(song) {
        if (data.id === song.id) {
          alreadyAdded = true;
        }
      });
      if (!alreadyAdded) {
        result.queue.push(data);
        result.save(function(err) {
          console.error(err);
          callback();
        });
      } else {
        return;
      }
    });
  },
  getQueue: function(room, callback) {
    console.log('getQueue', room);
    Room.findOne({name: room}, function(err, result) {
      if(!result) return;
      console.log(result);
      callback(err, result.queue);
    });
  },

  // saveQueue: function(room, updatedQueue, callback) {
  //   updatedQueue = updatedQueue.map(function(song) {
  //     delete song['$$hashKey'];
  //     return song;
  //   });
  //   User.findOne({hash: room}, function(err, result) {
  //     console.log("saveQueue", result);

  //     if(!result){
  //     }
  //     console.log(updatedQueue)
  //     result.queue = updatedQueue;
  //     result.save(function(err) {
  //       console.error(err);
  //       callback();
  //     });
  //   });
  // },

  

  // updateVotes: function(room, data, callback) {
  //   console.log('update votes in userController');
  //   User.update({'hash': room, 'queue.id': data.id}, {'queue.$.votes': data.votes}, callback);
  //   // User.findOne({hash: room}, function(err, user) {
  //   //   if (!user) return;
  //   //   for (var i = 0; i < user.queue.length; i++) {
  //   //     if (user.queue[i].id === data.id) {
  //   //       console.log('match found' + user.queue[i].title);
  //   //       user.queue[i].votes = data.votes;
  //   //       console.log(user.queue[i].votes);
  //   //       user.save(function(err) {
  //   //         console.error(err);
  //   //         callback();
  //   //         if (!err) {
  //   //           console.log('alegadly saved votes')
  //   //         }
  //   //       });
  //   //     }
  //   //   }
      
  //   // });
  // },

  // deleteSong: function(room, target, callback) {
  //   User.findOne({hash: room}, function(err, result) {
  //     if(!result) return;

  //     console.log(target);
  //     var deleteLocations = [];
  //     result.queue.forEach(function(song, index) {
  //       console.log('deleting', song)
  //       if (song.id === target) {
  //         deleteLocations.push(index);
  //       }
  //     });
  //     deleteLocations.forEach(function(deleteLocation) {
  //       result.queue.splice(deleteLocation, 1);
  //       result.save(function(err) {
  //         console.error(err);
  //         callback();
  //       });
  //     });
  //   });
  // },

  // updateRoomCount: function(room, changeDir, callback) {
  //   console.log('update roomCount in userController');


  //   User.findOne({'hash': room}, function(err, doc){
  //     console.log('update room count');

  //     if(doc !== null ){ 

  //       if(changeDir === 'add'){
  //         doc.userCount++;
  //       } else if (changeDir === 'subtract'){
  //         console.log('subtracting...', doc)
  //         doc.userCount--;
  //       }
  //       doc.save();
  //       callback(err, doc.userCount)
  //     }

  //   });
    
  // },


};
