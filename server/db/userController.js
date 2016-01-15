var mongoose = require('mongoose');
var User = require('./userModel');

module.exports = {
  addUser: function(room, callback) {
    var newUser = new User({
      //to check with Harun and Spener
      hash: room,
      queue: []
    });
    newUser.save(function(err, result) {
      if (err) {
        console.log("error saving new user", err);
        callback(err, result);
      } else {
        console.log('saved new user');
        console.log(err, result);
        callback(err, result);
      }
      // res.end();
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
    });
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
    User.findOne({hash: room}, function(err, user) {
      if (!user) return;
      for (var i = 0; i < user.queue.length; i++) {
        if (user.queue[i].id === data.id) {
          console.log('match found' + user.queue[i].title);
          user.queue[i].votes = data.votes;
          console.log(user.queue[i].votes);
          user.save(function(err) {
            console.error(err);
            callback();
          });
        }
      }
      
    });
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
  }

};
