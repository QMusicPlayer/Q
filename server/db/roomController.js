var mongoose = require('mongoose');
var Room = require('./roomModel');
var Sentencer = require('sentencer');
var User = require('./userModel');
module.exports = {

  // generates random room name for user
  generateRoomName: function(req,res,next) {
    res.json(Sentencer.make("{{ adjective }}_{{ noun }}"));
  },

  // saves room to db
  createRoom: function(req, res, next) {
    console.log(req.sessionID)
    console.log('attempting to create room: ', req.body.random_roomname, 'with location ', req.body.location.longitude)
    var newRoom = {
      name: req.body.random_roomname,
      userCount: 1,
      location: req.body.location
    }
    Room.forge(newRoom).save().then(function(){
      console.log('successfully created room', newRoom.name)
      res.json(newRoom);
    })
    .catch(function(error) {
      next(error)
    })
  },

  // gets room from db
  getRooms: function (req, res, next) {
    Room.fetchAll().then(function(rooms){
      res.json(rooms)
    })
  },

  // adds song to playlist within room
  addSong: function(room, song, callback) {
    console.log('attempting to add song', song.title, 'to room: ', room);
    delete song['$$hashKey'];
    Room.forge({name: room}).fetch().then(function(room){
      if(room) {
        if(!room.attributes.queue) {
          var queue = [];
        } else {
          var queue = room.attributes.queue;
        }
        if(queue.map(function(element){return element.id}).indexOf(song.id) < 0) {
          queue.push(song);
          var roomAttr = {
            queue: queue
          }
          room.set(roomAttr).save().then(function(){
            console.log('successfully added song: ', song.title, ', to room: ', room.attributes.name);
           callback(queue);
          })
        } else {
          console.log('song already exists');
        }
      } else {
        console.log('room not found');
      }
    }).catch(function(error){
      console.log('error finding room', error)
    }); 
  },
  
  // gets queue from room
  getQueue: function(room, callback) {
    console.log('gettting queue from db for room', room);
    Room.forge({name: room}).fetch().then(function(room) {
      callback(null, room.attributes.queue);
    }).catch(function(error) {
      console.log('error finding room', error)
      callback(error)
    })
  },

  getListenerCount: function(req, res, next) {
    console.log('getting listener count from db for room', req.params.roomName)
    Room.forge({name: req.params.roomName}).fetch().then(function(room){
      res.status(200).json(room.attributes.userCount);
    }).catch(function(error){
      console.log('error getting user count');
    })
  },

  changeListenerCount: function(req, res, next) {
    console.log('here in room controller')
    Room.forge({name: req.body.roomName}).fetch().then(function(room){
      console.log(room, 'room in room 91')
      if(room) {
        var newRoom = {
          userCount: room.attributes.userCount + req.body.amount
        }

        if(newRoom.userCount === 0) {
          console.log(newRoom.userCount, 'user count')
          room.destroy().then(function(){
            console.log('empty room, deleted');
          }).catch(function(error) {
            console.log('error deleting room', error);
          });
        } else {
          room.set(newRoom).save().then(function(room){
            console.log('success updating userCount');
            res.status(201).json(room.attributes.userCount)
          }).catch(function(error) {
            console.log('error updating userCount', error);
          });
        }
      } else {
        console.log('room not found');
      }
    });
  },

  deleteSong: function (req, res, next) {
    console.log('in room controller', req.params.song)
    Room.forge({name: req.params.roomName}).fetch().then(function(room) {
      var index = room.attributes.queue.map(function(element){return element.id.toString()}).indexOf(req.params.song);
      console.log(index, 'index')
      if(index >= 0) {
        var queue = room.attributes.queue;
        queue.splice(index, 1);
        var newRoom = {
          queue: queue
        }
        room.set(newRoom).save().then(function(room){
          console.log('success deleting song');
          res.status(201).json({id:req.params.song, index:req.params.index});
        }).catch(function(error) {
          console.log('error deleting song', error);
          res.json(error);
        })
        
      }
    })
  },

  updateVotes: function (req, res, next) {
    Room.forge({name: req.body.roomName}).fetch().then(function(room) {
      var queue = room.attributes.queue || [];
      queue[queue.map(function(element){return element.id}).indexOf(req.body.songData.id)].votes = req.body.songData.votes + 1;
      var newRoom = {
        queue: queue
      }
      room.set(newRoom).save().then(function(room){
        console.log('success updating votes');
        var songData = req.body.songData;
        songData.votes++;
        next(null, songData);
      }).catch(function(error) {
        console.log('error updating votes', error);
        next(error, null, null);
      })
    });
  },

  voteToSkip: function (roomName, callback) {
    Room.forge({name: roomName}).fetch().then(function(room) {
      var newRoom = {};
      if(!room.attributes.votesToSkip) {
        newRoom.votesToSkip = 1;
      } else {
        newRoom.votesToSkip = room.attributes.votesToSkip + 1;
      }
      room.set(newRoom).save().then(function(room){
        console.log('success updating vote skip');
        callback(null, room.attributes.votesToSkip);
      }).catch(function(error) {
        console.log('error updating votes', error);
        callback(error, null);
      })
    });
  }

};
