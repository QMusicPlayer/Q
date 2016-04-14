angular.module('Q.services', [
'ionic'
])
.factory('Playlist', function($http){

  var getSongs = function(){
      return $http ({
        method: 'GET',
        url: '/'
      }).then(function(response){
        return response.data;
      });
  }

  var addSong = function (song){
    console.log("adding song: " + song);
    return $http ({
      method: 'POST',
      url: '/',
      data: song
    });
  }

  var createRoom = function(host){
    return $http ({
      method: 'POST',
      url: '/api/rooms',
      data: {
        host: host
      }
    }).then(function(room){
      return room;
    });
  }

  var joinRoom = function(roomName, socketId) {
    return $http ({
      method: 'PUT',
      url: '/api/rooms/',
      data: {
        roomName: roomName,
        socketId: socketId
      }
    }).then(function(result){
      return result;
    })
  }
  // var getQueue = function (roomName) {
  //   console.log('getting queue for room:' roomName);
  //   return
  // }

  var searchSongs = function(query){
    SC.initialize({
      client_id: 'f270bdc572dc8380259d38d8015bdbe7'
    });

    return SC.get('/tracks', {
      q: query,
    }).then(function(tracks) {
      return tracks;
    });
  }

  // var createRoom = function(roomName) {
    
  // }

  // isHostData in factory stores whether or not the current user is the host
  
  var isHostData = false;

  var isHost = function(){
    return isHostData;
  }

  var makeHost = function () {
    return true;
  }

  var makeGuest = function(){
    return false;
  }

  var roomEntered = false;
  var isRoomEntered = function(){
    return roomEntered;
  }

  var enterRoom = function(){
    roomEntered = true;
  }

  return {
    getSongs: getSongs,
    addSong: addSong,
    createRoom: createRoom,
    joinRoom: joinRoom,
    searchSongs: searchSongs,
    makeHost: makeHost,
    makeGuest: makeGuest,
    isHost: isHost,
    isRoomEntered: isRoomEntered,
    enterRoom: enterRoom
  }
})
