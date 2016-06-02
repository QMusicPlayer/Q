var userController = require('./db/userController');
var roomController = require('./db/roomController')
var db = require('./db/dbConfig')
module.exports = function (app, express) {
  app.post('/api/rooms', roomController.createRoom);
  app.get('/api/rooms', roomController.getRooms);

  // returns host room of a specific user
  app.get('/api/host/:socketId', userController.checkHost);
  //designates specific user as a host of a specfic room
  app.put('/api/host', userController.makeHost);
  //creates new user in the database
  app.post('/api/host', userController.addUser);
  // returns number of listeners in a specific room
  app.get('/api/listeners/:roomName', roomController.getListenerCount)
  // increases or decreases listener count
  app.put('/api/listeners/:roomName', roomController.changeListenerCount)
  //designates specific user as a guest of a specfic room
  app.put('/api/guest', userController.makeGuest);
  //generates random room name
  app.get('/api/generateRoomName', roomController.generateRoomName);
  // deletes song from db
  app.delete('/api/songs/:roomName/:song/:index', roomController.deleteSong);
  app.put('/api/songs', function(request, response) {
    userController.castVote(request.body.songData, request.body.client_id, function(err, alreadyVoted) {
      if(err) {
        response.status(500).send(err);
      }

      if(!alreadyVoted) {
        roomController.updateVotes(request, response, function(err, songData) {
          if(err) {
            response.status(500).send(err)
          }
          console.log(songData, 'updated song data')
          response.status(201).json(songData);   
        }) 
      }
    })
  });

  app.get('/api/testing', function(request, response) {
    response.status(200).send(process.env)
  })

  app.get('/api/resetDb', function(request, response) {
    db.resetEverythingPromise().then(function(){
      response.status(201).send('successfully reset db with data');
    }).catch(function(err){
      response.status(500).send(err);
      return;
    });
  })
};


