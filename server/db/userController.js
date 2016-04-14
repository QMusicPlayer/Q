var mongoose = require('mongoose');
var User = require('./userModel');

module.exports = {
  addUser: function(id, room, callback) {
    console.log('finding user with id: ' + id)
    User.findOne({socketId: id}, function(err, result) {
      if(err) {
        console.log('error finding user. Error: ' + err);
        callback(err);
      } else {
        if(result !== null) {
          console.log('user found', result)
          result.rooms.push(room);
          console.log('sucessfullt added room to existing user', result)
        } else {
          console.log('no user found, adding new user')
          newUser = new User({
            socketId: id,
            rooms: [room]
          })
          newUser.save(function(err, result){
            if(err) {
              console.log('error adding user', err);
            } else {
              console.log('add user success', newUser)
            }
          })
        }
      }
    });
  },

  getRoom: function(room, callback){
    console.log("getRoom", room);
    User.findOne({hash:room}, function(err, result){
      console.log(err, result);
      if(err){
        console.log(err);
        callback(err);
      } else{
        console.log(result);
        callback(err, result);
      }
    });
  },

  getQueue: function(room, callback) {
    console.log('getQueue', room);
    User.findOne({hash: room}, function(err, result) {
      if(!result) return;
      console.log(result);
      callback(err, result.queue);
    });
  },

  saveQueue: function(room, updatedQueue, callback) {
    updatedQueue = updatedQueue.map(function(song) {
      delete song['$$hashKey'];
      return song;
    });
    User.findOne({hash: room}, function(err, result) {
      console.log("saveQueue", result);

      if(!result){
      }
      console.log(updatedQueue)
      result.queue = updatedQueue;
      result.save(function(err) {
        console.error(err);
        callback();
      });
    });io.to(socket.id).emit('roomjoined', result.name);
  },

  addSong: function(room, data, callback) {
    console.log("addSong, room:", room);
    delete data['$$hashKey'];
    User.findOne({hash: room}, function(err, result) {
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

  updateVotes: function(room, data, callback) {
    console.log('update votes in userController');
    User.update({'hash': room, 'queue.id': data.id}, {'queue.$.votes': data.votes}, callback);
    // User.findOne({hash: room}, function(err, user) {
    //   if (!user) return;
    //   for (var i = 0; i < user.queue.length; i++) {
    //     if (user.queue[i].id === data.id) {
    //       console.log('match found' + user.queue[i].title);
    //       user.queue[i].votes = data.votes;
    //       console.log(user.queue[i].votes);
    //       user.save(function(err) {
    //         console.error(err);
    //         callback();
    //         if (!err) {
    //           console.log('alegadly saved votes')
    //         }
    //       });
    //     }
    //   }
      
    // });
  },

  deleteSong: function(room, target, callback) {
    User.findOne({hash: room}, function(err, result) {
      if(!result) return;

      console.log(target);
      var deleteLocations = [];
      result.queue.forEach(function(song, index) {
        console.log('deleting', song)
        if (song.id === target) {
          deleteLocations.push(index);
        }
      });
      deleteLocations.forEach(function(deleteLocation) {
        result.queue.splice(deleteLocation, 1);
        result.save(function(err) {
          console.error(err);
          callback();
        });
      });
    });
  },

  updateRoomCount: function(room, changeDir, callback) {
    console.log('update roomCount in userController');


    User.findOne({'hash': room}, function(err, doc){
      console.log('update room count');

      if(doc !== null ){ 

        if(changeDir === 'add'){
          doc.userCount++;
        } else if (changeDir === 'subtract'){
          console.log('subtracting...', doc)
          doc.userCount--;
        }
        doc.save();
        callback(err, doc.userCount)
      }

    });
    
  },


};
