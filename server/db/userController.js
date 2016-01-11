var mongoose = require('mongoose');
var User = require('./userModel');

module.exports = {
  addUser: function(req, res, next) {
    var newUser = new User({
      //to check with Harun and Spener
      queue: []
    });
    newUser.save(function(err) {
      if (err) console.log("error saving new user", err);
      else {
        console.log('saved new user');
      }
      // res.end();
    });
  },

  getQueue: function(callback) {
    User.findOne({}, function(err, result) {
      callback(result.queue);
    });
  },

  saveQueue: function(updatedQueue, callback) {
    updatedQueue = updatedQueue.map(function(song) {
      delete song['$$hashKey'];
      return song;
    });
    User.findOne({}, function(err, result) {
      console.log(updatedQueue)
      result.queue = updatedQueue;
      result.save(function(err) {
        console.error(err);
        callback();
      });
    });
  },

  addSong: function(data, callback) {
    delete data['$$hashKey'];
    User.findOne({}, function(err, result) {
      result.queue.push(data);
      result.save(function(err) {
        console.error(err);
        callback();
      });
    });
  },

  deleteSong: function(target, callback) {
    User.findOne({}, function(err, result) {

      console.log(target);
      var deleteLocation;
      result.queue.forEach(function(song, index) {
        console.log('deleting', song)
        if (song.id === target) {
          deleteLocation = index;
        }
      });
      result.queue.splice(deleteLocation, 1);
      result.save(function(err) {
        console.error(err);
        callback();
      });
    });
  }

};