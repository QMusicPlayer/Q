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
    searchSongs: searchSongs,
    makeHost: makeHost,
    makeGuest: makeGuest,
    isHost: isHost,
    isRoomEntered: isRoomEntered,
    enterRoom: enterRoom
  }
})
.factory('Rooms', function ($http){
  var getRooms = function () {
    return $http ({
      method: 'GET',
      url: '/api/rooms',
    }).then(function(rooms) {
      return rooms;
    })
  };

  var joinRoom = function(roomName, socketId) {
    return $http ({
      method: 'PUT',
      url: '/api/rooms',
      data: {
        roomName: roomName
      }
    }).then(function(result){
      return result;
    })
  };

  var createRoom = function(location){
    return $http ({
      method: "GET",
      url:'/api/generateRoomName'
    }).then(function(roomName){
      return $http ({
        method: 'POST',
        url: '/api/rooms',
        data: {
          random_roomname: roomName.data,
          location: {longitude: location.coords.longitude, latitude: location.coords.latitude}
        }
      }).then(function(room){
        return room;
      });
     })
  };

  var doesUserBelongToOtherRoom = function () {
    return $http ({
      method: 'GET',
      url: '/api/roomListForUser'
    }).then(function(result) {
      console.log(result);
    })
  }

  return {
    getRooms: getRooms,
    joinRoom: joinRoom,
    createRoom: createRoom
  }
})
.factory('Host', function ($http){
  var isUserAHost = function (roomName) {
    console.log('in factory')
    return $http ({
      method: 'GET',
      url: '/api/host',
    }).then(function(result){ 
      return result.data === roomName;
    })
  }

  return {
    isUserAHost: isUserAHost
  }  
})