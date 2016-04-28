var mongoose = require('mongoose');
var Room = require('./roomModel');
var Sentencer = require('sentencer');

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
      req.session.hostRoom = req.body.random_roomname;
      console.log('created session', req.session.hostRoom)
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

  findRoomsForUser: function (req, res, next) {
    var rooms;
    Room.find({
      host: req.sessionId
    });
  },

  // joins guest to room
  joinRoom: function(req, res, next){
    Room.forge({name:req.body.roomName}).fetch().then(function(room){
      if(room) {
        if(room.attributes.name !== req.session.hostRoom){
          var updatedUserCount = room.attributes.userCount + 1;
          var roomAttr = {
            userCount: updatedUserCount
          }
          room.set(roomAttr).save().then(function(){
            console.log('successfully added user to room as guest');
            res.status(201).json('successfully joined room as guest');
          }).catch(function(error){
            next(error);
          });
        } else {
          console.log('user is a host, already in room');
          res.json('user is a host');
        }
      } else {
        res.json('room does not exist');
      }
    }).catch(function(error){
      next(error);
    });
        
  },

  leaveRoom: function(req, res, next){
    console.log("finding room", req.body.roomName);
    Room.findOne({name:req.body.roomName}).then(function(room){
      if(room) {
        if(room.host !== req.body.socketId){
          room.guests.push(req.body.socketId);
          room.userCount--;
          room.save().then(function(){
            console.log('successfully added user to room as guest');
            res.json('successfully joined room as guest');
          }).catch(function(error){
            next(error);
          });
        } else {
          console.log('user is a host');
          res.json('user is a host');
        }
      } else {
        res.json('room does not exist');
      }
    }).catch(function(error){
      next(error);
    });
        
  },

  // checks if joining user is a host 
  checkHost: function(req, res, next){
    res.send(req.session.hostRoom);
  },

  // adds song to playlist within room
  addSong: function(room, song, callback) {
    console.log('attempting to add song to room: ', room);
    delete song['$$hashKey'];
    Room.forge({name: room}).fetch().then(function(room){
      console.log(song)
      if(room) {
        if(!room.attributes.queue) {
          var queue = [];
        } else {
          var queue = room.attributes.queue;
        }
        
        if(queue.map(function(element){return element.id}).indexOf(song.id)) {
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
    }); 
  },
  
  // gets queue from room
  getQueue: function(room, callback) {
    console.log('gettting queue from db for room', room);
    Room.forge({name: room}).fetch().then(function(room) {
      
      callback(null, room.attributes.queue);
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
