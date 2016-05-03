var userController = require('./db/userController');
var roomController = require('./db/roomController')
module.exports = function (app, express) {
  app.post('/api/rooms', roomController.createRoom);
  app.get('/api/rooms', roomController.getRooms);

  // returns host room of a specific user
  app.get('/api/host/:socketId', userController.checkHost);
  // returns number of listeners in a specific room
  app.get('/api/listeners/:roomName', roomController.getListenerCount)
  // increases or decreases listener count
  app.put('/api/listeners/:roomName', roomController.changeListenerCount)
  //designates specific user as a host of a specfic room
  app.put('/api/host', userController.makeHost);
  //designates specific user as a guest of a specfic room
  app.put('/api/guest', userController.makeGuest);
  //creates new user in the database
  app.post('/api/host', userController.addUser);
  //generates random room name
  app.get('/api/generateRoomName', roomController.generateRoomName);
  app.delete('/api/songs/:roomName/:song', roomController.deleteSong);
};


