 module.exports = function(socket) {
    var room;
      for(var key in socket.rooms){
        if(key[0] !== '/'){
          room = key;
        }
      }
      return room;
 };

