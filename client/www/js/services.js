angular.module('Q.services', [
'ionic'
])
.factory('Playlist', function($http){

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

  var deleteSong = function(roomName, target) {

    return $http ({
      method: 'DELETE',
      url: '/api/songs/' + roomName + '/' + target.song
    }).then(function(result) {

      return result;
    })
  }

  var updateVotes = function (roomName, songData, client_id) {
    return $http ({
      method: 'PUT', 
      url: '/api/songs',
      data: {
        roomName: roomName,
        songData: songData,
        client_id: client_id
      }
    }).then(function(result) {
      return result;
    })
  }

  return {
    searchSongs: searchSongs,
    deleteSong: deleteSong,
    updateVotes: updateVotes
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
    //temporary fix for testing
    if(!location) {
      var location.coords.longitude = -76;
      var location.coords.latitude = 33;
    }
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

  var getListenerCount = function (roomName) {
    return $http ({
      method: 'GET',
      url: '/api/listeners/' + roomName
    }).then(function(count) {
      return count;
    }).catch(function(error) {
      console.log('ajax error getting listeners', error);
    })
  }

  var changeListenerCount = function(roomName, amount) {
    return $http ({
      method: 'PUT',
      url: '/api/listeners/' + roomName,
      data: {
        roomName: roomName,
        amount: amount
      }
    }).then(function(result){
      return result;
    })
  }

  
  return {
    getRooms: getRooms,
    joinRoom: joinRoom,
    createRoom: createRoom,
    getListenerCount: getListenerCount,
    changeListenerCount: changeListenerCount
  }
})
.factory('User', function ($http){

  var isUserAHost = function (roomName, socketId) {
    return $http ({
      method: 'GET',
      url: '/api/host/' + socketId,
    }).then(function(result){ 
      return result.data === roomName;
    })
  }

  var addUser = function(socketId) {
    return $http ({
      method: 'POST',
      url: '/api/host',
      data: {
        socketId: socketId
      }
    }).then(function(result) {
      return result.data;
    })
  }

  var makeHost = function(roomName, hostId) {
    return $http ({
      method: 'PUT',
      url: '/api/host',
      data: {
        roomName: roomName,
        hostId: hostId
      }
    }).then(function(result) {
      return result;
    })
  }

  var makeGuest = function(roomName, guestId) {
    return $http ({
      method: 'PUT',
      url: '/api/guest',
      data: {
        roomName: roomName,
        guestId: guestId,
      }
    }).then(function(result) {
      return result.data;
    })
  }

  return {
    isUserAHost: isUserAHost,
    makeHost: makeHost,
    makeGuest: makeGuest,
    addUser: addUser
  }  
})