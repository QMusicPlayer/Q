var userController = require('./db/userController');
var roomController = require('./db/roomController')
module.exports = function (app, express) {
  app.post('/api/rooms', roomController.createRoom);
  app.get('/api/rooms', roomController.getRooms);
  app.get('/api/host/:socketId', userController.checkHost);
  app.put('/api/host', userController.makeHost);
  app.put('/api/guest', userController.makeGuest);
  app.post('/api/host', userController.addUser);
  // app.get('/api/roomListForUser', roomController.findRoomsForUser);
  app.get('/api/generateRoomName', roomController.generateRoomName);
  app.put('/api/rooms', roomController.joinRoom);
};


