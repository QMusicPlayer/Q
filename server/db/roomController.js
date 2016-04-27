var mongoose = require('mongoose');
var Room = require('./roomModel');
var Sentencer = require('sentencer');

module.exports = {

  generateRoomName: function(req,res,next) {
    res.json(Sentencer.make("{{ adjective }}_{{ noun }}"));
  },

  createRoom: function(req, res, next) {
    console.log(req.body)
    console.log('attempting to create room: ', req.body.random_roomname, 'with location ', req.body.location.longitude)
    var newRoom = new Room({
      name: req.body.random_roomname,
      host: req.body.host,
      userCount: 1,
      guests: [],
      location: req.body.location,
      queue: []
    });
    newRoom.save().then(function(){
      console.log('successfully created room', newRoom)
      req.session.hostRoom = req.body.random_roomname;
      console.log('created session', req.session.hostRoom)
      res.json(newRoom);
    })
    .catch(function(error) {
      next(error)
    })
  },

  getRooms: function (req, res, next) {
    Room.find().then(function(rooms){
      res.json(rooms)
    })
  },

  joinRoom: function(req, res, next){
    console.log("finding room", req.body.roomName);

    Room.findOne({name:req.body.roomName}).then(function(room){
      if(room) {
        if(room.host !== req.body.socketId){
          room.guests.push(req.body.socketId);
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

  checkHost: function(req, res, next){
    console.log('session room name' ,req.session.hostRoom)
    res.send(req.session.hostRoom);
  },

  addSong: function(room, song, callback) {
    console.log('attempting to add song to room: ', room);
    delete song['$$hashKey'];
    Room.findOne({name: room}).then(function(room){
      if(room) {
        if(room.queue.map(function(element){return element.id}).indexOf(song.id)) {
          room.queue.push(song);
          room.save().then(function(){
            console.log('successfully added song: ', song.title, ', to room: ', room.name);
           callback(room.queue);
          }).catch(function(error){
            console.log('error adding song:', error);
          });
        } else {
          console.log('song already exists');
        }
      } else {
        console.log('room not found');
      }
    }); 
  },
  
  getQueue: function(room, callback) {
    console.log('gettting queue from db for room', room);
    Room.findOne({name: room}, function(err, result) {
      if(!result) return;
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
