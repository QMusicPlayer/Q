var mongoose = require('mongoose');
var User = require('./userModel');
var Room = require('./roomModel');

module.exports = {
  addUser: function(req, res, next) {
    User.forge({socketId: req.body.socketId}).save().then(function(user) {
      console.log('added user to db');
      res.status(200).json(user);
    }).catch(function(err){
      console.log('error adding user', err);
      next(err);
    });
  },

  makeHost: function(req, res, next) {
    User.forge({socketId: req.body.hostId}).fetch().then(function(user){
      if(user) {
        user.set({hostRoom: req.body.roomName, guestRoom: null}).save().then(function(){
          res.status(201).json('successfully made user host')
        }).catch(function(error) {
          next(error);
        })
      } else {
        res.status(400).json('user not found')
      }
    }).catch(function(error) {
      console.log('error making user host', error)
    })
  },

  makeGuest: function(req, res, next) {
    User.forge({socketId: req.body.guestId}).fetch().then(function(user){
      if(user) {
        if(user.attributes.hostRoom !== req.body.roomName) {
          user.set({guestRoom: req.body.roomName}).save().then(function(){
            Room.forge({name: req.body.roomName}).fetch().then(function(room){
              if(room) {
                var newRoom = {
                  userCount: room.attributes.userCount + 1
                }
                room.set(newRoom).save().then(function(room){
                  console.log('success updating userCount');
                }).catch(function(error) {
                  console.log('error updating userCount', error);
                })
              }
            });
            res.status(201).json('guest')
          }).catch(function(error) {
            next(error);
          });          
        } else {
          res.status(201).json('host');
        }
      } else {
        res.status(400).json('user not found')
      }
    }).catch(function(error) {
      console.log('error making user guest', error)
    });
  },

  // checks if joining user is a host 
  checkHost: function(req, res, next){
    User.forge({socketId: req.params.socketId}).fetch().then(function(user) {
      if(user){
        console.log('got user')
        res.status(200).json(user.attributes.hostRoom)  
      }
    }).catch(function(error){
      console.log('error getting user information', error)
      next(error)
    })
  },

  deleteUser: function(id) {
    User.forge({socketId: id}).fetch().then(function(user) {
      if(user) {
        // decrease user count
        console.log(user)
        var roomName = user.attributes.guestRoom || user.attributes.hostRoom;
        if(roomName){
          Room.forge({name: roomName}).fetch().then(function(room){
            if(room) {
              // room deletion if there are zero users
              if(room.attributes.userCount === 1) {
                room.destroy().then(function(){
                  console.log('empty room, deleted');
                }).catch(function(error) {
                  console.log('error deleting room', error);
                });
              } else {
                var newRoom = {
                  userCount: room.attributes.userCount - 1
                }
                room.set(newRoom).save().then(function(room){
                  console.log('success updating userCount');
                }).catch(function(error) {
                  console.log('error updating userCount', error);
                });
              }
            }
          });
        }
        user.destroy().then(function() {
          console.log('successfully deleted user')
        }).catch(function(error) {
          console.log('error deleting user', error)
        })
      }
    }).catch(function(error) {
      console.log('error finding user to delete', error)
    })
  }

  // getRoom: function(room, callback){
  //   console.log("getRoom", room);
  //   User.findOne({hash:room}, function(err, result){
  //     console.log(err, result);
  //     if(err){
  //       console.log(err);
  //       callback(err);
  //     } else{
  //       console.log(result);
  //       callback(err, result);
  //     }
  //   });
  // },

  // getQueue: function(room, callback) {
  //   console.log('getQueue', room);
  //   User.findOne({hash: room}, function(err, result) {
  //     if(!result) return;
  //     console.log(result);
  //     callback(err, result.queue);
  //   });
  // },

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
  //   });io.to(socket.id).emit('roomjoined', result.name);
  // },

  // addSong: function(room, data, callback) {
  //   console.log("addSong, room:", room);
  //   delete data['$$hashKey'];
  //   User.findOne({hash: room}, function(err, result) {
  //     console.log("addSong", result);
  //     if(!result) return;
  //     var alreadyAdded = false;
  //     result.queue.forEach(function(song) {
  //       if (data.id === song.id) {
  //         alreadyAdded = true;
  //       }
  //     });
  //     if (!alreadyAdded) {
  //       result.queue.push(data);
  //       result.save(function(err) {
  //         console.error(err);
  //         callback();
  //       });
  //     } else {
  //       return;
  //     }
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
